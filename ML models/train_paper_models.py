import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.ensemble import RandomForestClassifier
import joblib
import shap
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

DATA_PATH = Path(r"C:\Users\Samuel\Desktop\NORI\data\synthetic_shrimp_weekly_growth.csv")
OUT_DIR = Path(r"C:\Users\Samuel\Desktop\NORI\data\paper_outputs")
MODEL_DIR = Path(r"C:\Users\Samuel\Desktop\NORI\data\models")
OUT_DIR.mkdir(parents=True, exist_ok=True)
MODEL_DIR.mkdir(parents=True, exist_ok=True)

TARGET = "weekly_growth_g"

# Core features from paper (Table II) + derived features
FEATURES = [
    "age_days",
    "avg_weight_g",
    "shrimp_count",
    "biomass_kg",
    "temperature_c",
    "do_mg_l",
    "do_min_mg_l",
    "nh3_mg_l",
    "tan_mg_l",
    "seaweed_biomass_kg",
    "feed_input_kg",
    # Derived features
    "feeding_rate_actual",
    "shrimp_seaweed_ratio",
    "buffer_index",
    "oxygen_stress",
    "thermal_stress",
    # Additional paper-referenced water quality context
    "ph",
    "salinity_ppt",
    # Culture type (important in paper)
    "culture_type",
]

# Optional columns (kept for analysis, not required)
OPTIONAL = ["culture_type", "ph", "salinity_ppt", "pond_id"]


def load_data():
    df = pd.read_csv(DATA_PATH)
    # Ensure required cols
    missing = [c for c in FEATURES + [TARGET] if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns: {missing}")
    return df


def time_split_by_pond(df: pd.DataFrame, train_frac: float = 0.8):
    # Preserve temporal order within each pond using age_days
    train_idx = []
    test_idx = []
    for pond_id, g in df.groupby("pond_id"):
        if "week_index" in g.columns:
            g_sorted = g.sort_values("week_index")
        else:
            g_sorted = g.sort_values("age_days")
        n = len(g_sorted)
        cut = int(np.floor(n * train_frac))
        train_idx.extend(g_sorted.index[:cut])
        test_idx.extend(g_sorted.index[cut:])
    return df.loc[train_idx], df.loc[test_idx]


def evaluate(y_true, y_pred):
    return {
        "r2": float(r2_score(y_true, y_pred)),
        "rmse": float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "mae": float(mean_absolute_error(y_true, y_pred)),
    }


def main():
    df = load_data()

    train_df, test_df = time_split_by_pond(df, train_frac=0.8)

    # One-hot encode culture_type
    X_train = pd.get_dummies(train_df[FEATURES], columns=["culture_type"], drop_first=True)
    X_test = pd.get_dummies(test_df[FEATURES], columns=["culture_type"], drop_first=True)
    # Align columns
    X_test = X_test.reindex(columns=X_train.columns, fill_value=0)

    y_train = train_df[TARGET]
    y_test = test_df[TARGET]


    # XGBoost (paper configuration)
    # XGBoost tuning grid (lightweight)
    xgb_param_grid = [
        {"max_depth": 5, "min_child_weight": 1, "gamma": 0.0},
        {"max_depth": 6, "min_child_weight": 1, "gamma": 0.0},
        {"max_depth": 7, "min_child_weight": 1, "gamma": 0.0},
        {"max_depth": 6, "min_child_weight": 5, "gamma": 0.0},
        {"max_depth": 6, "min_child_weight": 1, "gamma": 0.1},
    ]

    best = {"score": -np.inf, "model": None, "params": None, "pred": None}

    for params in xgb_param_grid:
        xgb = XGBRegressor(
            n_estimators=800,
            max_depth=params["max_depth"],
            min_child_weight=params["min_child_weight"],
            gamma=params["gamma"],
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="reg:squarederror",
            random_state=42,
            n_jobs=1,
        )
        # Early stopping using a validation slice from train
        val_cut = int(len(X_train) * 0.85)
        X_tr, X_val = X_train.iloc[:val_cut], X_train.iloc[val_cut:]
        y_tr, y_val = y_train.iloc[:val_cut], y_train.iloc[val_cut:]

        xgb.fit(
            X_tr,
            y_tr,
            eval_set=[(X_val, y_val)],
            verbose=False,
        )

        pred = xgb.predict(X_test)
        metrics = evaluate(y_test, pred)
        if metrics["r2"] > best["score"]:
            best = {"score": metrics["r2"], "model": xgb, "params": params, "pred": pred, "metrics": metrics}

    xgb = best["model"]
    xgb_pred = best["pred"]
    xgb_metrics = best["metrics"]

    # LightGBM (paper comparison model; default auto params)
    lgbm = LGBMRegressor(
        random_state=42,
        n_estimators=800,
        learning_rate=0.05,
        max_depth=-1,
        num_leaves=63,
    )
    lgbm.fit(X_train, y_train)
    lgbm_pred = lgbm.predict(X_test)
    lgbm_metrics = evaluate(y_test, lgbm_pred)

    # SHAP for XGBoost
    # Use up to 2000 test rows for speed (paper uses 2,000)
    shap_sample = X_test.sample(min(2000, len(X_test)), random_state=42)
    explainer = shap.TreeExplainer(xgb)
    shap_values = explainer.shap_values(shap_sample)

    # Feature importance (mean |SHAP|)
    mean_abs = np.abs(shap_values).mean(axis=0)
    shap_importance = pd.Series(mean_abs, index=FEATURES).sort_values(ascending=False)
    shap_importance.to_csv(OUT_DIR / "xgb_shap_importance.csv")

    # Save models
    joblib.dump(xgb, MODEL_DIR / "xgb_weekly_growth.pkl")
    joblib.dump(lgbm, MODEL_DIR / "lgbm_weekly_growth.pkl")

    # Metrics
    metrics = {
        "xgboost": xgb_metrics,
        "xgboost_best_params": best["params"],
        "lightgbm": lgbm_metrics,
        "train_rows": len(train_df),
        "test_rows": len(test_df),
    }
    (OUT_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    # Save test predictions for inspection
    out_pred = test_df[["pond_id", "age_days", TARGET]].copy()
    out_pred["xgb_pred"] = xgb_pred
    out_pred["lgbm_pred"] = lgbm_pred
    out_pred.to_csv(OUT_DIR / "test_predictions.csv", index=False)

    print("Saved outputs to", OUT_DIR)
    print("XGBoost metrics", xgb_metrics)
    print("LightGBM metrics", lgbm_metrics)


if __name__ == "__main__":
    main()

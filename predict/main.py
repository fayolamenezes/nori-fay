import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models once on startup
xgb  = joblib.load("xgb_weekly_growth.pkl")
lgbm = joblib.load("lgbm_weekly_growth.pkl")

# Exact feature order from training
FEATURES = [
    "age_days", "avg_weight_g", "shrimp_count", "biomass_kg",
    "temperature_c", "do_mg_l", "do_min_mg_l", "nh3_mg_l",
    "tan_mg_l", "seaweed_biomass_kg", "feed_input_kg",
    "feeding_rate_actual", "shrimp_seaweed_ratio", "buffer_index",
    "oxygen_stress", "thermal_stress", "ph", "salinity_ppt",
    "culture_type_IMTA"  # one-hot encoded (drop_first=True)
]

class PredictRequest(BaseModel):
    age_days: float = 45
    avg_weight_g: float = 12.5
    shrimp_count: float = 15000
    biomass_kg: float = 187.5
    temperature_c: float = 28.5
    do_mg_l: float = 6.0
    do_min_mg_l: float = 5.2
    nh3_mg_l: float = 0.03
    tan_mg_l: float = 0.6
    seaweed_biomass_kg: float = 125.0
    feed_input_kg: float = 50.0
    feeding_rate_actual: float = 0.03
    shrimp_seaweed_ratio: float = 7.4
    buffer_index: float = 10000.0
    oxygen_stress: float = 0
    thermal_stress: float = 0
    ph: float = 7.8
    salinity_ppt: float = 31.0
    culture_type: str = "IMTA"

@app.post("/predict")
def predict(req: PredictRequest):
    row = {
        "age_days":            req.age_days,
        "avg_weight_g":        req.avg_weight_g,
        "shrimp_count":        req.shrimp_count,
        "biomass_kg":          req.biomass_kg,
        "temperature_c":       req.temperature_c,
        "do_mg_l":             req.do_mg_l,
        "do_min_mg_l":         req.do_min_mg_l,
        "nh3_mg_l":            req.nh3_mg_l,
        "tan_mg_l":            req.tan_mg_l,
        "seaweed_biomass_kg":  req.seaweed_biomass_kg,
        "feed_input_kg":       req.feed_input_kg,
        "feeding_rate_actual": req.feeding_rate_actual,
        "shrimp_seaweed_ratio":req.shrimp_seaweed_ratio,
        "buffer_index":        req.buffer_index,
        "oxygen_stress":       req.oxygen_stress,
        "thermal_stress":      req.thermal_stress,
        "ph":                  req.ph,
        "salinity_ppt":        req.salinity_ppt,
        "culture_type_IMTA":   1 if req.culture_type == "IMTA" else 0,
    }
    X = pd.DataFrame([row])[FEATURES]
    xgb_pred  = float(xgb.predict(X)[0])
    lgbm_pred = float(lgbm.predict(X)[0])
    ensemble  = (xgb_pred + lgbm_pred) / 2

    return {
        "xgb":      round(xgb_pred,  3),
        "lgbm":     round(lgbm_pred, 3),
        "ensemble": round(ensemble,  3),
        "low":      round(ensemble * 0.87, 3),
        "high":     round(ensemble * 1.13, 3),
    }

@app.get("/health")
def health():
    return {"status": "ok"}
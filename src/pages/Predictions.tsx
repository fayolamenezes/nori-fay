import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
import { canCallGemini, markGeminiStart, markGeminiEnd } from '@/lib/geminiRateLimit';

const PREDICT_URL = 'https://nori-predict.onrender.com/predict';

const MODEL_METRICS = [
  { label: 'XGBoost R²', value: '0.9057' },
  { label: 'LightGBM R²', value: '0.9072' },
  { label: 'RMSE', value: '0.0932 g' },
  { label: 'MAE', value: '0.0723 g' },
  { label: 'Train Rows', value: '8,000' },
  { label: 'Test Rows', value: '2,000' },
];

const SHAP_DATA = [
  { label: 'age_days', pct: 12.52, positive: true },
  { label: 'seaweed_biomass_kg', pct: 8.73, positive: true },
  { label: 'avg_weight_g', pct: 6.59, positive: true },
  { label: 'nh3_mg_l', pct: 2.17, positive: false },
  { label: 'salinity_ppt', pct: 1.18, positive: true },
  { label: 'do_min_mg_l', pct: 0.99, positive: true },
  { label: 'shrimp_seaweed_ratio', pct: 0.75, positive: false },
  { label: 'do_mg_l', pct: 0.32, positive: true },
];

const SLIDERS = [
  { key: 'temperature_c', label: 'Temperature', unit: '°C', min: 25, max: 35, step: 0.1, default: 28.5, live: true },
  { key: 'ph', label: 'pH Level', unit: '', min: 6.5, max: 9.0, step: 0.05, default: 7.8, live: true },
  { key: 'tds_ppm', label: 'TDS', unit: 'ppm', min: 0, max: 2000, step: 10, default: 250, live: true },
  { key: 'age_days', label: 'Shrimp Age', unit: 'd', min: 20, max: 100, step: 1, default: 45, live: false },
  { key: 'seaweed_biomass_kg', label: 'Seaweed Biomass', unit: 'kg', min: 0, max: 300, step: 5, default: 125, live: false },
];

type Params = Record<string, number>;

function statusOf(g: number) {
  if (g >= 0.8) return { label: 'Optimal', color: 'text-[hsl(158,48%,28%)]', bg: 'bg-[hsl(158,48%,96%)]', border: 'border-[hsl(158,48%,78%)]' };
  if (g >= 0.55) return { label: 'Good', color: 'text-[hsl(191,70%,28%)]', bg: 'bg-[hsl(191,70%,96%)]', border: 'border-[hsl(191,70%,75%)]' };
  if (g >= 0.35) return { label: 'Moderate', color: 'text-[hsl(36,72%,34%)]', bg: 'bg-[hsl(36,72%,96%)]', border: 'border-[hsl(36,72%,72%)]' };
  return { label: 'Poor', color: 'text-[hsl(0,62%,40%)]', bg: 'bg-[hsl(0,62%,97%)]', border: 'border-[hsl(0,62%,80%)]' };
}

function getCacheKey(p: Params): string {
  return [
    Math.round(p.temperature_c * 10) / 10,
    Math.round(p.ph * 10) / 10,
    Math.round(p.tds_ppm / 50) * 50,
    p.age_days,
    Math.round(p.seaweed_biomass_kg / 25) * 25,
  ].join('_');
}

const Predictions = () => {
  const defaults: Params = Object.fromEntries(SLIDERS.map(s => [s.key, s.default]));
  const [params, setParams] = useState<Params>(defaults);
  const [result, setResult] = useState<null | { g: number; low: number; high: number } & ReturnType<typeof statusOf>>(null);
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [predLoading, setPredLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const aiCache = useRef<Record<string, string>>({});

  const predict = async () => {
    if (loading || predLoading) return;
    setPredLoading(true);

    try {
      const res = await fetch(PREDICT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature_c:      params.temperature_c,
          ph:                 params.ph,
          age_days:           params.age_days,
          seaweed_biomass_kg: params.seaweed_biomass_kg,
          // rest use model defaults
        }),
      });

      const data = await res.json();
      const g = data.ensemble;
      const st = statusOf(g);
      setResult({ g, low: data.low, high: data.high, ...st });

      const cacheKey = getCacheKey(params);
      if (aiCache.current[cacheKey]) {
        setAiText(aiCache.current[cacheKey]);
        return;
      }
      if (!canCallGemini()) {
        setAiText('Rate limit reached — please wait a moment and try again.');
        return;
      }
      if (cooldown) return;
      setCooldown(true);
      setTimeout(() => setCooldown(false), 8000);
      getAI(g, params, cacheKey);

    } catch {
      setResult(null);
      setAiText('Prediction failed — check if the model server is running.');
    } finally {
      setPredLoading(false);
    }
  };

  const getAI = async (g: number, p: Params, cacheKey: string) => {
    if (abort.current) abort.current.abort();
    abort.current = new AbortController();
    setLoading(true); setAiText('');
    markGeminiStart();
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    const prompt = `You are an expert aquaculture scientist for an IMTA shrimp farm.
XGBoost + LightGBM model (R²=0.907) predicted ${g.toFixed(3)} g/week growth.
Inputs: Temp=${p.temperature_c}°C, pH=${p.ph}, TDS=${p.tds_ppm}ppm, Age=${p.age_days}d, Seaweed=${p.seaweed_biomass_kg}kg.
Write exactly 3 numbered insights. Plain text only, no markdown. Max 22 words each. Be specific and actionable.`;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }), signal: abort.current.signal }
      );
      if (res.status === 429) {
        setAiText('Rate limit reached — please wait a moment and try again.');
        return;
      }
      const d = await res.json();
      const text = d?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      aiCache.current[cacheKey] = text;
      setAiText(text);
    } catch { setAiText(''); }
    finally { setLoading(false); markGeminiEnd(); }
  };

  const maxPct = SHAP_DATA[0].pct;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Growth Predictions"
        description="XGBoost + LightGBM ensemble · trained on 10,000 IMTA pond records"
      />

      <div className="grid grid-cols-3 md:grid-cols-6 bg-white border border-[hsl(220,16%,80%)] divide-x divide-[hsl(220,16%,85%)] shadow-[0_1px_3px_hsl(220,20%,80%/0.5)]">
        {MODEL_METRICS.map(m => (
          <div key={m.label} className="px-4 py-3.5">
            <p className="text-[11px] font-mono font-medium uppercase tracking-wider text-[hsl(220,18%,45%)] mb-1">{m.label}</p>
            <p className="text-[15px] font-mono font-semibold text-[hsl(220,30%,12%)]">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7 bg-white border border-[hsl(220,16%,80%)] shadow-[0_1px_3px_hsl(220,20%,80%/0.5)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[hsl(220,30%,12%)]" style={{ fontFamily: 'Syne, sans-serif' }}>Input Parameters</h3>
              <p className="text-[12px] font-mono text-[hsl(220,18%,42%)] mt-0.5">
                <span className="text-[hsl(191,70%,32%)] font-semibold">● live sensor</span>
                <span className="mx-2 text-[hsl(220,16%,75%)]">·</span>
                <span>○ context field</span>
              </p>
            </div>
            <button onClick={() => { setParams(defaults); setResult(null); setAiText(''); }}
              className="flex items-center gap-1.5 text-[13px] font-mono text-[hsl(220,18%,42%)] hover:text-[hsl(220,30%,12%)] transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />Reset
            </button>
          </div>

          <div className="space-y-6">
            {SLIDERS.map(({ key, label, unit, min, max, step, live }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', live ? 'bg-[hsl(191,70%,32%)] ticker-live' : 'bg-[hsl(220,16%,72%)]')} />
                    <span className="text-[14px] font-medium text-[hsl(220,25%,18%)] font-mono">{label}</span>
                  </div>
                  <span className="text-[14px] font-mono font-semibold text-[hsl(220,30%,12%)] tabular-nums">
                    {step < 1 ? params[key].toFixed(step < 0.05 ? 2 : 1) : params[key]}{unit ? ` ${unit}` : ''}
                  </span>
                </div>
                <input type="range" min={min} max={max} step={step} value={params[key]}
                  onChange={e => setParams(p => ({ ...p, [key]: parseFloat(e.target.value) }))}
                  className="w-full h-1 cursor-pointer accent-[hsl(191,70%,32%)]"
                  style={{ background: `hsl(220,16%,85%)` }} />
                <div className="flex justify-between mt-1">
                  <span className="text-[11px] text-[hsl(220,18%,52%)] font-mono">{min}{unit}</span>
                  <span className="text-[11px] text-[hsl(220,18%,52%)] font-mono">{max}{unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-[hsl(220,16%,85%)] flex justify-end">
            <button onClick={predict} disabled={loading || predLoading || cooldown}
              className="px-7 py-2.5 bg-[hsl(191,70%,32%)] text-white text-[13px] font-mono font-semibold tracking-wide hover:bg-[hsl(191,70%,28%)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {predLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {predLoading ? 'Predicting...' : cooldown ? 'Please wait...' : 'Run Prediction'}
            </button>
          </div>
        </div>

        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="bg-white border border-[hsl(220,16%,80%)] shadow-[0_1px_3px_hsl(220,20%,80%/0.5)] p-6 flex-1 min-h-[200px]">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-5">Predicted Weekly Growth</p>
            <AnimatePresence mode="wait">
              {predLoading ? (
                <motion.div key="predload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5 mt-4">
                  {[60, 40, 80].map((w, i) => <div key={i} className="h-3 skeleton" style={{ width: `${w}%` }} />)}
                </motion.div>
              ) : result ? (
                <motion.div key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-baseline gap-2 mb-5">
                    <span className="text-5xl font-mono font-semibold text-[hsl(220,30%,10%)] tabular-nums leading-none">{result.g.toFixed(3)}</span>
                    <span className="text-lg font-mono text-[hsl(220,18%,42%)]">g / wk</span>
                  </div>
                  <div className={cn('inline-flex items-center gap-2 px-3 py-1 border text-[12px] font-mono font-semibold mb-5', result.bg, result.border, result.color)}>
                    {result.label}
                  </div>
                  <div className="space-y-2 pt-4 border-t border-[hsl(220,16%,88%)]">
                    <div className="flex justify-between text-[13px] font-mono">
                      <span className="text-[hsl(220,18%,42%)]">95% Confidence Interval</span>
                      <span className="text-[hsl(220,30%,12%)] font-semibold">{result.low} — {result.high} g</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" className="flex items-center justify-center py-10 flex-col gap-2 opacity-40">
                  <TrendingUp className="w-8 h-8 text-[hsl(220,18%,55%)]" />
                  <p className="text-[13px] font-mono text-[hsl(220,18%,45%)]">Adjust parameters and predict</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white border border-[hsl(220,16%,80%)] shadow-[0_1px_3px_hsl(220,20%,80%/0.5)] p-6 flex-1 min-h-[160px]">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)]">Gemini Analysis</p>
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[hsl(191,70%,32%)]" />}
            </div>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5">
                  {[85, 72, 58].map((w, i) => <div key={i} className="h-3 skeleton" style={{ width: `${w}%` }} />)}
                </motion.div>
              ) : aiText ? (
                <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {aiText.split('\n').filter(Boolean).map((line, i) => (
                    <p key={i} className="text-[13px] font-mono text-[hsl(220,25%,22%)] leading-relaxed mb-2">{line}</p>
                  ))}
                </motion.div>
              ) : (
                <p key="ph" className="text-[13px] font-mono text-[hsl(220,18%,55%)]">Run prediction to get AI insights</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[hsl(220,16%,80%)] shadow-[0_1px_3px_hsl(220,20%,80%/0.5)] p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-[hsl(220,30%,12%)]" style={{ fontFamily: 'Syne, sans-serif' }}>SHAP Feature Importance</h3>
          <div className="flex items-center gap-5 text-[12px] font-mono text-[hsl(220,18%,42%)]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block bg-[hsl(191,70%,32%)]" />positive driver</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block bg-[hsl(0,62%,46%)]" />stressor</span>
          </div>
        </div>
        <p className="text-[12px] font-mono text-[hsl(220,18%,42%)] mb-6">Real values from XGBoost model · source: xgb_shap_importance.csv</p>
        <div className="space-y-3.5">
          {SHAP_DATA.map(({ label, pct, positive }, i) => (
            <div key={label} className="flex items-center gap-4">
              <span className="text-[13px] font-mono text-[hsl(220,20%,30%)] w-48 text-right shrink-0">{label}</span>
              <div className="flex-1 h-4 bg-[hsl(220,16%,92%)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${(pct / maxPct) * 100}%` }}
                  transition={{ delay: i * 0.04 + 0.1, duration: 0.5, ease: 'easeOut' }}
                  className={positive ? 'h-full bg-[hsl(191,70%,32%)]' : 'h-full bg-[hsl(0,62%,46%)]'}
                />
              </div>
              <span className="text-[13px] font-mono font-semibold text-[hsl(220,25%,22%)] w-12 shrink-0 tabular-nums">{pct.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Predictions;
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

const SHAP_VALUES = [
  { label: 'age_days', pct: 12.52, positive: true },
  { label: 'seaweed_biomass_kg', pct: 8.73, positive: true },
  { label: 'avg_weight_g', pct: 6.59, positive: true },
  { label: 'nh3_mg_l', pct: 2.17, positive: false },
  { label: 'salinity_ppt', pct: 1.18, positive: true },
  { label: 'biomass_kg', pct: 1.07, positive: true },
  { label: 'do_min_mg_l', pct: 0.99, positive: true },
  { label: 'shrimp_seaweed_ratio', pct: 0.75, positive: false },
  { label: 'buffer_index', pct: 0.59, positive: true },
  { label: 'oxygen_stress', pct: 0.54, positive: false },
  { label: 'do_mg_l', pct: 0.32, positive: true },
  { label: 'temperature_c', pct: 0.12, positive: true },
];

const SWEEP_VARS = [
  { id: 'temperature_c', label: 'Temperature (°C)', min: 25, max: 35, step: 0.5 },
  { id: 'ph', label: 'pH Level', min: 6.5, max: 9.0, step: 0.1 },
  { id: 'tds_ppm', label: 'TDS (ppm)', min: 0, max: 2000, step: 50 },
  { id: 'seaweed_biomass_kg', label: 'Seaweed Biomass (kg)', min: 0, max: 300, step: 10 },
  { id: 'age_days', label: 'Shrimp Age (days)', min: 20, max: 100, step: 2 },
];

const BASE: Record<string, number> = { temperature_c: 28.5, ph: 7.8, tds_ppm: 250, seaweed_biomass_kg: 125, age_days: 45 };

function computeGrowth(p: Record<string, number>): number {
  const ageFactor = Math.min(p.age_days / 60, 1.2) * 0.25;
  const seaweedFactor = Math.min(p.seaweed_biomass_kg / 150, 1.0) * 0.12;
  const tdsPenalty = p.tds_ppm > 800 ? (p.tds_ppm - 800) / 5000 : 0;
  const tempFactor = p.temperature_c >= 27 && p.temperature_c <= 30 ? 0.08 : Math.max(0, 0.08 - Math.abs(p.temperature_c - 28.5) * 0.02);
  const phFactor = p.ph >= 7.5 && p.ph <= 8.5 ? 0.05 : 0.02;
  return Math.max(0.05, Math.min(1.8, 0.25 + ageFactor + seaweedFactor + tempFactor + phFactor - tdsPenalty));
}

function sweep(varId: string, cfg: typeof SWEEP_VARS[0]) {
  const pts = [];
  for (let v = cfg.min; v <= cfg.max + cfg.step / 2; v += cfg.step) {
    pts.push({ x: parseFloat(v.toFixed(2)), g: parseFloat(computeGrowth({ ...BASE, [varId]: v }).toFixed(4)) });
  }
  const opt = pts.reduce((a, b) => b.g > a.g ? b : a);
  return { pts, optimal: opt.x, maxGrowth: opt.g.toFixed(3) };
}

const PRESETS = [
  'Why is shrimp age the top SHAP predictor?',
  'How does seaweed reduce ammonia stress in IMTA?',
  'What TDS level is dangerous for L. vannamei?',
  'What is the optimal pH range for shrimp farming?',
];

const panel = 'bg-white border border-[hsl(220,16%,80%)] shadow-[0_1px_3px_hsl(220,20%,80%/0.5)]';
const tabActive = 'border-b-2 border-[hsl(191,70%,32%)] text-[hsl(220,30%,12%)] font-semibold';
const tabInactive = 'border-b-2 border-transparent text-[hsl(220,18%,42%)] hover:text-[hsl(220,30%,12%)]';

const AIInsights = () => {
  const [tab, setTab] = useState<'shap' | 'sweep' | 'ask'>('shap');
  const [sweepVar, setSweepVar] = useState(SWEEP_VARS[0].id);
  const [sweepResult, setSweepResult] = useState<ReturnType<typeof sweep> | null>(null);
  const [sweeping, setSweeping] = useState(false);
  const [query, setQuery] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [askCooldown, setAskCooldown] = useState(false);

  const maxPct = SHAP_VALUES[0].pct;

  const runSweep = () => {
    setSweeping(true); setSweepResult(null);
    setTimeout(() => {
      const cfg = SWEEP_VARS.find(v => v.id === sweepVar)!;
      setSweepResult(sweep(sweepVar, cfg));
      setSweeping(false);
    }, 350);
  };

  const askAI = async (q?: string) => {
    const question = q ?? query;
    if (!question.trim() || askLoading || askCooldown) return;
    setAskLoading(true); setAiReply('');
    setAskCooldown(true);
    setTimeout(() => setAskCooldown(false), 6000);
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    const prompt = `You are an aquaculture scientist for an IMTA shrimp farm with XGBoost + LightGBM models (R²=0.907).
Tank: 15,000 shrimp, day 45, temp 28.5°C, pH 7.8, TDS 250ppm, seaweed 125kg.
Top SHAP: age_days (12.5%), seaweed_biomass (8.7%), avg_weight (6.6%), nh3 (2.2%).
Answer in max 4 sentences. Plain text, no markdown. Be precise.
Question: ${question}`;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      );
      const d = await res.json();
      setAiReply(d?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response.');
    } catch { setAiReply('Network error. Please try again.'); }
    finally { setAskLoading(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights"
        description="SHAP explainability · parameter sweeps · AI assistant"
        actions={
          <div className="flex items-center gap-4 text-[13px] font-mono text-[hsl(220,18%,38%)]">
            <span><span className="text-[hsl(191,70%,30%)] font-semibold">XGB</span> R²=0.9057</span>
            <span className="text-[hsl(220,16%,72%)]">·</span>
            <span><span className="text-[hsl(158,48%,30%)] font-semibold">LGB</span> R²=0.9072</span>
          </div>
        }
      />

      {/* Tab bar */}
      <div className="flex gap-6 border-b border-[hsl(220,16%,82%)]">
        {(['shap', 'sweep', 'ask'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('pb-3 text-[13px] font-mono tracking-wide transition-colors', tab === t ? tabActive : tabInactive)}>
            {t === 'shap' ? 'SHAP Analysis' : t === 'sweep' ? 'Parameter Sweep' : 'AI Assistant'}
          </button>
        ))}
      </div>

      {/* SHAP */}
      {tab === 'shap' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className={cn(panel, 'xl:col-span-7 p-6')}>
            <h3 className="text-base font-bold text-[hsl(220,30%,12%)] mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Feature Importance</h3>
            <p className="text-[12px] font-mono text-[hsl(220,18%,42%)] mb-6">Mean absolute SHAP values · XGBoost · 10,000 IMTA records</p>
            <div className="flex items-center gap-5 text-[12px] font-mono text-[hsl(220,18%,42%)] mb-5">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block bg-[hsl(191,70%,32%)]" />positive</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block bg-[hsl(0,62%,46%)]" />stressor</span>
            </div>
            <div className="space-y-3">
              {SHAP_VALUES.map(({ label, pct, positive }, i) => (
                <motion.div key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3">
                  <span className="text-[13px] font-mono text-[hsl(220,20%,30%)] w-48 text-right shrink-0">{label}</span>
                  <div className="flex-1 h-4 bg-[hsl(220,16%,92%)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${(pct / maxPct) * 100}%` }}
                      transition={{ delay: i * 0.03 + 0.1, duration: 0.45 }}
                      className={positive ? 'h-full bg-[hsl(191,70%,32%)]' : 'h-full bg-[hsl(0,62%,46%)]'}
                    />
                  </div>
                  <span className="text-[13px] font-mono font-semibold text-[hsl(220,25%,22%)] w-12 shrink-0 tabular-nums">{pct.toFixed(2)}%</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-5 space-y-3">
            {[
              { label: 'Top Driver', val: 'age_days', sub: '12.52% — growth scales with age up to ~60 days', accent: 'text-[hsl(191,70%,28%)]' },
              { label: 'IMTA Benefit', val: 'seaweed_biomass_kg', sub: '8.73% — seaweed absorbs NH₃, improves DO', accent: 'text-[hsl(158,48%,26%)]' },
              { label: 'Key Stressor', val: 'nh3_mg_l', sub: 'Negative driver — keep NH₃ below 0.05 mg/L', accent: 'text-[hsl(0,62%,40%)]' },
              { label: 'IMTA vs Monoculture', val: '+15–23% Growth', sub: 'IMTA outperforms monoculture in all conditions', accent: 'text-[hsl(220,30%,12%)]' },
            ].map(c => (
              <div key={c.label} className={cn(panel, 'p-4')}>
                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-1">{c.label}</p>
                <p className={cn('text-[14px] font-mono font-semibold mb-1', c.accent)}>{c.val}</p>
                <p className="text-[13px] font-mono text-[hsl(220,20%,35%)]">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sweep */}
      {tab === 'sweep' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className={cn(panel, 'lg:col-span-4 p-6')}>
            <h3 className="text-base font-bold text-[hsl(220,30%,12%)] mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>Simulation Config</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-2">Variable</p>
                <select
                  className="w-full bg-[hsl(220,16%,96%)] border border-[hsl(220,16%,80%)] px-3 py-2.5 text-[13px] font-mono text-[hsl(220,25%,18%)] focus:outline-none focus:border-[hsl(191,70%,40%)]"
                  value={sweepVar}
                  onChange={e => { setSweepVar(e.target.value); setSweepResult(null); }}
                >
                  {SWEEP_VARS.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
              </div>
              {(() => {
                const cfg = SWEEP_VARS.find(v => v.id === sweepVar)!;
                return (
                  <div className="bg-[hsl(220,16%,96%)] border border-[hsl(220,16%,85%)] p-3 text-[13px] font-mono space-y-2">
                    <div className="flex justify-between"><span className="text-[hsl(220,18%,42%)]">Range</span><span className="text-[hsl(220,25%,18%)] font-semibold">{cfg.min} → {cfg.max}</span></div>
                    <div className="flex justify-between"><span className="text-[hsl(220,18%,42%)]">Step size</span><span className="text-[hsl(220,25%,18%)] font-semibold">{cfg.step}</span></div>
                    <div className="flex justify-between"><span className="text-[hsl(220,18%,42%)]">Data points</span><span className="text-[hsl(220,25%,18%)] font-semibold">{Math.round((cfg.max - cfg.min) / cfg.step) + 1}</span></div>
                  </div>
                );
              })()}
              <button onClick={runSweep} disabled={sweeping}
                className="w-full py-2.5 bg-[hsl(191,70%,32%)] text-white text-[13px] font-mono font-semibold tracking-wide hover:bg-[hsl(191,70%,28%)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {sweeping && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {sweeping ? 'Simulating...' : 'Run Sweep'}
              </button>
              {sweepResult && (
                <div className="bg-[hsl(220,16%,96%)] border border-[hsl(220,16%,85%)] p-3 text-[13px] font-mono space-y-2">
                  <div className="flex justify-between"><span className="text-[hsl(220,18%,42%)]">Optimal value</span><span className="text-[hsl(191,70%,28%)] font-bold">{sweepResult.optimal}</span></div>
                  <div className="flex justify-between"><span className="text-[hsl(220,18%,42%)]">Max growth</span><span className="text-[hsl(158,48%,28%)] font-bold">{sweepResult.maxGrowth} g/wk</span></div>
                </div>
              )}
            </div>
          </div>

          <div className={cn(panel, 'lg:col-span-8 p-6 min-h-[380px] flex flex-col')}>
            <p className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-6">Growth Trajectory</p>
            {sweepResult ? (
              <div className="flex-1 min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sweepResult.pts.map(p => ({ value: p.x, growth: p.g }))} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="hsl(220,16%,88%)" />
                    <XAxis dataKey="value" tick={{ fill: 'hsl(220,18%,42%)', fontSize: 12, fontFamily: 'IBM Plex Mono' }} tickLine={false} axisLine={false} dy={8} />
                    <YAxis tick={{ fill: 'hsl(220,18%,42%)', fontSize: 12, fontFamily: 'IBM Plex Mono' }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'white', border: '1px solid hsl(220,16%,82%)', borderRadius: 2, fontSize: 13, fontFamily: 'IBM Plex Mono' }}
                      itemStyle={{ color: 'hsl(220,30%,12%)' }}
                      labelStyle={{ color: 'hsl(220,18%,42%)' }}
                    />
                    {sweepResult.optimal && (
                      <ReferenceLine x={sweepResult.optimal} stroke="hsl(191,70%,32%)" strokeDasharray="4 4"
                        label={{ value: 'optimal', position: 'top', fill: 'hsl(191,70%,32%)', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                    )}
                    <Area type="monotone" dataKey="growth" stroke="hsl(191,70%,32%)" strokeWidth={2}
                      fill="hsl(191,70%,32%)" fillOpacity={0.08} name="g/wk" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[13px] font-mono text-[hsl(220,18%,55%)]">
                Select a variable and run the sweep
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Ask */}
      {tab === 'ask' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className={cn(panel, 'xl:col-span-8 p-6')}>
            <h3 className="text-base font-bold text-[hsl(220,30%,12%)] mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>AI Assistant</h3>
            <p className="text-[13px] font-mono text-[hsl(220,18%,42%)] mb-5">Ask about sensors, model predictions, or aquaculture science</p>
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askAI(); } }}
              placeholder="e.g. What TDS level is dangerous for shrimp?"
              rows={3}
              className="w-full bg-[hsl(220,16%,96%)] border border-[hsl(220,16%,80%)] px-4 py-3 text-[13px] font-mono text-[hsl(220,25%,18%)] placeholder:text-[hsl(220,18%,60%)] resize-none focus:outline-none focus:border-[hsl(191,70%,40%)]"
            />
            <div className="flex justify-end mt-3">
              <button onClick={() => askAI()} disabled={askLoading || askCooldown || !query.trim()}
                className="px-6 py-2.5 bg-[hsl(191,70%,32%)] text-white text-[13px] font-mono font-semibold tracking-wide hover:bg-[hsl(191,70%,28%)] transition-colors disabled:opacity-40 flex items-center gap-2">
                {askLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {askCooldown && !askLoading ? 'Please wait...' : askLoading ? 'Thinking...' : 'Submit'}
              </button>
            </div>
            <AnimatePresence mode="wait">
              {askLoading ? (
                <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 space-y-2.5">
                  {[90, 75, 60].map((w, i) => <div key={i} className="h-3 skeleton" style={{ width: `${w}%` }} />)}
                </motion.div>
              ) : aiReply ? (
                <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mt-5 bg-[hsl(191,70%,97%)] border border-[hsl(191,70%,78%)] p-4">
                  <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[hsl(191,70%,30%)] mb-2">Gemini Response</p>
                  <p className="text-[13px] font-mono text-[hsl(220,25%,20%)] leading-relaxed">{aiReply}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="xl:col-span-4 space-y-4">
            <div className={cn(panel, 'p-5')}>
              <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-4">Quick Questions</p>
              <div className="space-y-1">
                {PRESETS.map((q, i) => (
                  <button key={i} onClick={() => { setQuery(q); askAI(q); }}
                    className="w-full text-left px-3 py-2.5 text-[13px] font-mono text-[hsl(220,20%,32%)] hover:text-[hsl(220,30%,12%)] hover:bg-[hsl(220,16%,95%)] transition-colors flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[hsl(220,18%,55%)]" />{q}
                  </button>
                ))}
              </div>
            </div>
            <div className={cn(panel, 'p-5')}>
              <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-3">Tank Context</p>
              <div className="space-y-2 text-[13px] font-mono">
                {[['Temperature', '28.5°C'], ['pH', '7.8'], ['TDS', '250 ppm'], ['Model', 'XGB+LGB'], ['R²', '0.9072']].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[hsl(220,18%,42%)]">{k}</span>
                    <span className="text-[hsl(220,25%,18%)] font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
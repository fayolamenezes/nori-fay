import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SensorHistoryChart } from '@/components/charts/SensorHistoryChart';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { generateHistoricalData, mockGrowthPredictions, sensorLabels } from '@/data/mockData';
import { SensorData } from '@/types/aquaculture';
import { cn } from '@/lib/utils';
import { canCallGemini, markGeminiStart, markGeminiEnd } from '@/lib/geminiRateLimit';

const REAL_SENSORS: (keyof SensorData)[] = ['temperature', 'ph', 'turbidity'];
const TIME_RANGES = ['24h', '7d', '30d'] as const;

const CORRELATIONS = [
  { label: 'DO Level → Growth Rate', r: 0.82, pos: true },
  { label: 'pH → Survival Rate', r: 0.74, pos: true },
  { label: 'Seaweed Biomass → Water Quality', r: 0.78, pos: true },
  { label: 'Temperature Stability → Growth', r: 0.61, pos: true },
  { label: 'Ammonia NH₃ → Growth Rate', r: -0.85, pos: false },
  { label: 'TDS (high) → Growth Rate', r: -0.58, pos: false },
];

const panel = 'bg-white border border-[hsl(220,16%,80%)] shadow-[0_1px_3px_hsl(220,20%,80%/0.5)]';
const tabActive = 'border-b-2 border-[hsl(191,70%,32%)] text-[hsl(220,30%,12%)] font-semibold';
const tabInactive = 'border-b-2 border-transparent text-[hsl(220,18%,42%)] hover:text-[hsl(220,30%,12%)]';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<typeof TIME_RANGES[number]>('24h');
  const [selectedSensors, setSelectedSensors] = useState<(keyof SensorData)[]>(REAL_SENSORS);
  const [tab, setTab] = useState<'sensors' | 'growth' | 'corr' | 'report'>('sensors');
  const [report, setReport] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportCooldown, setReportCooldown] = useState(false);
  const reportCache = useRef<Record<string, string>>({});

  const historicalData = generateHistoricalData(timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30);

  const toggleSensor = (s: keyof SensorData) =>
    setSelectedSensors(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const genReport = useCallback(async () => {
    if (loadingReport || reportCooldown) return;

    // Return cached report for same time range
    if (reportCache.current[timeRange]) {
      setReport(reportCache.current[timeRange]);
      return;
    }

    if (!canCallGemini()) {
      setReport('Rate limit reached — please wait a moment and try again.');
      return;
    }

    setLoadingReport(true); setReport('');
    setReportCooldown(true);
    markGeminiStart();
    setTimeout(() => setReportCooldown(false), 8000);
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    const prompt = `You are an aquaculture data analyst for an IMTA shrimp farm.
Write a ${timeRange} performance report in exactly 4 sentences. Plain text, no markdown. Start with the most important finding. Be specific with numbers.
Data: Temp 28.5°C avg, pH 7.9 avg, TDS 245ppm avg. XGBoost predicts 0.78 g/wk growth (baseline ~0.55).
Shrimp: 15,000 count, day 45, 96.8% survival, FCR 1.42. Seaweed: 125kg, active ammonia uptake.
Highlight performance vs baseline, any sensor risks, and 2 specific optimizations.`;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      );
      if (res.status === 429) {
        setReport('Rate limit reached — please wait a moment and try again.');
        return;
      }
      const d = await res.json();
      const text = d?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Failed to generate.';
      reportCache.current[timeRange] = text;
      setReport(text);
    } catch { setReport('Network error. Try again.'); }
    finally { setLoadingReport(false); markGeminiEnd(); }
  }, [timeRange, loadingReport, reportCooldown]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Sensor history · growth analysis · correlations · AI reports"
        actions={
          <div className="flex border border-[hsl(220,16%,80%)] overflow-hidden">
            {TIME_RANGES.map(r => (
              <button key={r} onClick={() => setTimeRange(r)}
                className={cn('px-4 py-2 text-[13px] font-mono font-medium transition-colors',
                  timeRange === r ? 'bg-[hsl(191,70%,32%)] text-white' : 'bg-white text-[hsl(220,18%,38%)] hover:text-[hsl(220,30%,12%)] border-l border-[hsl(220,16%,80%)]'
                )}>{r}</button>
            ))}
          </div>
        }
      />

      <div className={cn(panel, 'grid grid-cols-2 md:grid-cols-4 divide-x divide-[hsl(220,16%,85%)]')}>
        {[
          { label: 'Avg Temperature', val: '28.4°C', delta: '+0.3°C vs prior period' },
          { label: 'Avg pH', val: '7.9', delta: 'Within optimal range' },
          { label: 'Avg TDS', val: '245 ppm', delta: 'Low — good water quality' },
          { label: 'Model Growth', val: '0.78 g/wk', delta: '+42% above baseline' },
        ].map(k => (
          <div key={k.label} className="px-5 py-4">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-1.5">{k.label}</p>
            <p className="text-xl font-mono font-semibold text-[hsl(220,30%,10%)] mb-0.5">{k.val}</p>
            <p className="text-[12px] font-mono text-[hsl(158,48%,28%)]">{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-6 border-b border-[hsl(220,16%,82%)]">
        {(['sensors', 'growth', 'corr', 'report'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('pb-3 text-[13px] font-mono tracking-wide transition-colors', tab === t ? tabActive : tabInactive)}>
            {t === 'sensors' ? 'Sensors' : t === 'growth' ? 'Growth' : t === 'corr' ? 'Correlations' : 'AI Report'}
          </button>
        ))}
      </div>

      {tab === 'sensors' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {REAL_SENSORS.map(s => (
              <button key={s} onClick={() => toggleSensor(s)}
                className={cn('px-4 py-2 text-[13px] font-mono font-medium border transition-colors',
                  selectedSensors.includes(s)
                    ? 'border-[hsl(191,70%,40%)] text-[hsl(191,70%,28%)] bg-[hsl(191,70%,96%)]'
                    : 'border-[hsl(220,16%,80%)] text-[hsl(220,18%,42%)] bg-white hover:text-[hsl(220,30%,12%)]'
                )}>
                {sensorLabels[s]}<span className="ml-2 text-[11px] opacity-60 font-normal">LIVE</span>
              </button>
            ))}
          </div>
          <div className={cn(panel, 'p-6')}>
            <p className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-5">Trends — Last {timeRange}</p>
            <SensorHistoryChart data={historicalData} sensors={selectedSensors} />
          </div>
        </div>
      )}

      {tab === 'growth' && (
        <div className="space-y-4">
          <div className={cn(panel, 'p-6')}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)]">Shrimp Growth Trajectory</p>
              <div className="flex items-center gap-5 text-[12px] font-mono text-[hsl(220,18%,42%)]">
                <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block bg-[hsl(191,70%,32%)]" />Predicted</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block bg-[hsl(158,48%,32%)]" />Actual</span>
              </div>
            </div>
            <GrowthChart data={mockGrowthPredictions} />
          </div>
          <div className={cn(panel, 'grid grid-cols-1 md:grid-cols-3 divide-x divide-[hsl(220,16%,85%)]')}>
            {[
              { label: 'Harvest Projection', val: 'Day 85', sub: 'At current growth rate' },
              { label: 'Expected Final Weight', val: '28.5 g', sub: '±2.3g confidence interval' },
              { label: 'Predicted Yield', val: '412 kg', sub: '96.8% survival rate applied' },
            ].map(c => (
              <div key={c.label} className="px-5 py-5">
                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-2">{c.label}</p>
                <p className="text-2xl font-mono font-semibold text-[hsl(220,30%,10%)] mb-1">{c.val}</p>
                <p className="text-[13px] font-mono text-[hsl(220,18%,42%)]">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'corr' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {['pos', 'neg'].map(dir => (
              <div key={dir} className={cn(panel, 'p-6')}>
                <p className={cn('text-[12px] font-mono font-semibold uppercase tracking-wider mb-5',
                  dir === 'pos' ? 'text-[hsl(158,48%,28%)]' : 'text-[hsl(0,62%,40%)]')}>
                  {dir === 'pos' ? 'Positive Correlations' : 'Negative Correlations'}
                </p>
                <div className="space-y-4">
                  {CORRELATIONS.filter(c => c.pos === (dir === 'pos')).map(({ label, r, pos }) => (
                    <div key={label} className="space-y-2">
                      <div className="flex justify-between text-[13px] font-mono">
                        <span className="text-[hsl(220,25%,20%)]">{label}</span>
                        <span className={cn('font-semibold tabular-nums', pos ? 'text-[hsl(158,48%,28%)]' : 'text-[hsl(0,62%,40%)]')}>
                          r = {r > 0 ? '+' : ''}{r.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2 bg-[hsl(220,16%,92%)] overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.abs(r) * 100}%` }} transition={{ duration: 0.5 }}
                          className={pos ? 'h-full bg-[hsl(158,48%,32%)]' : 'h-full bg-[hsl(0,62%,46%)]'} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={cn(panel, 'grid grid-cols-1 md:grid-cols-3 divide-x divide-[hsl(220,16%,85%)]')}>
            {[
              { label: 'Seaweed → Shrimp', body: 'Seaweed absorbs NH₃ and NO₃, reducing toxic load. Acts as biological filter improving DO and water clarity.' },
              { label: 'pH → Toxicity', body: 'At pH 7.5–8.5, ammonia stays as NH₄⁺ (non-toxic form). Outside range, toxic NH₃ fraction rises sharply.' },
              { label: 'TDS → Stress', body: 'TDS above 800 ppm signals dissolved solids buildup — indicates poor water exchange or overfeeding.' },
            ].map(c => (
              <div key={c.label} className="p-5">
                <p className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-2">{c.label}</p>
                <p className="text-[13px] font-mono text-[hsl(220,22%,28%)] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'report' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className={cn(panel, 'xl:col-span-8 p-6')}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[hsl(220,30%,12%)]" style={{ fontFamily: 'Syne, sans-serif' }}>Performance Report</h3>
                <p className="text-[13px] font-mono text-[hsl(220,18%,42%)] mt-0.5">Gemini-generated · {timeRange} window</p>
              </div>
              <button onClick={genReport} disabled={loadingReport || reportCooldown}
                className="flex items-center gap-2 px-4 py-2 border border-[hsl(220,16%,78%)] text-[13px] font-mono font-medium text-[hsl(220,18%,38%)] hover:text-[hsl(220,30%,12%)] hover:border-[hsl(191,70%,40%)] transition-colors disabled:opacity-40 bg-white">
                {loadingReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                {loadingReport ? 'Generating...' : reportCooldown ? 'Please wait...' : report ? 'Regenerate' : 'Generate Report'}
              </button>
            </div>
            <AnimatePresence mode="wait">
              {loadingReport ? (
                <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {[100, 90, 80, 65, 50].map((w, i) => <div key={i} className="h-3 skeleton" style={{ width: `${w}%` }} />)}
                </motion.div>
              ) : report ? (
                <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-[hsl(191,70%,97%)] border border-[hsl(191,70%,78%)] p-5">
                  <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[hsl(191,70%,28%)] mb-3">Generated Report</p>
                  <p className="text-[14px] font-mono text-[hsl(220,25%,18%)] leading-relaxed">{report}</p>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center py-16 text-[13px] font-mono text-[hsl(220,18%,55%)]">
                  Click "Generate Report" to run AI analysis
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="xl:col-span-4 space-y-4">
            <div className={cn(panel, 'p-5')}>
              <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-4">Report Inputs</p>
              <div className="space-y-2.5 text-[13px] font-mono">
                {[['Window', timeRange], ['Temperature', '28.5°C'], ['pH', '7.9'], ['TDS', '245 ppm'], ['Model growth', '0.78 g/wk'], ['Survival rate', '96.8%']].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[hsl(220,18%,42%)]">{k}</span>
                    <span className="text-[hsl(220,25%,18%)] font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={cn(panel, 'p-5')}>
              <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[hsl(220,18%,45%)] mb-3">Report Covers</p>
              <div className="space-y-2 text-[13px] font-mono text-[hsl(220,22%,32%)]">
                {['Performance vs baseline', 'Sensor risk assessment', 'Growth trajectory', 'Top 2 optimizations', 'IMTA system health'].map(i => (
                  <p key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(191,70%,32%)] inline-block shrink-0" />{i}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
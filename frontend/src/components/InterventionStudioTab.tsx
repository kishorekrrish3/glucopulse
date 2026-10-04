import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Footprints,
  Shield,
  Layers,
  Sparkles,
  ArrowDownRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { MealInput, SimulationsMap } from '../types';

interface InterventionStudioProps {
  meal: MealInput;
  simulations: SimulationsMap | null;
  isLoading: boolean;
  onApplyIntervention: (type: 'walk' | 'fiber' | 'sequencing' | 'combined') => void;
}

export const InterventionStudioTab: React.FC<InterventionStudioProps> = ({
  meal,
  simulations,
  isLoading,
  onApplyIntervention,
}) => {
  if (!simulations && !isLoading) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
        <Sparkles className="h-8 w-8 mx-auto text-amber-400 mb-2" />
        <p>No active simulation data. Return to the Meal Predictor to generate predictions.</p>
      </div>
    );
  }

  // Combine curve data points by minute for overlaid LineChart
  const combinedCurveData = simulations?.baseline.curve.map((pt, i) => {
    return {
      minute: pt.minute,
      baseline: pt.glucose,
      walk_15m: simulations.walk_15m.curve[i]?.glucose ?? pt.glucose,
      fiber_boost: simulations.fiber_boost.curve[i]?.glucose ?? pt.glucose,
      veggies_first: simulations.veggies_first.curve[i]?.glucose ?? pt.glucose,
      combined: simulations.combined_protocol.curve[i]?.glucose ?? pt.glucose,
    };
  }) ?? [];

  const basePeak = simulations?.baseline.peak ?? 140;
  const comboPeak = simulations?.combined_protocol.peak ?? 115;
  const maxSavings = Math.round((basePeak - comboPeak) * 10) / 10;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Value Prop */}
      <div className="glass-panel rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Layers className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-white">
                Metabolic Intervention Studio
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Alex doesn't have to give up their favorite foods! TabPFN simulates counterfactual lifestyle modifications showing how simple tweaks flatten the postprandial glucose spike.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">Max Potential Drop</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  -{maxSavings}
                </span>
                <span className="text-xs text-slate-400">mg/dL</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <span className="text-[11px] text-slate-400 block">Target Status</span>
              <span className="text-xs font-bold text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                Sub-140 Safe Zone
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlaid Multi-Curve Visualization */}
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-400" />
              Counterfactual Glycemic Trajectories Overlaid (180 Minutes)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Notice how post-meal walking and fiber sequencing completely blunt the dangerous hyper-spike into safe range.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Target Threshold &le; 140 mg/dL
          </div>
        </div>

        <div className="h-80 w-full bg-slate-950/70 rounded-xl p-3 border border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedCurveData}
              margin={{ top: 10, right: 20, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="minute" stroke="#64748b" tick={{ fontSize: 11 }} unit="m" />
              <YAxis domain={[75, 195]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: string) => {
                  const labels: Record<string, string> = {
                    baseline: 'Original Meal',
                    walk_15m: '+15 Min Walk',
                    fiber_boost: '+8g Soluble Fiber',
                    veggies_first: 'Food Sequencing',
                    combined: 'Combined Protocol',
                  };
                  return [`${val} mg/dL`, labels[name] ?? name];
                }}
                labelFormatter={(m) => `Minute ${m} post-meal`}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    baseline: 'Original Meal',
                    walk_15m: '+15m Walk',
                    fiber_boost: '+8g Fiber',
                    veggies_first: 'Food Sequencing',
                    combined: 'Combined Protocol',
                  };
                  return <span className="text-xs text-slate-300 mr-2">{labels[value] ?? value}</span>;
                }}
              />
              
              {/* Clinical Target Reference Line */}
              <ReferenceLine
                y={140}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'Pre-diabetic Limit (140 mg/dL)',
                  position: 'insideTopRight',
                  fill: '#f59e0b',
                  fontSize: 10,
                }}
              />

              {/* Baseline Curve (Red / Warning) */}
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
              />

              {/* Walk 15m Curve (Sky Blue) */}
              <Line
                type="monotone"
                dataKey="walk_15m"
                stroke="#0ea5e9"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
              />

              {/* Fiber Boost Curve (Amber) */}
              <Line
                type="monotone"
                dataKey="fiber_boost"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
              />

              {/* Veggies First Curve (Purple) */}
              <Line
                type="monotone"
                dataKey="veggies_first"
                stroke="#a855f7"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
              />

              {/* Combined Protocol Curve (Emerald Green / Best) */}
              <Line
                type="monotone"
                dataKey="combined"
                stroke="#10b981"
                strokeWidth={3.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Intervention Strategy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Post-Meal Walk */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between border-slate-800 hover:border-sky-500/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Footprints className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-sky-400 font-mono flex items-center">
                <ArrowDownRight className="h-3.5 w-3.5" />
                {simulations?.walk_15m.delta_peak} mg/dL
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">+15 Min Post-Meal Walk</h4>
            <p className="text-xs text-slate-400 mt-1">
              Muscle contractions trigger GLUT4 translocation independently of insulin, soaking up glucose directly from the bloodstream.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Peak: <strong className="text-white">{simulations?.walk_15m.peak} mg/dL</strong>
            </span>
            <button
              onClick={() => onApplyIntervention('walk')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {/* 2. Fiber Boost */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between border-slate-800 hover:border-amber-500/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Shield className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-amber-400 font-mono flex items-center">
                <ArrowDownRight className="h-3.5 w-3.5" />
                {simulations?.fiber_boost.delta_peak} mg/dL
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">+8g Fiber (Chia/Psyllium)</h4>
            <p className="text-xs text-slate-400 mt-1">
              Soluble viscous fiber forms a gel-like mesh inside the duodenum, drastically slowing carbohydrate enzymatic breakdown.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Peak: <strong className="text-white">{simulations?.fiber_boost.peak} mg/dL</strong>
            </span>
            <button
              onClick={() => onApplyIntervention('fiber')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {/* 3. Food Sequencing */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between border-slate-800 hover:border-purple-500/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Layers className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-purple-400 font-mono flex items-center">
                <ArrowDownRight className="h-3.5 w-3.5" />
                {simulations?.veggies_first.delta_peak} mg/dL
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Food Sequencing (Order)</h4>
            <p className="text-xs text-slate-400 mt-1">
              Eating fiber and protein 10 minutes before starches stimulates GLP-1 hormone release, preparing the pancreas in advance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Peak: <strong className="text-white">{simulations?.veggies_first.peak} mg/dL</strong>
            </span>
            <button
              onClick={() => onApplyIntervention('sequencing')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {/* 4. Combined Protocol */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between border-emerald-500/30 bg-emerald-950/20 glass-glow-emerald">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono flex items-center">
                <ArrowDownRight className="h-3.5 w-3.5" />
                {simulations?.combined_protocol.delta_peak} mg/dL
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Combined Optimal Protocol</h4>
            <p className="text-xs text-slate-300 mt-1">
              Synergistic trifecta: +15m walk + fiber starter + protein preload completely normalizes postprandial glucose.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between">
            <span className="text-[11px] text-emerald-300 font-semibold">
              Peak: <strong className="text-white">{simulations?.combined_protocol.peak} mg/dL</strong>
            </span>
            <button
              onClick={() => onApplyIntervention('combined')}
              className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-colors"
            >
              Apply All
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Flame,
  Moon,
  Footprints,
  Sparkles,
} from 'lucide-react';
import { MealInput, TabPFNPrediction } from '../types';

interface MealPredictorTabProps {
  meal: MealInput;
  onChangeMeal: (updated: MealInput) => void;
  prediction: TabPFNPrediction | null;
  isLoading: boolean;
  onSelectPreset: (preset: MealInput) => void;
  onNavigateToInterventions: () => void;
  onNavigateToGemma: () => void;
}

export const PRESET_MEALS: { name: string; tag: string; meal: MealInput }[] = [
  {
    name: 'Spicy Thai Noodles',
    tag: "Alex's Trigger",
    meal: {
      meal_name: 'Spicy Thai Drunken Noodles (Pad Kee Mao)',
      carbs_g: 88,
      fiber_g: 3,
      protein_g: 22,
      fat_g: 24,
      glycemic_index: 75,
      pre_meal_glucose: 98,
      sleep_hours: 5.5,
      stress_level: 3,
      post_meal_walk_min: 0,
      meal_time_hour: 13,
    },
  },
  {
    name: 'Morning Bagel & Cream Cheese',
    tag: 'Quick Breakfast',
    meal: {
      meal_name: 'Plain Bagel with Cream Cheese',
      carbs_g: 68,
      fiber_g: 2,
      protein_g: 11,
      fat_g: 14,
      glycemic_index: 72,
      pre_meal_glucose: 104,
      sleep_hours: 6.0,
      stress_level: 2,
      post_meal_walk_min: 0,
      meal_time_hour: 8,
    },
  },
  {
    name: 'Salmon & Quinoa Bowl',
    tag: 'Optimal Balance',
    meal: {
      meal_name: 'Grilled Salmon with Quinoa & Asparagus',
      carbs_g: 34,
      fiber_g: 7,
      protein_g: 38,
      fat_g: 16,
      glycemic_index: 40,
      pre_meal_glucose: 92,
      sleep_hours: 7.5,
      stress_level: 1,
      post_meal_walk_min: 15,
      meal_time_hour: 19,
    },
  },
  {
    name: 'Two Slices Pepperoni Pizza',
    tag: 'Late Night Starch + Fat',
    meal: {
      meal_name: 'Two Slices Pepperoni Pizza',
      carbs_g: 74,
      fiber_g: 3,
      protein_g: 26,
      fat_g: 32,
      glycemic_index: 70,
      pre_meal_glucose: 100,
      sleep_hours: 5.0,
      stress_level: 4,
      post_meal_walk_min: 0,
      meal_time_hour: 21,
    },
  },
  {
    name: 'Ribeye Steak & Broccoli',
    tag: 'Zero Spike',
    meal: {
      meal_name: 'Ribeye Steak with Roasted Garlic Broccoli',
      carbs_g: 8,
      fiber_g: 5,
      protein_g: 48,
      fat_g: 34,
      glycemic_index: 20,
      pre_meal_glucose: 90,
      sleep_hours: 8.0,
      stress_level: 1,
      post_meal_walk_min: 10,
      meal_time_hour: 19,
    },
  },
];

export const MealPredictorTab: React.FC<MealPredictorTabProps> = ({
  meal,
  onChangeMeal,
  prediction,
  isLoading,
  onSelectPreset,
  onNavigateToInterventions,
  onNavigateToGemma,
}) => {
  const updateField = (field: keyof MealInput, val: any) => {
    onChangeMeal({ ...meal, [field]: val });
  };

  const peak = prediction?.predicted_peak_glucose ?? 140;
  const isHigh = peak > 140;
  const isElevated = peak >= 120 && peak <= 140;

  return (
    <div className="space-y-6">
      
      {/* Preset Buttons Bar */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Alex's Real-World Meal Presets
          </span>
          <span className="text-xs text-slate-500">Tap to load meal data instantly</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PRESET_MEALS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPreset(p.meal)}
              className={`p-2.5 rounded-xl border text-left transition-all group ${
                meal.meal_name === p.meal.meal_name
                  ? 'bg-rose-500/15 border-rose-500/40 shadow-sm shadow-rose-500/10'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-slate-200">
                  {p.tag}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 truncate">{p.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {p.meal.carbs_g}g C &bull; {p.meal.protein_g}g P &bull; {p.meal.fat_g}g F
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Meal Builder (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-500" />
                Meal & Biometric Parameters
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                TabPFN Features: 12-D
              </span>
            </div>

            {/* Meal Name Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Meal Name / Description
              </label>
              <input
                type="text"
                value={meal.meal_name}
                onChange={(e) => updateField('meal_name', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                placeholder="e.g. Pad Thai or Breakfast Bagel"
              />
            </div>

            {/* Macronutrients Grid */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              {/* Carbs */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-400">Total Carbs</span>
                  <span className="text-xs font-bold text-rose-400 font-mono">{meal.carbs_g}g</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="1"
                  value={meal.carbs_g}
                  onChange={(e) => updateField('carbs_g', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Fiber */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-400">Fiber (Buffer)</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{meal.fiber_g}g</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={meal.fiber_g}
                  onChange={(e) => updateField('fiber_g', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Protein */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-400">Protein</span>
                  <span className="text-xs font-bold text-sky-400 font-mono">{meal.protein_g}g</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={meal.protein_g}
                  onChange={(e) => updateField('protein_g', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Fat */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-400">Healthy Fats</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">{meal.fat_g}g</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={meal.fat_g}
                  onChange={(e) => updateField('fat_g', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Glycemic Index Slider */}
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-400">Estimated Glycemic Index (GI)</span>
                <span className="text-xs font-bold text-orange-400 font-mono">
                  {meal.glycemic_index} / 100
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="95"
                step="1"
                value={meal.glycemic_index}
                onChange={(e) => updateField('glycemic_index', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Low GI (&le; 55)</span>
                <span>Medium (56-69)</span>
                <span>High GI (&ge; 70)</span>
              </div>
            </div>

            {/* Physiological Modifiers (Sleep & Movement) */}
            <div className="border-t border-slate-800 pt-3 space-y-3">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Moon className="h-3.5 w-3.5 text-indigo-400" />
                Physiological & Lifestyle Modifiers
              </span>

              {/* Pre-meal Glucose */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-300">Baseline Glucose</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="75"
                    max="135"
                    value={meal.pre_meal_glucose}
                    onChange={(e) => updateField('pre_meal_glucose', parseFloat(e.target.value))}
                    className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-lg"
                  />
                  <span className="text-xs font-mono font-semibold text-slate-200 w-16 text-right">
                    {meal.pre_meal_glucose} mg/dL
                  </span>
                </div>
              </div>

              {/* Prior Sleep */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-300">Sleep Last Night</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="0.5"
                    value={meal.sleep_hours}
                    onChange={(e) => updateField('sleep_hours', parseFloat(e.target.value))}
                    className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-lg"
                  />
                  <span className="text-xs font-mono font-semibold text-slate-200 w-16 text-right">
                    {meal.sleep_hours} hrs
                  </span>
                </div>
              </div>

              {/* Post-Meal Walk */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <Footprints className="h-3.5 w-3.5 text-emerald-400" />
                  Planned Walk
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="5"
                    value={meal.post_meal_walk_min}
                    onChange={(e) => updateField('post_meal_walk_min', parseInt(e.target.value))}
                    className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-lg"
                  />
                  <span className="text-xs font-mono font-semibold text-emerald-400 w-16 text-right">
                    {meal.post_meal_walk_min} min
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: TabPFN Real-Time Prediction & 3-Hour Curve (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main TabPFN Metric Display Card */}
          <div
            className={`glass-panel rounded-2xl p-5 border transition-all ${
              isHigh
                ? 'border-rose-500/30 glass-glow-rose'
                : isElevated
                ? 'border-amber-500/30 glass-glow-amber'
                : 'border-emerald-500/30 glass-glow-emerald'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-sky-400" />
                  TabPFN Foundation Model Forecast
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {meal.meal_name}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm"
                  style={{
                    backgroundColor: `${prediction?.risk_color ?? '#EF4444'}20`,
                    color: prediction?.risk_color ?? '#EF4444',
                    border: `1px solid ${prediction?.risk_color ?? '#EF4444'}40`,
                  }}
                >
                  {isHigh ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle className="h-3.5 w-3.5" />
                  )}
                  {prediction?.risk_label ?? 'Analyzing...'}
                </span>
              </div>
            </div>

            {/* Metric Callouts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
              {/* Predicted Peak */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-0.5">Predicted Peak</span>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl font-extrabold font-mono"
                    style={{ color: prediction?.risk_color ?? '#f43f5e' }}
                  >
                    {prediction ? prediction.predicted_peak_glucose : '--'}
                  </span>
                  <span className="text-xs text-slate-400">mg/dL</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {prediction?.confidence_interval
                    ? `CI: ${prediction.confidence_interval.lower}-${prediction.confidence_interval.upper}`
                    : ''}
                </span>
              </div>

              {/* Rise Delta */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-0.5">Glucose Excursion</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold font-mono text-slate-100">
                    +{prediction ? prediction.glucose_rise_delta : '--'}
                  </span>
                  <span className="text-xs text-slate-400">mg/dL</span>
                </div>
                <span className="text-[10px] text-slate-500">Above baseline</span>
              </div>

              {/* Time to Peak */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-0.5">Time to Peak</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold font-mono text-slate-100">
                    {prediction ? prediction.time_to_peak_min : '--'}
                  </span>
                  <span className="text-xs text-slate-400">min</span>
                </div>
                <span className="text-[10px] text-slate-500">Post ingestion</span>
              </div>

              {/* Clearance Time */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-0.5">Clearance Duration</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold font-mono text-slate-100">
                    {prediction ? prediction.clearance_time_min : '--'}
                  </span>
                  <span className="text-xs text-slate-400">min</span>
                </div>
                <span className="text-[10px] text-slate-500">Return to baseline</span>
              </div>
            </div>

            {/* 3-Hour Continuous Glucose Curve */}
            <div className="mt-2 pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-sky-400" />
                  180-Minute Postprandial Curve with 90% Confidence Envelope
                </span>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    Target Max (140)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                    Hyper-Spike (180)
                  </span>
                </div>
              </div>

              <div className="h-64 w-full bg-slate-950/70 rounded-xl p-2 border border-slate-800">
                {prediction && prediction.curve_points.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={prediction.curve_points}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={prediction.risk_color} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={prediction.risk_color} stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="minute"
                        stroke="#64748b"
                        tick={{ fontSize: 11 }}
                        unit="m"
                      />
                      <YAxis
                        domain={[70, 200]}
                        stroke="#64748b"
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                        }}
                        formatter={(val: any, name: string) => [
                          `${val} mg/dL`,
                          name === 'glucose' ? 'Predicted Glucose' : name,
                        ]}
                        labelFormatter={(m) => `Minute ${m} post-meal`}
                      />
                      
                      {/* Clinical Reference Thresholds */}
                      <ReferenceLine
                        y={140}
                        stroke="#f59e0b"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                      />
                      <ReferenceLine
                        y={180}
                        stroke="#ef4444"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                      />

                      {/* Shaded Confidence Interval Envelope */}
                      <Area
                        type="monotone"
                        dataKey="ci_upper"
                        stroke="transparent"
                        fill="url(#ciGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="ci_lower"
                        stroke="transparent"
                        fill="#090d16"
                      />

                      {/* Main Predicted Trajectory */}
                      <Area
                        type="monotone"
                        dataKey="glucose"
                        stroke={prediction.risk_color}
                        strokeWidth={3}
                        fill="url(#glucoseGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                    {isLoading ? 'Computing TabPFN posterior...' : 'Adjust sliders to simulate curve'}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Model: <strong className="text-slate-200">{prediction?.model_engine}</strong>
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={onNavigateToInterventions}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Simulate Interventions &rarr;
                </button>
                <button
                  onClick={onNavigateToGemma}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/25 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Ask Gemma Coach
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

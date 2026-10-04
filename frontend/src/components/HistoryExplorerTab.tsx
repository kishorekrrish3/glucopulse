import React, { useState } from 'react';
import {
  Calendar,
  Activity,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpRight,
  TrendingDown,
  BarChart3,
} from 'lucide-react';
import { HistoricalRecord, SummaryStats, MealInput } from '../types';

interface HistoryExplorerTabProps {
  records: HistoricalRecord[];
  summary: SummaryStats | null;
  onSelectMealForSimulation: (meal: MealInput) => void;
}

export const HistoryExplorerTab: React.FC<HistoryExplorerTabProps> = ({
  records,
  summary,
  onSelectMealForSimulation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Normal' | 'Elevated' | 'Severe Spike'>('All');

  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.meal_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || r.spike_category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Clinical KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Time In Range */}
        <div className="glass-panel rounded-2xl p-4 border border-emerald-500/25 bg-emerald-950/15">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Time In Range (TIR)</span>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {summary?.time_in_range_pct ?? 82.5}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Target: &gt;70% (70-140 mg/dL)
          </span>
        </div>

        {/* Estimated HbA1c */}
        <div className="glass-panel rounded-2xl p-4 border border-sky-500/25 bg-sky-950/15">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Estimated HbA1c</span>
            <TrendingDown className="h-4 w-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-sky-400 font-mono">
              {summary?.estimated_a1c ?? 5.4}%
            </span>
          </div>
          <span className="text-[11px] text-emerald-300 mt-0.5 block font-medium">
            Down from 5.9% (Pre-diabetes)
          </span>
        </div>

        {/* Mean Daily Glucose */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Mean Glucose</span>
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-white font-mono">
              {summary?.mean_glucose_mg_dl ?? 108.4}
            </span>
            <span className="text-xs text-slate-400">mg/dL</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Over {summary?.total_meals_logged ?? 180} meals
          </span>
        </div>

        {/* Glycemic Variability */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Variability (%CV)</span>
            <BarChart3 className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-400 font-mono">
              {summary?.glycemic_variability_cv ?? 24.1}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Target: &lt;36% (Stable)
          </span>
        </div>

      </div>

      {/* Historical Meals Explorer Table */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-rose-500" />
              Alex's 60-Day CGM & Meal Log (TabPFN Training Base)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              TabPFN learns directly from Alex's continuous metabolic responses to create zero-shot predictions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search meal..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e: any) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
            >
              <option value="All">All Categories</option>
              <option value="Normal">Normal (&lt;120)</option>
              <option value="Elevated">Elevated (120-140)</option>
              <option value="Severe Spike">Severe Spike (&gt;140)</option>
            </select>
          </div>
        </div>

        {/* Meal Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Meal & Date</th>
                <th className="py-2.5 px-3 font-semibold">Type</th>
                <th className="py-2.5 px-3 font-semibold">Macros (C / P / F)</th>
                <th className="py-2.5 px-3 font-semibold">Sleep / Stress</th>
                <th className="py-2.5 px-3 font-semibold">Post Walk</th>
                <th className="py-2.5 px-3 font-semibold">Realized Peak</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((r, idx) => {
                const isSpike = r.spike_category === 'Severe Spike';
                const isElevated = r.spike_category === 'Elevated';
                return (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-200">{r.meal_name}</p>
                      <p className="text-[10px] text-slate-500">{r.timestamp}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{r.meal_type}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {r.carbs_g}g / {r.protein_g}g / {r.fat_g}g
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {r.sleep_hours}h &bull; S{r.stress_level}
                    </td>
                    <td className="py-3 px-3">
                      {r.post_meal_walk_min > 0 ? (
                        <span className="font-semibold text-emerald-400">
                          {r.post_meal_walk_min} min
                        </span>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span
                        className={
                          isSpike
                            ? 'text-rose-400'
                            : isElevated
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {r.peak_glucose} mg/dL
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isSpike
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : isElevated
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {r.spike_category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() =>
                          onSelectMealForSimulation({
                            meal_name: r.meal_name,
                            carbs_g: r.carbs_g,
                            fiber_g: r.fiber_g,
                            protein_g: r.protein_g,
                            fat_g: r.fat_g,
                            glycemic_index: r.glycemic_index,
                            pre_meal_glucose: r.pre_meal_glucose,
                            sleep_hours: r.sleep_hours,
                            stress_level: r.stress_level,
                            post_meal_walk_min: r.post_meal_walk_min,
                            meal_time_hour: r.meal_time_hour,
                          })
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300"
                      >
                        <span>Simulate</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

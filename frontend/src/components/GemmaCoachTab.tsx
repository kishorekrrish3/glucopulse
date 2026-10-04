import React from 'react';
import {
  Sparkles,
  Volume2,
  Utensils,
  Lightbulb,
  Heart,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { GemmaExplanation, MealInput, TabPFNPrediction } from '../types';

interface GemmaCoachTabProps {
  meal: MealInput;
  prediction: TabPFNPrediction | null;
  explanation: GemmaExplanation | null;
  isLoading: boolean;
  onRefreshGemma: () => void;
  onPlayVoice: () => void;
  isSpeaking: boolean;
}

export const GemmaCoachTab: React.FC<GemmaCoachTabProps> = ({
  meal,
  prediction,
  explanation,
  isLoading,
  onRefreshGemma,
  onPlayVoice,
  isSpeaking,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Gemma Hero Header Banner */}
      <div className="glass-panel rounded-2xl p-6 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25 flex-shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Gemma 2 Clinical Metabolic Coach
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Open-Weight LLM
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Gemma takes TabPFN's numerical predictions and translates them into empathetic, biochemically sound advice tailored to Alex's pre-diabetes goals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onPlayVoice}
              disabled={!explanation}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isSpeaking
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/25'
              }`}
            >
              <Volume2 className="h-4 w-4" />
              <span>{isSpeaking ? 'Narrating Briefing...' : 'Listen (ElevenLabs)'}</span>
            </button>
            <button
              onClick={onRefreshGemma}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              {isLoading ? 'Synthesizing...' : 'Regenerate'}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-panel rounded-2xl p-16 text-center space-y-3">
          <div className="h-10 w-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-300">
            Gemma is reasoning over TabPFN's posterior distribution...
          </p>
          <p className="text-xs text-slate-500">
            Analyzing glycemic index, hormonal interactions, and personalized food swaps.
          </p>
        </div>
      ) : explanation ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Coaching Analysis Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Headline Card */}
            <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-purple-500 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4" />
                Metabolic Verdict
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {explanation.headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {explanation.mechanism_explanation}
              </p>
            </div>

            {/* Smart Culinary Swaps */}
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-amber-400" />
                  Chef-Approved Smart Swaps for Alex
                </h4>
                <span className="text-[11px] text-slate-400 font-medium">Keep the flavor, ditch the spike</span>
              </div>

              <div className="space-y-3">
                {explanation.swaps.map((swap, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="text-rose-400 line-through truncate max-w-[140px] sm:max-w-none">
                        {swap.original}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                      <span className="text-emerald-400 font-bold truncate max-w-[180px] sm:max-w-none">
                        {swap.alternative}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 flex-shrink-0" />
                      {swap.benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Micro-Action & Encouragement (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 5-Minute Micro-Action */}
            <div className="glass-panel rounded-2xl p-5 bg-gradient-to-br from-emerald-950/20 to-slate-900 border border-emerald-500/30 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-emerald-400" />
                Actionable 5-Minute Micro-Step
              </span>
              <p className="text-sm font-semibold text-white leading-snug">
                "{explanation.actionable_micro_step}"
              </p>
              <p className="text-[11px] text-slate-400">
                Small micro-habits compound into significant long-term HbA1c reductions without requiring restrictive diets.
              </p>
            </div>

            {/* Encouragement Card */}
            <div className="glass-panel rounded-2xl p-5 border border-purple-500/20 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-rose-400" />
                A Word for Alex
              </span>
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                "{explanation.coaching_encouragement}"
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Model Engine: {explanation.provider}</span>
                <span>Self-Hosted &bull; Zero Cloud Leak</span>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
          <p>Click "Ask Gemma Coach" on the Meal Predictor to generate clinical insights.</p>
        </div>
      )}

    </div>
  );
};

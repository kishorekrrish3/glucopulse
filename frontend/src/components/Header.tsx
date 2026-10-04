import React from 'react';
import { Activity, Cpu, Sparkles, ShieldCheck, Settings, Volume2, Cloud } from 'lucide-react';
import { HealthCheckResponse } from '../types';

interface HeaderProps {
  health: HealthCheckResponse | null;
  onOpenSettings: () => void;
  onVoiceBriefing: () => void;
  isSpeaking: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  onOpenSettings,
  onVoiceBriefing,
  isSpeaking,
}) => {
  const isTabPFNNative = health?.tabpfn?.is_native ?? false;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Friend Context */}
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-500/25 ring-1 ring-white/20">
            <Activity className="h-6 w-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                GlucoPulse
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                HF26 Challenge
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Metabolic Guardian & Spike Predictor for <span className="text-rose-300 font-semibold">Alex</span>
            </p>
          </div>
        </div>

        {/* AI & Innovation Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* TabPFN Foundation Model Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium">
            <Cpu className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>TabPFN {isTabPFNNative ? 'Native v2' : 'Prior Engine'}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </div>

          {/* Gemma Open-Weight Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Gemma 2 Coach</span>
          </div>

          {/* Privacy Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
            <span>100% Private / Local-First</span>
          </div>

          {/* Render Ready Badge */}
          <a
            href="https://render.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <Cloud className="h-3.5 w-3.5 text-indigo-400" />
            <span>Render Ready</span>
          </a>

          {/* Voice Coach Button */}
          <button
            onClick={onVoiceBriefing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isSpeaking
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Listen to audio briefing"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>{isSpeaking ? 'Speaking...' : 'Voice Brief'}</span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Configure TabPFN / Gemma / ElevenLabs API keys"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

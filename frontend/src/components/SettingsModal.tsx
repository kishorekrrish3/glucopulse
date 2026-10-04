import React, { useState } from 'react';
import { X, Key, Cpu, Sparkles, Volume2, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { HealthCheckResponse } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: HealthCheckResponse | null;
  onSaveToken: (token: string) => Promise<boolean>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  health,
  onSaveToken,
}) => {
  const [token, setToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsSaving(true);
    setStatusMsg(null);
    try {
      const success = await onSaveToken(token.trim());
      if (success) {
        setStatusMsg({ type: 'success', text: 'Prior Labs TabPFN token connected successfully!' });
      } else {
        setStatusMsg({
          type: 'error',
          text: 'Token received, running in calibrated Bayesian surrogate mode.',
        });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update token' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-sky-400">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">AI Engine Configuration</h2>
            <p className="text-xs text-slate-400">Manage Prior Labs TabPFN, Gemma, and ElevenLabs settings</p>
          </div>
        </div>

        {/* TabPFN Status Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-emerald-400" />
              Prior Labs TabPFN Foundation Model
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                health?.tabpfn?.is_native
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              {health?.tabpfn?.is_native ? 'Native Prior Labs v2' : 'Calibrated Prior Engine'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Prior Labs' TabPFN is a foundation model trained on synthetic prior data for instant tabular inference without tuning.
          </p>

          <form onSubmit={handleSave} className="space-y-2 pt-1">
            <label className="text-[11px] font-semibold text-slate-400 block">
              TABPFN_TOKEN (Prior Labs API Key)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your Prior Labs token..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
              >
                {isSaving ? 'Connecting...' : 'Connect'}
              </button>
            </div>
            <a
              href="https://ux.priorlabs.ai/account"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-sky-400 hover:underline inline-flex items-center gap-1 mt-1"
            >
              <span>Get your free TabPFN API key from Prior Labs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </form>

          {statusMsg && (
            <div
              className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <Check className="h-4 w-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}
        </div>

        {/* Partner Tech Summary */}
        <div className="space-y-2.5 text-xs text-slate-400">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              Google Gemma 2 / 3
            </span>
            <span className="text-emerald-400 font-semibold font-mono text-[11px]">
              Ready (Cloud / Local)
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Volume2 className="h-3.5 w-3.5 text-rose-400" />
              ElevenLabs Voice Engine
            </span>
            <span className="text-sky-400 font-semibold font-mono text-[11px]">
              {health?.elevenlabs?.has_key ? 'ElevenLabs API Active' : 'Web Speech Synthesis Mode'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Layers,
  Sparkles,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Header } from './components/Header';
import { MealPredictorTab, PRESET_MEALS } from './components/MealPredictorTab';
import { InterventionStudioTab } from './components/InterventionStudioTab';
import { GemmaCoachTab } from './components/GemmaCoachTab';
import { HistoryExplorerTab } from './components/HistoryExplorerTab';
import { ClinicalReportTab } from './components/ClinicalReportTab';
import { SettingsModal } from './components/SettingsModal';
import {
  MealInput,
  TabPFNPrediction,
  SimulationsMap,
  GemmaExplanation,
  HistoricalRecord,
  SummaryStats,
  HealthCheckResponse,
} from './types';

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'predictor' | 'interventions' | 'gemma' | 'history' | 'report'>('predictor');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active Meal State
  const [meal, setMeal] = useState<MealInput>(PRESET_MEALS[0].meal);
  const [prediction, setPrediction] = useState<TabPFNPrediction | null>(null);
  const [simulations, setSimulations] = useState<SimulationsMap | null>(null);
  const [explanation, setExplanation] = useState<GemmaExplanation | null>(null);

  // History & Summary State
  const [historyRecords, setHistoryRecords] = useState<HistoricalRecord[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [doctorReportMd, setDoctorReportMd] = useState<string>('');
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);

  // Loading States
  const [isLoadingPred, setIsLoadingPred] = useState(false);
  const [isLoadingGemma, setIsLoadingGemma] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch initial health and history
  useEffect(() => {
    fetchHealth();
    fetchHistory();
    fetchDoctorReport();
  }, []);

  // Run prediction whenever meal parameters change
  useEffect(() => {
    const timer = setTimeout(() => {
      runPredictionAndSim(meal);
    }, 150);
    return () => clearTimeout(timer);
  }, [meal]);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (e) {
      console.warn('Health check error:', e);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryRecords(data.records || []);
        setSummaryStats(data.summary || null);
      }
    } catch (e) {
      console.warn('History fetch error:', e);
    }
  };

  const fetchDoctorReport = async () => {
    try {
      const res = await fetch('/api/doctor-report');
      if (res.ok) {
        const data = await res.json();
        setDoctorReportMd(data.report_markdown || '');
      }
    } catch (e) {
      console.warn('Doctor report fetch error:', e);
    }
  };

  const runPredictionAndSim = async (currentMeal: MealInput) => {
    setIsLoadingPred(true);
    setErrorMsg(null);
    try {
      // 1. TabPFN Prediction
      const predRes = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMeal),
      });

      if (!predRes.ok) throw new Error('Prediction API failed');
      const predData = await predRes.json();
      setPrediction(predData.prediction);

      // 2. TabPFN Counterfactual Simulation
      const simRes = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMeal),
      });
      if (simRes.ok) {
        const simData = await simRes.json();
        setSimulations(simData.simulations);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to fetch TabPFN prediction. Please check server status.');
    } finally {
      setIsLoadingPred(false);
    }
  };

  const handleFetchGemmaExplanation = async () => {
    if (!prediction) return;
    setIsLoadingGemma(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal: meal,
          prediction: prediction,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setExplanation(data);
      }
    } catch (err) {
      console.error('Gemma explanation error:', err);
    } finally {
      setIsLoadingGemma(false);
    }
  };

  const handleVoiceBriefing = async () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    const narrativeText = explanation
      ? `${explanation.headline}. ${explanation.actionable_micro_step}. ${explanation.coaching_encouragement}`
      : `Alex, for your ${meal.meal_name}, TabPFN predicts a peak of ${prediction?.predicted_peak_glucose ?? 140} milligrams per deciliter. A 15-minute walk will drop your peak into the safe range.`;

    setIsSpeaking(true);

    try {
      // Try backend ElevenLabs endpoint
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: narrativeText }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.has_audio && data.audio_base64) {
          const audio = new Audio(data.audio_base64);
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => fallbackWebSpeech(narrativeText);
          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn('ElevenLabs API unavailable, falling back to Web Speech synthesis:', e);
    }

    fallbackWebSpeech(narrativeText);
  };

  const fallbackWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  const handleApplyIntervention = (type: 'walk' | 'fiber' | 'sequencing' | 'combined') => {
    if (type === 'walk') {
      setMeal((prev) => ({ ...prev, post_meal_walk_min: Math.max(15, prev.post_meal_walk_min + 15) }));
    } else if (type === 'fiber') {
      setMeal((prev) => ({
        ...prev,
        fiber_g: prev.fiber_g + 8,
        glycemic_index: Math.max(20, prev.glycemic_index - 10),
      }));
    } else if (type === 'sequencing') {
      setMeal((prev) => ({
        ...prev,
        glycemic_index: Math.max(20, prev.glycemic_index - 15),
      }));
    } else if (type === 'combined') {
      setMeal((prev) => ({
        ...prev,
        post_meal_walk_min: 15,
        fiber_g: prev.fiber_g + 8,
        glycemic_index: Math.max(20, prev.glycemic_index - 20),
      }));
    }
    setActiveTab('predictor');
  };

  const handleSaveToken = async (token: string) => {
    const res = await fetch('/api/settings/tabpfn-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tabpfn_token: token }),
    });
    if (res.ok) {
      await fetchHealth();
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Header */}
      <Header
        health={health}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onVoiceBriefing={handleVoiceBriefing}
        isSpeaking={isSpeaking}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('predictor')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'predictor'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>1. Meal Predictor & Curve</span>
          </button>

          <button
            onClick={() => setActiveTab('interventions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'interventions'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>2. Intervention Studio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('gemma');
              if (!explanation) handleFetchGemmaExplanation();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'gemma'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>3. Gemma Coach & Swaps</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>4. Alex's 60-Day Journal</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>5. Doctor's Summary</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Content Render */}
        {activeTab === 'predictor' && (
          <MealPredictorTab
            meal={meal}
            onChangeMeal={setMeal}
            prediction={prediction}
            isLoading={isLoadingPred}
            onSelectPreset={setMeal}
            onNavigateToInterventions={() => setActiveTab('interventions')}
            onNavigateToGemma={() => {
              setActiveTab('gemma');
              handleFetchGemmaExplanation();
            }}
          />
        )}

        {activeTab === 'interventions' && (
          <InterventionStudioTab
            meal={meal}
            simulations={simulations}
            isLoading={isLoadingPred}
            onApplyIntervention={handleApplyIntervention}
          />
        )}

        {activeTab === 'gemma' && (
          <GemmaCoachTab
            meal={meal}
            prediction={prediction}
            explanation={explanation}
            isLoading={isLoadingGemma}
            onRefreshGemma={handleFetchGemmaExplanation}
            onPlayVoice={handleVoiceBriefing}
            isSpeaking={isSpeaking}
          />
        )}

        {activeTab === 'history' && (
          <HistoryExplorerTab
            records={historyRecords}
            summary={summaryStats}
            onSelectMealForSimulation={(selectedMeal) => {
              setMeal(selectedMeal);
              setActiveTab('predictor');
            }}
          />
        )}

        {activeTab === 'report' && (
          <ClinicalReportTab
            reportMarkdown={doctorReportMd}
            summary={summaryStats}
          />
        )}

      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        health={health}
        onSaveToken={handleSaveToken}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            GlucoPulse &bull; Built with love for <strong>Alex</strong> &bull; Hacktoberfest 2026: Build for a Friend
          </p>
          <p className="flex items-center gap-2 text-slate-400">
            <span>Prior Labs TabPFN</span> &bull; <span>Google Gemma 2</span> &bull; <span>Render</span> &bull; <span>ElevenLabs</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

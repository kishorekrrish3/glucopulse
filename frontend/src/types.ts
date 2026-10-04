export interface MealInput {
  meal_name: string;
  carbs_g: number;
  fiber_g: number;
  net_carbs_g?: number;
  protein_g: number;
  fat_g: number;
  glycemic_index: number;
  pre_meal_glucose: number;
  sleep_hours: number;
  stress_level: number;
  post_meal_walk_min: number;
  meal_time_hour: number;
}

export interface CurvePoint {
  minute: number;
  glucose: number;
  ci_lower: number;
  ci_upper: number;
}

export interface TabPFNPrediction {
  predicted_peak_glucose: number;
  spike_category: 'Normal' | 'Elevated' | 'Severe Spike';
  risk_label: string;
  risk_color: string;
  category_probabilities: Record<string, number>;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  time_to_peak_min: number;
  clearance_time_min: number;
  glucose_rise_delta: number;
  curve_points: CurvePoint[];
  model_engine: string;
  is_native_tabpfn: boolean;
}

export interface SimulationResult {
  label: string;
  peak: number;
  category: string;
  delta_peak?: number;
  clearance_min: number;
  curve: CurvePoint[];
}

export interface SimulationsMap {
  baseline: SimulationResult;
  walk_15m: SimulationResult;
  fiber_boost: SimulationResult;
  veggies_first: SimulationResult;
  combined_protocol: SimulationResult;
}

export interface SmartSwap {
  original: string;
  alternative: string;
  benefit: string;
}

export interface GemmaExplanation {
  headline: string;
  mechanism_explanation: string;
  swaps: SmartSwap[];
  actionable_micro_step: string;
  coaching_encouragement: string;
  provider: string;
}

export interface HistoricalRecord {
  meal_id: string;
  meal_name: string;
  timestamp: string;
  meal_type: string;
  carbs_g: number;
  fiber_g: number;
  net_carbs_g: number;
  protein_g: number;
  fat_g: number;
  glycemic_index: number;
  glycemic_load: number;
  pre_meal_glucose: number;
  sleep_hours: number;
  stress_level: number;
  post_meal_walk_min: number;
  meal_time_hour: number;
  peak_glucose: number;
  time_to_peak_min: number;
  spike_category: string;
  clearance_time_min: number;
}

export interface SummaryStats {
  total_meals_logged: number;
  days_monitored: number;
  time_in_range_pct: number;
  mean_glucose_mg_dl: number;
  glycemic_variability_cv: number;
  estimated_a1c: number;
  severe_spikes_count: number;
  elevated_count: number;
  normal_count: number;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
  tabpfn: {
    ready: boolean;
    engine: string;
    is_native: boolean;
    records_in_memory: number;
  };
  gemma: {
    ready: boolean;
    has_google_key: boolean;
    has_hf_token: boolean;
  };
  elevenlabs: {
    ready: boolean;
    has_key: boolean;
  };
}

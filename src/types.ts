export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface HealthRecord {
  id: string;
  userId: string;
  date: string;
  glucoseLevel: number;
  hba1c?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  weight?: number;
  medications?: string[];
  notes?: string;
  documentUrl?: string;
}

export interface AnalysisResult {
  id: string;
  recordId: string;
  date: string;
  insights: string[];
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}
import { HealthRecord, AnalysisResult } from '../types';

export const mockHealthRecords: HealthRecord[] = [
  {
    id: '1',
    userId: '1',
    date: '2023-12-15',
    glucoseLevel: 140,
    hba1c: 7.2,
    bloodPressure: {
      systolic: 130,
      diastolic: 85
    },
    weight: 75,
    medications: ['Metformin', 'Insulin'],
    notes: 'Feeling better today, diet is improving',
    documentUrl: '/reports/dec2023.pdf'
  },
  {
    id: '2',
    userId: '1',
    date: '2024-01-20',
    glucoseLevel: 135,
    hba1c: 7.0,
    bloodPressure: {
      systolic: 128,
      diastolic: 82
    },
    weight: 73.5,
    medications: ['Metformin', 'Insulin'],
    notes: 'Increased physical activity',
    documentUrl: '/reports/jan2024.pdf'
  },
  {
    id: '3',
    userId: '1',
    date: '2024-02-18',
    glucoseLevel: 128,
    hba1c: 6.8,
    bloodPressure: {
      systolic: 125,
      diastolic: 80
    },
    weight: 72,
    medications: ['Metformin', 'Insulin'],
    notes: 'Diet plan working well',
    documentUrl: '/reports/feb2024.pdf'
  }
];

export const mockAnalysisResults: AnalysisResult[] = [
  {
    id: '1',
    recordId: '1',
    date: '2023-12-16',
    insights: [
      'Glucose levels are above target range',
      'Blood pressure is slightly elevated',
      'Weight management is on track'
    ],
    recommendations: [
      'Consider adjusting insulin dosage',
      'Maintain current diet plan',
      'Increase daily water intake'
    ],
    riskLevel: 'moderate'
  },
  {
    id: '2',
    recordId: '2',
    date: '2024-01-21',
    insights: [
      'Glucose levels showing improvement',
      'Blood pressure trending toward normal range',
      'Continued weight loss is positive'
    ],
    recommendations: [
      'Continue current medication regimen',
      'Maintain physical activity level',
      'Schedule follow-up in 4 weeks'
    ],
    riskLevel: 'low'
  },
  {
    id: '3',
    recordId: '3',
    date: '2024-02-19',
    insights: [
      'Glucose levels approaching target range',
      'Blood pressure is now within normal range',
      'Weight management is excellent'
    ],
    recommendations: [
      'Discuss potential medication adjustment with doctor',
      'Continue current diet and exercise plan',
      'Consider reducing monitoring frequency'
    ],
    riskLevel: 'low'
  }
];
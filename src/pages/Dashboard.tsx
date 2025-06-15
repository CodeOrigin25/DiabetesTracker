import React from 'react';
import { Activity, TrendingUp, TrendingDown, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockHealthRecords, mockAnalysisResults } from '../data/mockData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const latestRecord = mockHealthRecords[mockHealthRecords.length - 1];
  const previousRecord = mockHealthRecords[mockHealthRecords.length - 2];
  const latestAnalysis = mockAnalysisResults[mockAnalysisResults.length - 1];

  // Calculate trends
  const glucoseTrend = latestRecord.glucoseLevel < previousRecord.glucoseLevel;
  const hba1cTrend = (latestRecord.hba1c || 0) < (previousRecord.hba1c || 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome back, {user?.name}</h1>
        <p className="text-gray-600">Here's an overview of your health status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Glucose Level</p>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-gray-800">{latestRecord.glucoseLevel} mg/dL</p>
                {glucoseTrend ? (
                  <TrendingDown className="ml-2 h-5 w-5 text-green-500" />
                ) : (
                  <TrendingUp className="ml-2 h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Activity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">HbA1c</p>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-gray-800">{latestRecord.hba1c}%</p>
                {hba1cTrend ? (
                  <TrendingDown className="ml-2 h-5 w-5 text-green-500" />
                ) : (
                  <TrendingUp className="ml-2 h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Last Check</p>
              <p className="text-xl font-semibold text-gray-800">{latestRecord.date}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Next Appointment</p>
              <p className="text-xl font-semibold text-gray-800">May 15, 2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Health Insights</h2>
          <div className="space-y-4">
            {latestAnalysis.insights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                </div>
                <p className="ml-3 text-gray-600">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h2>
          <div className="space-y-4">
            {latestAnalysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <p className="ml-3 text-gray-600">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
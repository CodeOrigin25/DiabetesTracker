import React, { useState } from 'react';
import { BarChart2, TrendingUp, Calendar, Filter } from 'lucide-react';
import { mockHealthRecords, mockAnalysisResults } from '../data/mockData';

const Analysis: React.FC = () => {
  const [timeRange, setTimeRange] = useState('3m');
  
  // Filter records based on time range
  const filteredRecords = mockHealthRecords.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    
    if (timeRange === '1m') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return recordDate >= oneMonthAgo;
    } else if (timeRange === '3m') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return recordDate >= threeMonthsAgo;
    } else if (timeRange === '6m') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return recordDate >= sixMonthsAgo;
    } else {
      return true; // All time
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Health Analysis</h1>
          <p className="text-gray-600">View trends and insights from your health data</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Glucose Trends</h2>
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            {/* This would be a chart in a real app */}
            <div className="text-center">
              <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Glucose level chart would appear here</p>
              <p className="text-sm text-gray-400">Showing data for {timeRange === '1m' ? 'the last month' : timeRange === '3m' ? 'the last 3 months' : timeRange === '6m' ? 'the last 6 months' : 'all time'}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Average: 134 mg/dL</span>
              <span className="text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Improving
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">HbA1c Progress</h2>
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            {/* This would be a chart in a real app */}
            <div className="text-center">
              <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">HbA1c trend chart would appear here</p>
              <p className="text-sm text-gray-400">Showing data for {timeRange === '1m' ? 'the last month' : timeRange === '3m' ? 'the last 3 months' : timeRange === '6m' ? 'the last 6 months' : 'all time'}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Latest: 6.8%</span>
              <span className="text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Improving
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Health Insights</h2>
            <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </button>
          </div>
          <div className="space-y-4">
            {mockAnalysisResults.map((analysis) => (
              <div key={analysis.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">{analysis.date}</span>
                  <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                    analysis.riskLevel === 'low' 
                      ? 'bg-green-100 text-green-800' 
                      : analysis.riskLevel === 'moderate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)} Risk
                  </span>
                </div>
                <h3 className="text-md font-medium text-gray-900 mb-2">Key Insights</h3>
                <ul className="space-y-1 mb-3">
                  {analysis.insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      </div>
                      <p className="ml-3 text-sm text-gray-600">{insight}</p>
                    </li>
                  ))}
                </ul>
                <h3 className="text-md font-medium text-gray-900 mb-2">Recommendations</h3>
                <ul className="space-y-1">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <p className="ml-3 text-sm text-gray-600">{recommendation}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Health Summary</h2>
        </div>
        <div className="prose max-w-none">
          <p>
            Based on your recent health data, your diabetes management is showing positive trends. Your glucose levels have decreased by 8.5% over the past three months, and your HbA1c has improved from 7.2% to 6.8%.
          </p>
          <p>
            Your blood pressure readings are now consistently within the normal range, and your weight has decreased by 3kg, which is contributing to better overall health outcomes.
          </p>
          <h3>Key Achievements</h3>
          <ul>
            <li>Consistent medication adherence</li>
            <li>Improved dietary habits</li>
            <li>Increased physical activity</li>
            <li>Better glucose monitoring frequency</li>
          </ul>
          <h3>Areas for Improvement</h3>
          <ul>
            <li>Evening glucose readings still occasionally elevated</li>
            <li>Consider more consistent meal timing</li>
            <li>Increase water intake throughout the day</li>
          </ul>
          <p>
            Continue with your current management plan and consider discussing medication adjustments with your healthcare provider at your next appointment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
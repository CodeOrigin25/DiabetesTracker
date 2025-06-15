import React, { useState } from 'react';
import { Upload, FileText, X, Check, AlertCircle } from 'lucide-react';

const AnalyzeDocuments: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const analyzeDocuments = () => {
    if (files.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setAnalysisResults(`
        Based on the uploaded medical documents, we've detected the following:
        
        - Blood glucose levels averaging 135 mg/dL over the past month
        - HbA1c level of 7.1% (slightly elevated)
        - Blood pressure readings within normal range (125/82 mmHg)
        - Cholesterol levels: Total 190 mg/dL, LDL 110 mg/dL, HDL 45 mg/dL
        
        Recommendations:
        - Continue current medication regimen
        - Consider increasing physical activity to 30 minutes daily
        - Schedule follow-up appointment in 3 months
        - Monitor blood glucose more frequently before meals
      `);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Analyze Medical Documents</h1>
        <p className="text-gray-600">Upload your medical documents for AI analysis</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Drag and drop your files here
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse from your computer
            </p>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            >
              Select Files
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Selected Files</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={analyzeDocuments}
                disabled={isAnalyzing}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Documents'}
              </button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="mt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
              <p className="text-gray-600">Analyzing your documents...</p>
            </div>
          </div>
        )}

        {analysisComplete && analysisResults && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Analysis Complete</h3>
                <div className="mt-2 text-sm text-green-700 whitespace-pre-line">
                  {analysisResults}
                </div>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    Save to Health Records
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">About Document Analysis</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>Our AI system can analyze various medical documents including:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Lab test results</li>
                <li>Doctor's notes and prescriptions</li>
                <li>Hospital discharge summaries</li>
                <li>Radiology and imaging reports</li>
                <li>Medication lists</li>
              </ul>
              <p className="mt-2">
                The system extracts key health metrics, identifies trends, and provides personalized recommendations based on your medical history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeDocuments;
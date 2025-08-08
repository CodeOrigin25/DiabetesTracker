import React, { useState, useEffect } from 'react';
import { Upload, FileText, X, Check, AlertCircle } from 'lucide-react';
import { extractTextWithOCRSpace } from '../utils/ocrSpace';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AnalyzeDocuments: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<string | null>(null);
  const [savedDocs, setSavedDocs] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      const snapshot = await getDocs(collection(db, 'healthRecords'));
      const docs = snapshot.docs
        .map(doc => doc.data())
        .filter(doc => doc.userId === auth.currentUser?.uid && doc.fileUrl);

      setSavedDocs(docs);
    };

    fetchDocs();
  }, []);

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

  const handleUseSavedDoc = async (doc: any) => {
    try {
      const response = await fetch(doc.fileUrl);
      const blob = await response.blob();
      const file = new File([blob], doc.fileName || `document-${Date.now()}`, { type: blob.type });
      setFiles(prev => [...prev, file]);
    } catch (err) {
      console.error('Error loading saved document:', err);
    }
  };

  const analyzeDocuments = async () => {
    if (files.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnalysisResults(null);

    try {
      const ocrTexts = await Promise.all(
        files.map(async (file) => {
          const text = await extractTextWithOCRSpace(file);
          return `--- ${file.name} ---\n${text}`;
        })
      );

      const combinedText = ocrTexts.join('\n\n');
      setAnalysisResults(combinedText);
      setAnalysisComplete(true);
    } catch (error) {
      console.error('OCR Error:', error);
      setAnalysisResults('Failed to analyze the documents. Please try again.');
      setAnalysisComplete(true);
    }

    setIsAnalyzing(false);
  };

  const saveAnalysisToHealthRecords = async () => {
  if (!analysisResults || !auth.currentUser) return;

  setIsSaving(true);
  setSaveSuccess(false);

  const uid = auth.currentUser.uid;
  const userRecordsRef = collection(db, 'healthRecords', uid, 'records');

  try {
    await addDoc(userRecordsRef, {
      notes: analysisResults,
      timestamp: Timestamp.now(),
      fileUrl: null,
      fileName: files.length === 1 ? files[0].name : `AnalyzedFiles-${Date.now()}`
    });
    setSaveSuccess(true);
    setFiles([]); // Clear after saving
  } catch (err) {
    console.error('Error saving analysis:', err);
  }

  setIsSaving(false);
};

  return (
    <div className="max-w-4xl mx-auto">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Analyze Medical Documents</h1>
        <p className="text-gray-600">Upload your medical documents for AI analysis</p>
      </div>

      {/* Upload Box */}
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
            <h3 className="text-lg font-medium text-gray-900 mb-1">Drag and drop your files here</h3>
            <p className="text-sm text-gray-500 mb-4">or click to browse from your computer</p>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Select Files
            </label>
          </div>
        </div>

        {/* Saved Docs */}
        {savedDocs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Use a Previously Uploaded Document</h3>
            <div className="space-y-2">
              {savedDocs.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.fileName || `Document ${index + 1}`}</p>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        View
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUseSavedDoc(doc)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Use for Analysis
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File List */}
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

            {/* Analyze Button */}
            <div className="mt-6">
              <button
                onClick={analyzeDocuments}
                disabled={isAnalyzing}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Documents'}
              </button>
            </div>
          </div>
        )}

        {/* Analysis Spinner */}
        {isAnalyzing && (
          <div className="mt-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-gray-600">Analyzing your documents...</p>
          </div>
        )}

        {/* Analysis Results */}
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
                  <button
                    onClick={saveAnalysisToHealthRecords}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save to Health Records'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* About Info */}
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

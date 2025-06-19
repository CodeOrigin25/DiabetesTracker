import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp, Download, Eye } from 'lucide-react';
import AddRecordModal from '../components/AddRecordModal';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { HealthRecord } from '../types';

const HealthRecords: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHealthRecords = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const recordsRef = collection(db, 'healthRecords', user.uid, 'records');
    const snapshot = await getDocs(recordsRef);
    const data: HealthRecord[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as HealthRecord[];
    setRecords(data);
  };

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const toggleRecord = (id: string) => {
    setExpandedRecord(expandedRecord === id ? null : id);
  };

  const handleAddRecord = async (newRecord: Omit<HealthRecord, 'id'>) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const recordsRef = collection(db, 'healthRecords', user.uid, 'records');
      const docRef = await addDoc(recordsRef, {
        ...newRecord,
        createdAt: Timestamp.now(),
      });
      setRecords(prev => [...prev, { ...newRecord, id: docRef.id }]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Health Records</h1>
          <p className="text-gray-600">View and manage your health records</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Record
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {records.map((record: HealthRecord) => (
            <div key={record.id} className="divide-y divide-gray-200">
              <div className="p-6">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleRecord(record.id)}
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Health Record - {record.date}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Glucose: {record.glucoseLevel} mg/dL | HbA1c: {record.hba1c}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button className="p-1 text-gray-400 hover:text-gray-500 mr-2">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-500 mr-2">
                      <Download className="h-5 w-5" />
                    </button>
                    {expandedRecord === record.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedRecord === record.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Glucose Level</h4>
                        <p className="mt-1 text-gray-900">{record.glucoseLevel} mg/dL</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">HbA1c</h4>
                        <p className="mt-1 text-gray-900">{record.hba1c}%</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Blood Pressure</h4>
                        <p className="mt-1 text-gray-900">
                          {record.bloodPressure?.systolic}/{record.bloodPressure?.diastolic} mmHg
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Weight</h4>
                        <p className="mt-1 text-gray-900">{record.weight} kg</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">Medications</h4>
                        <div className="mt-1">
                          {record.medications?.map((med, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                            >
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                        <p className="mt-1 text-gray-900">{record.notes || 'No notes'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <AddRecordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddRecord}
        />
      )}
    </div>
  );
};

export default HealthRecords;

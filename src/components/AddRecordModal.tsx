import React, { useState } from 'react';
import { X } from 'lucide-react';
import { HealthRecord } from '../types';
import { auth } from '../firebase'; // ✅ Already correctly imported
import { extractTextWithOCRSpace } from '../utils/ocrSpace';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRecord: Omit<HealthRecord, 'id'>) => Promise<void>;
}

const AddHealthRecordModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [glucoseLevel, setGlucoseLevel] = useState('');
  const [hba1c, setHba1c] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [weight, setWeight] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [document, setDocument] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔥 handleSubmit called'); // 🔍 Add this

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('You must be logged in to submit a health record.');
      return;
    }

    await onSave({
      glucoseLevel: parseFloat(glucoseLevel),
      hba1c: parseFloat(hba1c),
      bloodPressure: {
        systolic: parseInt(systolic, 10),
        diastolic: parseInt(diastolic, 10),
      },
      weight: parseFloat(weight),
      medications: medications.split(',').map(m => m.trim()),
      notes,
      date: new Date().toISOString().split('T')[0],
      userId: currentUser.uid, // ✅ Inject actual UID here
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add New Health Record</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Glucose Level (mg/dL)</label>
              <input
                type="number"
                value={glucoseLevel}
                onChange={(e) => setGlucoseLevel(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">HbA1c (%)</label>
              <input
                type="number"
                value={hba1c}
                onChange={(e) => setHba1c(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Systolic BP (mmHg)</label>
              <input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Diastolic BP (mmHg)</label>
              <input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Medications (comma-separated)</label>
              <input
                type="text"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Document (optional)</label>
            <input
              type="file"
              onChange={(e) => setDocument(e.target.files?.[0] || null)}
              className="mt-1 block w-full"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHealthRecordModal;

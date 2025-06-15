import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Activity, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../firebase';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const db = getFirestore(app);

  const [isEditing, setIsEditing] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const [editableDetails, setEditableDetails] = useState({
    name: user?.displayName || '',
    phone: '+91 98765 43210',
    address: '42/B, Krishna Nagar, Koramangala 4th Block, Bangalore, Karnataka 560034',
    dateOfBirth: 'January 15, 1990',
  });

  useEffect(() => {
    setPhotoURL(user?.photoURL || '');
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    await updateDoc(doc(db, 'users', user.uid), {
      name: editableDetails.name,
      phone: editableDetails.phone,
      address: editableDetails.address,
      dateOfBirth: editableDetails.dateOfBirth,
    });

    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-blue-600 h-32" />

        {/* Avatar + Info Section */}
        <div className="px-6 py-4 -mt-16">
          <div className="flex space-x-6 items-start">
            {/* Avatar and Upload Label */}
            <div className="shrink-0">
              <img
                className="h-32 w-32 rounded-full border-4 border-white object-cover"
                src={
                  photoURL ||
                  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=256&h=256'
                }
                alt="User avatar"
              />
              <label className="block mt-2 text-sm text-gray-500 cursor-not-allowed opacity-60">
                <Upload className="inline h-4 w-4 mr-1" />
                Upload Photo (Disabled)
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onClick={() =>
                    alert('Image uploads require Firebase billing to be enabled.')
                  }
                  disabled
                />
              </label>
            </div>

            {/* Name and Role aligned below the label */}
            <div className="pt-12">
              {isEditing ? (
                <input
                  className="text-2xl font-bold text-gray-900 border border-gray-300 rounded px-2 py-1 mb-1 w-full"
                  value={editableDetails.name}
                  onChange={(e) =>
                    setEditableDetails({ ...editableDetails, name: e.target.value })
                  }
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {editableDetails.name}
                </h1>
              )}
              <p className="text-gray-600 text-base">Type 2 Diabetes Patient</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <InfoItem
              label="Email"
              icon={<Mail className="h-5 w-5 text-gray-400 mr-3" />}
              content={user?.email || ''}
            />
            <EditableItem
              label="Phone"
              value={editableDetails.phone}
              isEditing={isEditing}
              onChange={(val) => setEditableDetails({ ...editableDetails, phone: val })}
              icon={<Phone className="h-5 w-5 text-gray-400 mr-3" />}
            />
            <EditableItem
              label="Address"
              value={editableDetails.address}
              isEditing={isEditing}
              onChange={(val) => setEditableDetails({ ...editableDetails, address: val })}
              icon={<MapPin className="h-5 w-5 text-gray-400 mr-3" />}
            />
            <EditableItem
              label="Date of Birth"
              value={editableDetails.dateOfBirth}
              isEditing={isEditing}
              onChange={(val) =>
                setEditableDetails({ ...editableDetails, dateOfBirth: val })
              }
              icon={<Calendar className="h-5 w-5 text-gray-400 mr-3" />}
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h2>
          <InfoItem
            label="Diabetes Type"
            content="Type 2"
            icon={<Activity className="h-5 w-5 text-gray-400 mr-3" />}
          />
          <InfoItem
            label="Diagnosis Date"
            content="March 10, 2020"
            icon={<Calendar className="h-5 w-5 text-gray-400 mr-3" />}
          />
        </div>
      </div>

      {/* Save/Edit Button */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Account Settings</h2>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({
  label,
  content,
  icon,
}: {
  label: string;
  content: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-start">
    {icon}
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900">{content}</p>
    </div>
  </div>
);

const EditableItem = ({
  label,
  value,
  onChange,
  isEditing,
  icon,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  isEditing: boolean;
  icon: React.ReactNode;
}) => (
  <div className="flex items-start">
    {icon}
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
        />
      ) : (
        <p className="text-gray-900">{value}</p>
      )}
    </div>
  </div>
);

export default Profile;

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '@/redux/auth/authSlice';

function ProfilePage() {
  const { currentUser } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
  });

  const [editedValues, setEditedValues] = useState({
    name: '',
    email: '',
    about: '', // Added about field for teachers
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (currentUser) {
      console.log('Current user type in profile:', currentUser.userType);
      console.log('Current user name:', currentUser.displayName);
      setEditedValues({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        about: currentUser.about || '', // Initialize about field
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleBackToChat = () => {
    navigate('/chat');
  };

  const handleEdit = (field: string) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSave = async (field: string) => {
    if (field === 'email' && !validateEmail(editedValues.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address.' });
      return;
    }

    setEditMode({ ...editMode, [field]: false });
    try {
      await updateUserProfile({ [field]: editedValues[field] });
      setErrors({ ...errors, [field]: '' });
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
      setErrors({ ...errors, [field]: `Failed to update ${field}. Please try again.` });
    }
  };

  const handleChange = (field, value) => {
    setEditedValues({ ...editedValues, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-white dark:bg-black rounded-2xl p-8 shadow-md">
        <h1 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 mb-6">
          User Profile
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {editedValues.name || 'N/A'}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {editedValues.email || 'N/A'}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            User Type
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {currentUser.userType || 'N/A'}
          </p>
        </div>
        {currentUser.userType === 'teacher' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              About Me
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {editedValues.about || 'N/A'}
            </p>
          </div>
        )}
        <div className="mt-6">
          <button
            onClick={handleBackToChat}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

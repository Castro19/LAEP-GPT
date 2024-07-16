import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '@/redux/auth/authSlice';

function ProfilePage() {
  const { currentUser } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    researchFocus: false,
    aboutMe: false,
  });

  const [editedValues, setEditedValues] = useState({
    name: '',
    email: '',
    researchFocus: '',
    aboutMe: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    researchFocus: '',
    aboutMe: '',
  });

  const updateLocalState = (user) => {
    if (user) {
      setEditedValues({
        name: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '',
        email: user.email || '',
        researchFocus: user.researchFocus || '',
        aboutMe: user.aboutMe || '',
      });
    }
  };

  // Update local state when currentUser changes
  useEffect(() => {
    updateLocalState(currentUser);
  }, [currentUser]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleBackToChat = () => {
    navigate('/chat');
  };

  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSave = async (field) => {
    if (field === 'email' && !validateEmail(editedValues.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address.' });
      return;
    }

    setEditMode({ ...editMode, [field]: false });
    try {
      await dispatch(updateUserProfile({ [field]: editedValues[field] })).unwrap();
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

  const renderField = (label, field, editable = true, isTextArea = false) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {editMode[field] && editable ? (
        <div className="flex flex-col mt-1">
          {isTextArea ? (
            <textarea
              value={editedValues[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="flex-grow p-2 border rounded text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
              rows={4}
            />
          ) : (
            <input
              type="text"
              value={editedValues[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="flex-grow p-2 border rounded text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            />
          )}
          {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
          <button
            onClick={() => handleSave(field)}
            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {editedValues[field] || 'N/A'}
          </p>
          {editable && (
            <button
              onClick={() => handleEdit(field)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-xs"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-white dark:bg-black rounded-2xl p-8 shadow-md">
        <h1 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 mb-6">
          User Profile
        </h1>
        {renderField('Name', 'name')}
        {renderField('Email', 'email')}
        {renderField('User Type', 'userType', false)}
        {currentUser.userType === 'teacher' && (
          <>
            {renderField('Research Focus', 'researchFocus')}
            {renderField('About Me', 'aboutMe', true, true)}
          </>
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
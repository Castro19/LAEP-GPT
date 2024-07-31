import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { currentUser, userId } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    about: '', // Added about field for teachers
    userType: '',
    availability: '', // New field
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) { // Ensure userId is present
        try {
          const response = await fetch(`http://localhost:4000/users/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data = await response.json();
          setUserData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: currentUser.email || '', // Set the email from the currentUser object
            about: data.about || '',
            userType: data.userType || '',
            availability: data.availability || '', // Include availability
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [userId, currentUser]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleBackToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-white dark:bg-black rounded-2xl p-8 shadow-md">
        <h1 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 mb-6">
          User Profile
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First Name
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {userData.firstName || 'N/A'}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Last Name
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {userData.lastName || 'N/A'}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {userData.email || 'N/A'}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            User Type
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {userData.userType || 'N/A'}
          </p>
        </div>
        {userData.userType === 'teacher' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              About Me
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {userData.about || 'N/A'}
            </p>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Availability
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {userData.availability || 'N/A'}
          </p>
        </div>
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

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from "../../redux/auth/authSlice"; // Adjust the path

function ProfilePage() {
  const { currentUser, userId } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    about: '',
    userType: '',
    availability: '',
  });

  const [isEditing, setIsEditing] = useState({ about: false, availability: false });

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:4000/users/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data = await response.json();
          setUserData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: currentUser.email || '',
            about: data.about || '',
            userType: data.userType || '',
            availability: data.availability || '',
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

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSave = (field) => {
    dispatch(updateUserProfile({ [field]: userData[field] }));
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
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
            {isEditing.about ? (
              <div className="flex flex-col">
                <textarea
                  name="about"
                  value={userData.about}
                  onChange={handleChange}
                  className="dark:bg-neutral-800 dark:text-white p-2 rounded-md mb-2"
                  style={{ resize: "none", height: "100px" }}
                />
                <button onClick={() => handleSave('about')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {userData.about || 'N/A'}
                </p>
                <button onClick={() => handleEdit('about')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Edit
                </button>
              </div>
            )}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Availability
          </label>
          {isEditing.availability ? (
            <div className="flex flex-col">
              <input
                name="availability"
                value={userData.availability}
                onChange={handleChange}
                className="dark:bg-neutral-800 dark:text-white p-2 rounded-md mb-2"
              />
              <button onClick={() => handleSave('availability')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {userData.availability || 'N/A'}
              </p>
              <button onClick={() => handleEdit('availability')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Edit
              </button>
            </div>
          )}
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
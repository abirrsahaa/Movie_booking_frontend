import React, { useEffect } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { authenticateUser, logout } from "../../slices/UserSlice"
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userData, isAuthenticated, isLoading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Automatically authenticate and fetch user details
    if (!isAuthenticated) {
      dispatch(authenticateUser());
    }
  }, [dispatch, isAuthenticated]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Generate initials
  const getInitials = (name?: string) => {
    if (!name) return 'UN';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Fallback to email if no name
  const displayName = userData?.name || userData?.email || 'User';
  const initials = getInitials(userData?.name);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 bg-gray-200">
        {userData?.avatar ? (
          <img 
            src={userData.avatar} 
            alt={displayName} 
            className="w-full h-full object-cover"
          />
        ) : (
          <AvatarFallback className="text-gray-600">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium">{displayName}</p>
        <div className="flex text-xs text-gray-500 space-x-2">
          <button 
            onClick={() => navigate('/profile')} 
            className="hover:text-gray-900"
          >
            View Profile
          </button>
          <span>|</span>
          <button 
            onClick={handleLogout} 
            className="hover:text-gray-900"
          >
            
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
import { useState } from 'react';
import axios from '@/lib/interceptors';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Call backend logout endpoint
      await axios.post('http://localhost:9090/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('token');
      
      // Show success message
      alert('Logged out successfully');
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      alert('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={isLoading}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutPage;
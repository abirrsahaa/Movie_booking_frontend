import { useState } from 'react';
import axios from '@/lib/interceptors';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

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
      toast.success("Logged out successfully !", {
        duration: 5000,
        icon: <Sparkles className="h-5 w-5 text-amber-400" />
      });

      // Redirect to login page
      setTimeout(() => {
        console.log("hey i am here ")
        navigate('/login');
      }, 5000);
    } catch (error) {
      toast.error("Logged out error ..stay here  !", {
        duration: 5000,
        icon: '⚠️'
      });
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
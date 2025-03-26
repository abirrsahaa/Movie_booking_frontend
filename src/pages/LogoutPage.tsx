import axios from '@/lib/interceptors';

const LogoutPage = () => {
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/auth/logout');
      localStorage.removeItem('token'); // Remove token from storage
      alert('Logged out successfully');
      window.location.href = '/login';
    } catch (error) {
      alert('Logout failed');
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutPage;
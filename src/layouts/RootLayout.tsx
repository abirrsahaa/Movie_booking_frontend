import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';



const RootLayout = () => {
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPath={location.pathname} />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;

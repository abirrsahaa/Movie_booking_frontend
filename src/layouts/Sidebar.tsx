import { Link } from 'react-router-dom';
import { Home, Film, Building2, BookText } from 'lucide-react';
import UserProfile from '../components/layout/UserProfile';    
import { cn } from '../lib/utils';

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

interface SidebarProps {
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navItems: NavItem[] = [
    { title: 'Home', path: '/', icon: Home },
    { title: 'Movies', path: '/movies', icon: Film },
    { title: 'Theatres', path: '/theatres', icon: Building2 },
    { title: 'My Bookings', path: '/bookings', icon: BookText },
  ];

  return (
    <div className="w-60 h-full bg-white flex flex-col border-r">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-red-600">MovieMagic</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = 
            (item.path === '/' && currentPath === '/') || 
            (item.path !== '/' && currentPath.startsWith(item.path));
            
          return (
            <Link
              key={item.title}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-red-50 text-red-600" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto p-4 border-t">
        <UserProfile />
      </div>
    </div>
  );
};

export default Sidebar;
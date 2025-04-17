import { Link } from 'react-router-dom';
import { Home, Film, Building2, BookText } from 'lucide-react';
import UserProfile from '../components/layout/UserProfile';
import { RiAuctionLine } from "react-icons/ri";
import { MdPendingActions } from "react-icons/md";
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
    { title: 'Home', path: '/main', icon: Home },
    { title: 'Movies', path: '/main/movies', icon: Film },
    { title: 'Theatres', path: '/main/theatres', icon: Building2 },
    { title: 'My Bookings', path: '/main/bookings', icon: BookText },
    { title: 'Auctions', path: '/main/auctions', icon: RiAuctionLine },
    { title: 'Pending Auctions', path: '/main/pending-auctions', icon: MdPendingActions },
  ];

  return (
    <div className="w-60 h-full bg-white flex flex-col border-r">
      <div className="p-4 border-b">
        <h1 className="text-lg text-blue-800 font-bold">WissenEntertainments</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            currentPath === item.path || (item.path !== '/main' && currentPath.startsWith(`${item.path}/`));

          return (
            <Link
              key={item.title}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-800 text-white"
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
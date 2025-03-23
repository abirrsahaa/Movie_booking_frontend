import { Avatar, AvatarFallback } from '../ui/avatar';

interface UserData {
  name: string;
  avatar?: string;
}

interface UserProfileProps {
  userData?: UserData;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  userData = { name: 'John Doe' } 
}) => {
  const initials = userData.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 bg-gray-200">
        {userData.avatar ? (
          <img src={userData.avatar} alt={userData.name} />
        ) : (
          <AvatarFallback className="text-gray-600">{initials}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium">{userData.name}</p>
        <div className="flex text-xs text-gray-500 space-x-2">
          <button className="hover:text-gray-900">View Profile</button>
          <span>|</span>
          <button className="hover:text-gray-900">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
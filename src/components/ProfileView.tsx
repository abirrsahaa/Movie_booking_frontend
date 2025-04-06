import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Edit,
  LogOut,
  Mail,
  User,
  Calendar,
  Phone
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useAppSelector, useAppDispatch } from '../store/store';
import { authenticateUser, logout, updateProfile } from "../slices/UserSlice";
import { useNavigate } from 'react-router-dom';

// const ProfileView: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { userData, isAuthenticated, isLoading, error } = useAppSelector((state) => state.user);

//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [editedProfile, setEditedProfile] = useState({
//     name: userData?.name || '',
//     email: userData?.email || '',
//     phone: userData?.phone || '',
//   });

//   useEffect(() => {
//     if (!isAuthenticated) {
//       dispatch(authenticateUser());
//     }
//   }, [dispatch, isAuthenticated]);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   const getInitials = (name?: string) => {
//     if (!name) return 'UN';
//     return name
//       .split(' ')
//       .map(part => part[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const handleProfileUpdate = () => {
//     dispatch(updateProfile(editedProfile));
//     setIsEditDialogOpen(false);
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   const displayName = userData?.name || userData?.email || 'User';
//   const initials = getInitials(userData?.name);

//   return (
//     <Card className="w-full max-w-md mx-auto shadow-lg">
//       <CardHeader className="flex flex-row items-center space-x-4 border-b pb-4">
//         <Avatar className="h-16 w-16 border-2">
//           {userData?.avatar ? (
//             <AvatarImage 
//               src={userData.avatar} 
//               alt={displayName} 
//               className="object-cover"
//             />
//           ) : (
//             <AvatarFallback className="text-xl font-bold text-gray-600">
//               {initials}
//             </AvatarFallback>
//           )}
//         </Avatar>
//         <div>
//           <CardTitle className="text-xl">{displayName}</CardTitle>
//           <p className="text-sm text-muted-foreground">{userData?.email}</p>
//         </div>
//       </CardHeader>

//       <CardContent className="pt-6">
//         <div className="space-y-4">
//           <div className="flex items-center space-x-3">
//             <User className="h-5 w-5 text-muted-foreground" />
//             <span>{userData?.name || 'Name not provided'}</span>
//           </div>

//           <div className="flex items-center space-x-3">
//             <Mail className="h-5 w-5 text-muted-foreground" />
//             <span>{userData?.email}</span>
//           </div>

//           {userData?.phone && (
//             <div className="flex items-center space-x-3">
//               <Phone className="h-5 w-5 text-muted-foreground" />
//               <span>{userData.phone}</span>
//             </div>
//           )}

//           {userData?.createdAt && (
//             <div className="flex items-center space-x-3">
//               <Calendar className="h-5 w-5 text-muted-foreground" />
//               <span>
//                 Joined {new Date(userData.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="mt-6 flex justify-between space-x-1">
//           {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//             <DialogTrigger asChild>
//               <Button variant="outline" className="w-[50%]">
//                 <Edit className="mr-2 h-4 w-4" /> Edit Profile
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Edit Profile</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4 py-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Name</label>
//                   <input 
//                     type="text" 
//                     value={editedProfile.name}
//                     onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Email</label>
//                   <input 
//                     type="email" 
//                     value={editedProfile.email}
//                     onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Phone</label>
//                   <input 
//                     type="tel" 
//                     value={editedProfile.phone}
//                     onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <Button 
//                   onClick={handleProfileUpdate} 
//                   className="w-full mt-4"
//                 >
//                   Save Changes
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog> */}

//           <Button 
//             variant="destructive" 
//             onClick={handleLogout} 
//             className="w-full"
//           >
//             <LogOut className="mr-2 h-4 w-4" /> Logout
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProfileView;



const ProfileView: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userData, isAuthenticated, isLoading, error } = useAppSelector((state) => state.user);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    phone: '',
  });

  // Update editedProfile when userData changes
  useEffect(() => {
    if (userData) {
      setEditedProfile({
        name: userData.name || '',

        phone: userData.phone || '',
      });
    }
  }, [userData]);


  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(authenticateUser());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'UN';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileUpdate = async () => {
    // Dispatch the action to update the profile
    await dispatch(updateProfile(editedProfile)).unwrap(); // Wait for the action to complete
    setIsEditDialogOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const displayName = userData?.name || userData?.email || 'User';
  const initials = getInitials(userData?.name);

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center space-x-4 border-b pb-4">
        <Avatar className="h-16 w-16 border-2">
          {userData?.avatar ? (
            <AvatarImage
              src={userData.avatar}
              alt={displayName}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="text-xl font-bold text-gray-600">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle className="text-xl">{displayName}</CardTitle>
          <p className="text-sm text-muted-foreground">{userData?.email}</p>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <span>{userData?.name || 'Name not provided'}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span>{userData?.email}</span>
          </div>

          {userData?.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>{userData.phone}</span>
            </div>
          )}

          {userData?.createdAt && (
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>
                Joined {new Date(userData.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between space-x-1">
          {/* Edit Profile Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-[50%]">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 ">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="w-full p-2  border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>

                  <input
                    type="text"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder={`${editedProfile?.phone || 'Enter your phone number'}`}
                  />
                </div>
                <Button
                  onClick={handleProfileUpdate}
                  className="w-full mt-4"
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-[50%]"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileView;
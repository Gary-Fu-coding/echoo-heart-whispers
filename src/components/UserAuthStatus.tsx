
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProfilePicture from '@/components/ProfilePicture';

interface UserAuthStatusProps {
  isLoggedIn: boolean;
  userEmail?: string | null;
}

const UserAuthStatus: React.FC<UserAuthStatusProps> = ({ isLoggedIn, userEmail }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('echoo-user-logged-in');
    localStorage.removeItem('echoo-user-email');
    localStorage.removeItem('echoo-user-name');
    
    // Show toast notification
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Navigate to auth page
    navigate('/');
  };
  
  if (!isLoggedIn) return null;
  
  return (
    <div className="w-full max-w-md flex justify-between items-center mb-2">
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {userEmail && `Logged in as: ${userEmail}`}
      </div>
      <div className="flex items-center gap-2">
        <ProfilePicture size="sm" editable />
        <Button 
          variant="outline"
          size="sm"
          onClick={() => navigate('/messages')}
          className="gap-1 text-gray-600 hover:text-echoo"
        >
          <MessageSquare size={14} />
          Messages
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-1 text-gray-600 hover:text-red-600"
        >
          <LogOut size={14} />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserAuthStatus;

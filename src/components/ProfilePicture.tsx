
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureProps {
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onImageChange?: (imageUrl: string) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ 
  size = 'md', 
  editable = false,
  onImageChange 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();
  
  // Size mapping for avatar
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };
  
  useEffect(() => {
    // Load profile picture from localStorage if available
    const savedImage = localStorage.getItem('echoo-user-profile-pic');
    if (savedImage) {
      setImageUrl(savedImage);
    }
  }, []);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast({
          title: "Image too large",
          description: "Please select an image under 5MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrl(result);
        localStorage.setItem('echoo-user-profile-pic', result);
        
        if (onImageChange) {
          onImageChange(result);
        }
        
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been successfully updated."
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImageUrl(null);
    localStorage.removeItem('echoo-user-profile-pic');
    
    if (onImageChange) {
      onImageChange('');
    }
    
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed."
    });
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Avatar className={`${sizeClasses[size]} bg-echoo-light border border-echoo/30 ${editable ? 'cursor-pointer' : ''}`}>
        {imageUrl ? (
          <AvatarImage src={imageUrl} alt="Profile" />
        ) : (
          <AvatarFallback className="bg-echoo-light text-echoo-dark">
            <Camera size={size === 'sm' ? 16 : size === 'md' ? 24 : 32} />
          </AvatarFallback>
        )}
      </Avatar>
      
      {editable && isHovering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
          <label className="cursor-pointer p-1">
            <Upload size={size === 'sm' ? 16 : 20} className="text-white" />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          
          {imageUrl && (
            <Button 
              variant="ghost" 
              size="icon-pill" 
              className="h-8 w-8 absolute -top-1 -right-1 bg-white text-red-500 hover:bg-red-100"
              onClick={handleRemoveImage}
            >
              <X size={14} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;

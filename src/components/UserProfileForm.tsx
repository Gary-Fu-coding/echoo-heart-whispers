
import React, { useState, useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import ProfilePicture from "./ProfilePicture";

interface UserProfileFormProps {
  onSubmit?: (data: UserProfileData) => void;
}

interface UserProfileData {
  name: string;
  email: string;
  profilePic: string;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [profilePic, setProfilePic] = useState<string>('');
  
  // Setup form with react-hook-form
  const form = useForm<UserProfileData>({
    defaultValues: {
      name: localStorage.getItem('echoo-user-name') || '',
      email: localStorage.getItem('echoo-user-email') || '',
      profilePic: localStorage.getItem('echoo-user-profile-pic') || '',
    }
  });
  
  useEffect(() => {
    // Load profile pic if it exists
    const savedProfilePic = localStorage.getItem('echoo-user-profile-pic');
    if (savedProfilePic) {
      setProfilePic(savedProfilePic);
    }
  }, []);
  
  const handleProfileSubmit = (data: UserProfileData) => {
    // Combine form data with profile pic
    const profileData = {
      ...data,
      profilePic
    };
    
    // Save to localStorage
    localStorage.setItem('echoo-user-name', profileData.name);
    localStorage.setItem('echoo-user-email', profileData.email);
    
    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit(profileData);
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated."
    });
  };
  
  const handleProfilePicChange = (imageUrl: string) => {
    setProfilePic(imageUrl);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center gap-4 mb-6">
        <ProfilePicture size="lg" editable onImageChange={handleProfilePicChange} />
        <p className="text-sm text-gray-500">
          Click on the image to upload or change your profile picture
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleProfileSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed to other users.
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} disabled />
                </FormControl>
                <FormDescription>
                  Your email address (cannot be changed).
                </FormDescription>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full mt-6">Save Profile</Button>
        </form>
      </Form>
    </div>
  );
};

export default UserProfileForm;

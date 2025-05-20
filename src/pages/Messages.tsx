import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MessageSquare, Search, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';
import ProfilePicture from '@/components/ProfilePicture';

// Dummy data for demonstration
const DEMO_CONTACTS = [
  { id: '1', name: 'Sophia Chen', lastMessage: 'Hey, how are you doing?', time: '10:23 AM', online: true },
  { id: '2', name: 'James Wilson', lastMessage: 'Did you see the latest update?', time: 'Yesterday', online: false },
  { id: '3', name: 'Olivia Martinez', lastMessage: 'Let me know when you\'re free to chat', time: 'Yesterday', online: true },
  { id: '4', name: 'Ethan Brown', lastMessage: 'Thanks for the help!', time: 'Monday', online: false },
];

// Dummy messages for a chat
const DEMO_CHAT = [
  { id: '1', senderId: '1', content: 'Hey there, how are you today?', timestamp: '10:20 AM' },
  { id: '2', senderId: 'me', content: 'I\'m doing well, thanks for asking! How about you?', timestamp: '10:21 AM' },
  { id: '3', senderId: '1', content: 'Pretty good! Just working on some new projects.', timestamp: '10:22 AM' },
  { id: '4', senderId: 'me', content: 'That sounds interesting. What kind of projects?', timestamp: '10:22 AM' },
  { id: '5', senderId: '1', content: 'Mostly AI-related stuff, trying to build a more natural language interface.', timestamp: '10:23 AM' },
];

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<Contact[]>(DEMO_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null);
  
  // Check if user is logged in and load profile picture
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('echoo-user-logged-in') === 'true';
    if (!isLoggedIn) {
      navigate('/');
    } else {
      // Load user profile picture from localStorage
      const savedProfilePic = localStorage.getItem('echoo-user-profile-pic');
      if (savedProfilePic) {
        setUserProfilePic(savedProfilePic);
      }
    }
  }, [navigate]);
  
  // Load chat messages when a contact is selected
  useEffect(() => {
    if (selectedContact) {
      // In a real app, this would fetch messages from an API
      setMessages(DEMO_CHAT);
    }
  }, [selectedContact]);
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    const newMessageObj: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessageObj]);
    setNewMessage('');
    
    // Simulate reply (in a real app, this would come from the server)
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.id,
        content: 'Thanks for your message! This is a demo response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare size={24} className="text-echoo" />
            <h1 className="text-lg font-semibold">Messages</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/chat')}
              className="flex items-center gap-1"
            >
              <Sparkles size={16} />
              <span>AI Chat</span>
            </Button>
            <ProfilePicture 
              size="sm" 
              editable 
              onImageChange={(imageUrl) => setUserProfilePic(imageUrl)} 
            />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex container max-w-6xl mx-auto">
        {/* Contacts List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id}
                className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id 
                    ? 'bg-echoo/10 dark:bg-echoo/20' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className="bg-echoo text-white">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">{contact.name}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{contact.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="w-2/3 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-echoo text-white">
                    {selectedContact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{selectedContact.name}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedContact.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto chat-scrollbar">
                <div className="flex flex-col gap-3">
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.senderId !== 'me' && (
                        <Avatar className="mr-2 mb-auto mt-1">
                          <AvatarFallback className="bg-echoo text-white">
                            {selectedContact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div 
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.senderId === 'me'
                            ? 'bg-echoo text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === 'me'
                            ? 'text-white/70'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>{message.timestamp}</p>
                      </div>
                      
                      {message.senderId === 'me' && (
                        <div className="ml-2 mb-auto mt-1">
                          {userProfilePic ? (
                            <Avatar>
                              <AvatarImage src={userProfilePic} alt="You" />
                              <AvatarFallback className="bg-echoo-light text-echoo-dark text-xs">ME</AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="bg-echoo-light border border-echoo/30">
                              <AvatarFallback className="bg-echoo-light text-echoo-dark text-xs">ME</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                  size="icon"
                >
                  <Send size={18} />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-center p-8">
              <div className="w-16 h-16 rounded-full bg-echoo/10 dark:bg-echoo/20 flex items-center justify-center">
                <MessageSquare size={30} className="text-echoo" />
              </div>
              <h2 className="text-xl font-medium">Select a contact to start chatting</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Choose a contact from the list on the left to start a conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;

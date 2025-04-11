
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Index from './Index';

const Home = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('echoo-user-logged-in') === 'true';
    
    // If not logged in, redirect to auth page
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  // Home page is basically the Index page with chat functionality
  return <Index />;
};

export default Home;

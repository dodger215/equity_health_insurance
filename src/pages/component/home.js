import React, { useEffect, useState } from 'react';
import Logo from '../../img/logo.png';
import OfflinePage from './ui/error';
import API_URL from './link';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        // If the API call is successful, navigate to the login page
        navigate('/login');
      } catch (error) {
        console.error(error);
        setIsError(true); // Set error state to true
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };

    checkApi();
  }, [navigate]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 0',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <img
          style={{
            scale: '0.4',
            margin: '20px 0',
          }}
          src={Logo}
          alt="Logo"
        />
        <div className="loader-start"></div>
      </div>
    );
  }

  if (isError) {
    return <OfflinePage />;
  }

  return null; 
}

export default Home;
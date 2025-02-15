import React from 'react';
import Auth from './component/auth';

function Login() {
  return (
    <div className='wrapper'>
      <div className='container'>
              <h1>Agent Login</h1>
              <div>
                  <Auth/>
              </div>
          </div>
    </div>
    
  );
}

export default Login;
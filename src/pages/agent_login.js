import React from 'react';
import Auth from './component/auth';
import Logo from '../img/logo.png'

import bg from './services.gif'

function Login() {
  return (
    <div className='wrapper'>
      <img src={ bg } style={{
                  scale: "1.7",
                  position: "absolute",
                  zIndex: "-100000",
                  top: "60%",
                  left: "50%",
                  transform: "translate(-30%, 0%)",
                }}/>
      <div className='container' style={{
        zIndex: "2",
      }}>
          

            <img src={ Logo } style={{
              scale: "0.5",
            }}/>
              <h1>Login</h1>
              <div>
                  <Auth/>
              </div>
          </div>
    </div>
    
  );
}

export default Login;
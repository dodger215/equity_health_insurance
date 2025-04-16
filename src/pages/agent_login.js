import React from 'react';
import Auth from './component/auth';
import Logo from '../img/logo.png'



function Login() {
  return (
    <div className='con'>
      <div className='bg'>
        <div className='bg-top'></div>
        <div className='bg-bottom'></div>
      </div>
      <div className='wrapper'>  
        <div className='screen__content'>
          <img src={ Logo } style={{
              scale: "0.5",
          }}/>
          <Auth/>
        </div>
      </div>        
    </div>
    
  );
}

export default Login;
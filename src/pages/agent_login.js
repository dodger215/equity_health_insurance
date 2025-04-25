import React from 'react';
import Auth from './component/auth';
import Logo from '../img/logo.png'



function Login() {
  return (
    <div className='con' style={{
      padding: "0px",
    }}>
      <div className='bg'>
        <div className='bg-top'></div>
        <div className='bg-bottom'></div>
      </div>
      <div className='wrapper' style={{
          padding: "0px",
        }}>  
        <div className='screen__content' style={{
          padding: "0px",
        }}>
          <div style={{
            margin: "100px 0",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}>
          <img src={ Logo } style={{
              width: "100px",
              height: "100px",
              border: "solid 0px #fff",
              borderRadius: "50px",
              boxShadow: "0px 0px 12px #00000021"

          }}/>
          <h3 style={{
            color: "#fff",
            margin: "20px 0",
            fontSize: "2.6em",

          }}>Welcome Back!</h3>
          </div>
          <Auth/>
        </div>
      </div>        
    </div>
    
  );
}

export default Login;
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import emailjs from 'emailjs-com';
import axios from 'axios';
import API_URL from '../link';
import { InternetLoader } from '../ui/loading';
import { useContext } from 'react';
import { PopupContext } from '../../../App';

import img from './otp.gif';

const CodeValidation = () => {
  const { setPopupState } = useContext(PopupContext)
  const [code, setCode] = useState(['', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const { clientId } = useParams();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/get/premium/${clientId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const premiums = localStorage.getItem("total_premium");


  console.log(`Premium: ${premiums}`);


  const generateCode = async () => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    setGeneratedCode(randomCode.toString());


    axios.get(`${API_URL}/get/client/${clientId}`)
      .then(response => {
        const clientNumber = response.data.phone_number;
        const clientName = `${response.data.first_name} ${response.data.surname}`;


        const generatePolicyId = () => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0"); 
          const randomInt = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000; 
          const policyPrefix = data?.product.slice(0, 3);
          return `${policyPrefix}_${year}$${month}&${randomInt}`;
        };
  

        const msg = `Dear ${clientName.toUpperCase()},  

You have applied for ${data?.product.toUpperCase()} with a premium ${data?.total}.  

Please provide the token:${randomCode} to the agent to finalise your application.`;


        console.log(`Email: ${response.data.email_address}`)


        emailjs.send('service_1zc90u8', 'template_zqpczsv', {
                  to_name: `${clientName}`,
                  from_name: "Equity",
                  message: `${msg}`,
                  reply_to: 'no-reply@yourcompany.com',
                  to_client: response.data.email_address,
                  from_email: "info@equityinsurance.com",
                }, 'OdwbNHd4lP5RDWUr6')
                
                  .then(() => {
                    // console.log(`Code - ${randomCode}`)
                    console.log('Email sent successfully')
                  })
                  .catch(error => console.error('Error sending email:', error));

        const params = {
          number: clientNumber,
          message: msg
        };

          axios.post(`${API_URL}/sent-sms/`, params, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(response => {
            setPopupState({
              show: true,
              message: 'OTP Sent To Client Successful!', 
              page: 'login', 
            });
            console.log(response);
          })
          .catch(error => {
            console.log(error)
          });
      })
      .catch(error => console.error('Error fetching client details:', error));
  };

  const handleInputChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }

    if (newCode.every(char => char !== '')) {
      validateCode(newCode.join(''));
    }
  };

  const validateCode = (enteredCode) => {
    if (enteredCode === generatedCode) {
      navigate(`/client-form/${clientId}`);
    } else {
      setError('Invalid code. Please try again.');
    }
  };

  const abort =() => {
    setPopupState({
      show: true,
      message: 'OPT Process Cancelled', // Custom message
      page: 'login', // Page identifier
    });
    navigate('/agent/main');
  } 

  if (loading) return <InternetLoader/>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    }}>
      <h1>OTP Code</h1>
      <div style={{
        width: "100%",
        margin: "40px 0",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",

      }}>
        
        <div>
          {code.map((char, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={char}
              onChange={(e) => handleInputChange(index, e.target.value)}
              ref={(el) => (inputRefs.current[index] = el)}
              style={{ width: '40px', marginRight: '10px' }}
            />
          ))}
        </div>
        <button
        style={{
          margin: "20px 0",
          outline: "none",
          background: "linear-gradient(#1c7dff, #0051c4)"
        }}
        onClick={() => generateCode()}
        >Generate and Send Code</button>
        <button onClick={() => abort()} >
          Abort Process
        </button>
  
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <img 
      style={{
        scale: "0.5",
      }}
      src={ img } alt="" />
      
    </div>
  );
};

export default CodeValidation;
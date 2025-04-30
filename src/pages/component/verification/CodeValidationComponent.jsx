import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import emailjs from 'emailjs-com';
import axios from 'axios';
import API_URL from '../link';
import { InternetLoader } from '../ui/loading';
import { useContext } from 'react';
import { PopupContext } from '../../../App';
import img from './otp.gif';
import useBell from '../ui/bell';
import useVibrate from '../ui/vibrator';

const CodeValidation = () => {
  const { setPopupState } = useContext(PopupContext);
  const [code, setCode] = useState(['', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const { clientId } = useParams();
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [countdown, setCountdown] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const ring = useBell();
  const vibrate = useVibrate();

  // Countdown effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/get/premium/${clientId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clientId]);

  const generateCode = async () => {
    setIsGenerating(true);
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    setGeneratedCode(randomCode.toString());
    setCountdown(50); // Start 50-second countdown

    try {
      const response = await axios.get(`${API_URL}/get/client/${clientId}`);
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

      // Send email
      // await emailjs.send('service_1zc90u8', 'template_zqpczsv', {
      //   to_name: `${clientName}`,
      //   from_name: "Equity",
      //   message: `${msg}`,
      //   reply_to: 'no-reply@yourcompany.com',
      //   to_client: response.data.email_address,
      //   from_email: "info@equityinsurance.com",
      // }, 'OdwbNHd4lP5RDWUr6');

      
      await axios.post(`${API_URL}/sent-sms/`, {
        number: clientNumber,
        message: msg
      }, {
        headers: { "Content-Type": "application/json" },
      });

      ring()
      setPopupState({
        show: true,
        message: 'OTP Sent To Client Successfully!', 
        page: 'login', 
      });
    } catch (error) {
      console.error('Error:', error);
      vibrate();
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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
      vibrate()
      setError('Invalid code. Please try again.');
    }
  };

  const abort = () => {
    setPopupState({
      show: true,
      message: 'OTP Process Cancelled',
      page: 'login',
    });
    ring();
    navigate('/agent/main');
  };

  if (loading) return <InternetLoader/>;
  

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
        {error && (
          <p style={{
            color: "var(--light)",
            fontWeight: "500",
            fontSize: "1.5em"
          }}>
            Invalid Code, Try Again.
          </p>
        )}


        {countdown > 0 ? (
          <div style={{ margin: '20px 0' }}>
            
            <p>Resend code in: {countdown} seconds</p>
          </div>
        ) : (
          
          <button
            style={{
              margin: "20px 0",
              outline: "none",
              background: "linear-gradient(#1c7dff, #0051c4)",
              opacity: isGenerating ? 0.5 : 1,
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
            onClick={generateCode}
            disabled={isGenerating}
          >
            {isGenerating ? 'Sending...' : 'Generate and Send Code'}
          </button>
        )}

        <button onClick={abort}>
          Abort Process
        </button>
  
        
      </div>

      <img 
        style={{ scale: "0.5" }}
        src={img} 
        alt="OTP Illustration" 
      />
    </div>
  );
};

export default CodeValidation;
import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import emailjs from 'emailjs-com';
import axios from 'axios';
import API_URL from '../link';

const CodeValidation = () => {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const { clientId } = useParams();
  const navigate = useNavigate();
  const inputRefs = useRef([]);


  const generateCode = () => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    setGeneratedCode(randomCode.toString());

    // Fetch client email (mock API call)
    axios.get(`${API_URL}/get/client/${clientId}`)
      .then(response => {
        const clientEmail = response.data.email_address;

        // Send email using EmailJS
        emailjs.send('service_hk1e0x4', 'template_kl5zsnr', {
          to_name: `${response.data.first_name} ${response.data.surname}`,
          from_name: localStorage.getItem('agents_name'),
          message: `Code-${randomCode}`,
          reply_to: 'no-reply@yourcompany.com',
          to_client: clientEmail,
          from_email: "qwabsj@gmail.com",
        }, 'eRTdfNHhE37btGzHH')
        
          .then(() => {
            console.log(`Code - ${randomCode}`)
            console.log('Email sent successfully')
          })
          .catch(error => console.error('Error sending email:', error));
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

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    }}>
      <h1>Code Validation</h1>
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
          outline: "none"
        }}
        onClick={() => generateCode()}
        >Generate and Send Code</button>
  
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      
    </div>
  );
};

export default CodeValidation;
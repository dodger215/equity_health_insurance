import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import styles from './ClientForm.module.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import { InternetLoader } from '../ui/loading';
import { Close } from '../ui/button';

import API_URL from '../link';
import PDFTemplate from './PDFTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import emailjs from 'emailjs-com';
import MobilePayment from '../payments/momo';
import PayPoint from '../payments/paycheck';
import BankPayPoint from '../payments/bank';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { PopupContext } from '../../../App';

const ClientFormComponent = () => {
  const { setPopupState } = useContext(PopupContext)
  const navigate = useNavigate();
  const [activeSections, setActiveSections] = useState({
    stage_1: false,
    stage_2: false,
    stage_3: false,
    stage_4: false,
    stage_5: false,
    stage_6: false,
    stage_7: false,
    
  });

  

  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [activeTab, setActiveTab] = useState('page1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  

  const toggleSection = (section) => {
    setActiveSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [dependants, setDependants] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef();
  const [amount, setAmount] = useState([]);

  console.log(`client id: ${clientId}`);

  // Fetch client details, dependants, and policies
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch client details
        const clientResponse = await axios.get(`${API_URL}/get/client/${clientId}`);
        setClient(clientResponse.data);
        

        // Fetch dependants
        try {
          const dependantsResponse = await axios.get(`${API_URL}/dependants/`);
          setDependants(dependantsResponse.data.filter(d => d.client_id === clientId));
        } catch (dependantsError) {
          if (dependantsError.response?.status === 404) {
            console.log('Dependants endpoint not found. Displaying empty list.');
            setDependants([]); // Set dependants to an empty array
          } else {
            throw dependantsError; // Re-throw other errors
          }
        }

        // Fetch policies
        const policiesResponse = await axios.get(`${API_URL}/client-policies/`);
        setPolicies(policiesResponse.data.filter(p => p.client_id === clientId));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [clientId]);


  

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
        setIsLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const response = await fetch(`${API_URL}/get/premium/${clientId}`);
        if(!response.ok){
          throw new Error("Failed to fetch the amounts");
        }
        const data = await response.json()

        setAmount(data)
        console.log(`Payment: ${data}`)


      }
      catch(error){
        setError(error.message);
      }
      finally{
        setIsLoading(false);
      }
    }
    fetchAmount();
  }, [clientId])



  const deleteClient = async () => {
    try {
      const response = await fetch(`${API_URL}/delete/client/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Client deleted:', data);
      // Add your success handling here
    } catch (error) {
      console.error('Error deleting client:', error);
      // Add your error handling here
    }
  };


  const deleteDependent = async () => {
    try {
      const response = await fetch(`${API_URL}/delete/depentance/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dependent deleted:', data);
    } catch (error) {
      console.error('Error deleting dependent:', error);
    }
  };


  const deletePolicy = async () => {
    try {
      const response = await fetch(`${API_URL}/delete/policy/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Policy deleted:', data);
    } catch (error) {
      console.error('Error deleting policy:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const formData = {
          client_info: { ...client, is_submitted: true },
          dependants: dependants, // Assuming it's an array
          policy: policies[0], // Send only the first policy object
        };
        
        console.log("Data being sent:", formData);
        
        const response = await fetch(`${API_URL}/submit/client/policies/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        
        const result = await response.json();
        console.log("Response:", result);
        

        console.log("Data", formData);

        


        const msg = `
Dear ${formData.client_info.first_name.toUpperCase()} ${client.surname.toUpperCase()},
We are pleased to inform you that your subscription to the ${data?.product.toUpperCase()} has been successfully processed. The payment of ${amount?.total} has been made using your chosen payment method, Monthly.
Should you have any questions or require further details regarding your subscription, please do not hesitate to contact our office. Our team is available to assist you and provide any additional information you may need.
Thank you for choosing our services. We appreciate your trust and look forward to serving you.

Best regards,
Equity Health Insurance
`;


        setPopupState({
          show: true,
          message: 'Form Uploaded Into the Back Office Successful! 🎉', 
          page: 'login', 
        });
        const smsParams = {
          number: client.phone_number,
          message: msg,
        }

        axios.post(`${API_URL}/sent-sms/`, smsParams, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                  .then(response => {
                    console.log(response);
                  })
                  .catch(error => {
                    console.log(error)
                  });
  
        // Send email using EmailJS
        await emailjs.send(
          "service_1zc90u8",
          "template_zqpczsv",
          {
            to_name: `${formData.client_info.first_name} ${formData.client_info.surname}`,
            from_name: "Equity",
            message: `${msg}`,
            reply_to: "no-reply@yourcompany.com",
            to_client: formData.client_info.email_address,
            from_email: "info@equityinsurance.com",
          },
          "OdwbNHd4lP5RDWUr6"
        );
  
        navigate("/agent/main");
        

        deleteClient();
        if(dependants > 0){
          deleteDependent();
        }
        deletePolicy();
      } catch (error) {
        console.error("Error during form submission:", error);
      }
    
  };

  // Handle input changes for client details
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClient(prevClient => ({
      ...prevClient,
      [name]: value,
    }));
  };

  // Handle input changes for dependants
  const handleDependantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDependants = [...dependants];
    updatedDependants[index] = {
      ...updatedDependants[index],
      [name]: value,
    };
    setDependants(updatedDependants);
  };


  


  // Handle input changes for policies
  const handlePolicyChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPolicies = [...policies];
    updatedPolicies[index] = {
      ...updatedPolicies[index],
      [name]: value,
    };
    setPolicies(updatedPolicies);
  };

  // Handle payment
  const handleMakePayment = async () => {
    try {
      // Call the payment API
      const paymentResponse = await axios.post(`${API_URL}/make-payment/`, {
        client_id: clientId,
        amount: 100, // Replace with the actual amount
      });

      alert('Payment successful!');
      console.log('Payment response:', paymentResponse.data);
    } catch (err) {
      console.error('Error making payment:', err);
      setError('Failed to process payment. Please try again.');
    }
  };



  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(`${API_URL}/files/image/${clientId}`);
        
        if (!response.ok) throw new Error('Image not found');
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageUrl(null);
      }
    };
    fetchFile();
  }, [clientId]);

  console.log("Blob image: ", imageUrl);

  

  if (isLoading) return <InternetLoader/>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  

  return (
    <div className={styles.formContainer}>
      {/* Stage 1 - Client Info */}
      <Close />
      <form onSubmit={handleSubmit} className='final-form'>
      <h1>Client Form Submission</h1>
      <div className={styles.collapsibleSection}>
        <div
          className={`${styles.collapsibleHeader} ${activeSections.stage_1 ? styles.active : ''}`}
          onClick={() => toggleSection('stage_1')}
        >
          <span>Client Information</span>
          <FontAwesomeIcon 
            icon={activeSections.stage_1 ? faMinus : faPlus} 
            className={styles.icon}
          />
        </div>
        {activeSections.stage_1 && (
          <div className={styles.collapsibleContent}>
            {/* Client form fields */}
            <h2>Client Details</h2>
            <div className={styles.formGroup}>
              <div className="form-view">
                <label>First Name:</label>
                <input
                  type="text"
                  name="first_name"
                  value={client.first_name || ''}
                  onChange={handleClientChange}
                />
              </div>
              <div className="form-view">
                <label>Surname:</label>
                <input
                  type="text"
                  name="surname"
                  value={client.surname || ''}
                  onChange={handleClientChange}
                />
              </div>

              {/* <div className="form-view">
                <label>Other Name:</label>
                <input
                  type="text"
                  name="other_names"
                  value={client.other_names || ''}
                  onChange={handleClientChange}
                />
              </div> */}

              <div className="form-view">
                <label>gender:</label>
                <input
                  type="text"
                  name="gender"
                  value={client.gender || ''}
                  onChange={handleClientChange}
                />
              </div>

              <div className="form-view">
                <label>Ghana Card No:</label>
                <input
                  type="text"
                  name="national_id_number"
                  value={client.national_id_number || ''}
                  onChange={handleClientChange}
                />
              </div>

              <div className="form-view">
                <label>Id Type:</label>
                <input
                  type="text"
                  name="id_type"
                  value={client.id_type || ''}
                  onChange={handleClientChange}
                />
              </div>

              <div className="form-view">
                <label>Id Number:</label>
                <input
                  type="text"
                  name="id_number"
                  value={client.id_number || ''}
                  onChange={handleClientChange}
                />
              </div>

              <div className="form-view">
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phone_number"
                  value={client.phone_number || ''}
                  onChange={handleClientChange}
                />
              </div>

              <div className="form-view">
                <label>Email Address:</label>
                <input
                  type="text"
                  name="email_address"
                  value={client.email_address || ''}
                  onChange={handleClientChange}
                />
              </div>

              <div className="form-view">
                <label>Nationality:</label>
                <input
                  type="text"
                  name="nationality"
                  value={client.nationality || ''}
                  onChange={handleClientChange}
                />
              </div>

              <div className="form-view">
                <label>Residential Address:</label>
                <input
                  type="text"
                  name="residential_address"
                  value={client.residential_address || ''}
                  onChange={handleClientChange}
                />
              </div>

              <div className="form-view">
                <label>City Town:</label>
                <input
                  type="text"
                  name="city_town"
                  value={client.city_town || ''}
                  onChange={handleClientChange}
                />
              </div>
              <div className="form-view">
                <label>Country:</label>
                <input
                  type="text"
                  name="country"
                  value={client.country || ''}
                  onChange={handleClientChange}
                />
              </div>
              <div className="form-view">
                <label>Occupation:</label>
                <input
                  type="text"
                  name="occupation"
                  value={client.occupation || ''}
                  onChange={handleClientChange}
                />
              </div>
            </div>
            {/* Add more fields */}
          </div>
        )}
      </div>

      {/* Stage 2 - Policies */}
      <div className={styles.collapsibleSection}>
        <div
          className={`${styles.collapsibleHeader} ${activeSections.stage_2 ? styles.active : ''}`}
          onClick={() => toggleSection('stage_2')}
        >
          <span>Dependance</span>
          <FontAwesomeIcon 
            icon={activeSections.stage_2 ? faMinus : faPlus} 
            className={styles.icon}
          />
        </div>
        {activeSections.stage_2 && (
          <div className={styles.collapsibleContent}>
            <div className="formGroup">
              <h2>Dependants</h2>
              {dependants.length > 0 ? (
                dependants.map((dependant, index) => (
                  <div key={dependant.id}>
                    <div className="form-view">
                    <label>Full Name:</label>
                      <input
                        type="text"
                        name="full_name"
                        value={dependant.full_name || ''}
                        onChange={(e) => handleDependantChange(index, e)}
                      />
                    </div>
                    <div className="form-view">
                      <label>Date of Birth:</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={dependant.date_of_birth || ''}
                        onChange={(e) => handleDependantChange(index, e)}
                      />
                    </div>
                    
                    <div className="form-view">
                      <label>Relation Type:</label>
                      <input
                        type="text"
                        name="relation_type"
                        value={dependant.relation_type || ''}
                        onChange={(e) => handleDependantChange(index, e)}
                      />
                    </div>
                    
                  </div>
                ))
              ) : (
                <p>No dependants found.</p>
              )}
            </div>
            {/* Policy form fields */}
          </div>
        )}
      </div>

      {/* Stage 3 - Dependents */}
      <div className={styles.collapsibleSection}>
        <div
          className={`${styles.collapsibleHeader} ${activeSections.stage_3 ? styles.active : ''}`}
          onClick={() => toggleSection('stage_3')}
        >
          <span>Policies</span>
          <FontAwesomeIcon 
            icon={activeSections.stage_3 ? faMinus : faPlus} 
            className={styles.icon}
          />
        </div>
        {activeSections.stage_3 && (
          <div className={styles.collapsibleContent}>
            {/* Dependent form fields */}
            <div className="formGroup">
              <h2>Policies</h2>
              {policies.map((policy, index) => (
                <div key={policy.id}>
                  <div className="form-view">
                  <label>Product Name:</label>
                  <input
                    type="text"
                    name="product_name"
                    value={policy.product_name.toUpperCase() || ''}
                    onChange={(e) => handlePolicyChange(index, e)}
                  />
                </div>
                
                <div className="form-view">
                <label>Product Code:</label>
                <input
                  type="text"
                  name="product_code"
                  value={policy.product_code || ''}
                  onChange={(e) => handlePolicyChange(index, e)}
                />
                </div>
                
              </div>
            ))}
            </div>
          </div>
        )}
      </div>

      

      
      <div className={styles.collapsibleSection}>
        <div
          className={`${styles.collapsibleHeader} ${activeSections.stage_6 ? styles.active : ''}`}
          onClick={() => toggleSection('stage_6')}
        >
          <span>Payment Mode </span>
          <FontAwesomeIcon 
            icon={activeSections.stage_6 ? faMinus : faPlus} 
            className={styles.icon}
          />
        </div>
        {activeSections.stage_6 && (
          <div className={styles.collapsibleContent}>
            <div>
            <div className={styles.tabContainer}>
                <div
                  className={activeTab === 'page1' ? styles.activeTab : styles.tab}
                  onClick={() => handleTabClick('page1')}
                >
                  Momo
                </div>
                <div
                  className={activeTab === 'page2' ? styles.activeTab : styles.tab}
                  onClick={() => handleTabClick('page2')}
                >
                  PayPoint
                </div>
                <div
                  className={activeTab === 'page3' ? styles.activeTab : styles.tab}
                  onClick={() => handleTabClick('page3')}
                >
                  Bank
                </div>
              </div>
              <div className={styles.iframe}>
                <div style={{
                  margin: "20px 0",
                  fontWeight: 800,
                  fontSize: "1rem"
                }}>Premium amount: {amount.total}</div>
                {activeTab === 'page1' && <MobilePayment amount={amount.total}/>}
                {activeTab === 'page2' && <PayPoint amount={amount.total}/>}
                {activeTab === 'page3' && <BankPayPoint amount={amount.total}/>}
              </div>
          </div>
          </div>
        )}
      </div>

      {/* Signature Section */}
      <div className={styles.collapsibleSection}>
        <div
          className={`${styles.collapsibleHeader} ${activeSections.stage_4 ? styles.active : ''}`}
          onClick={() => toggleSection('stage_4')}
        >
          <span>Signature</span>
          <FontAwesomeIcon 
            icon={activeSections.stage_4 ? faMinus : faPlus} 
            className={styles.icon}
          />
        </div>
        {activeSections.stage_4 && (
          <div className={styles.collapsibleContent}>
            {/* Signature component */}
            <div className="sign">
              <h2>Signature</h2>
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'signature-canvas',
                }}
              />
              <button type="button" onClick={() => signatureRef.current.clear()}>
                Clear Signature
              </button>
              <input type="file" accept='image/png' />
            </div>
          </div>
        )}
      </div>


      <div className={styles.collapsibleSection}>
        <div
          className={`${styles.collapsibleHeader} ${activeSections.stage_7 ? styles.active : ''}`}
          onClick={() => toggleSection('stage_7')}
        >
          <span>National ID Image</span>
          <FontAwesomeIcon 
            icon={activeSections.stage_7 ? faMinus : faPlus} 
            className={styles.icon}
          />
        </div>


        {activeSections.stage_7 && (
          <div className={styles.collapsibleContent}>
            {/* Image component */}

            {imageUrl && (
              <div>
                <h3>Image Preview:</h3>
                <img src={imageUrl} alt="Fetched File" style={{ maxWidth: "300px", borderRadius: "8px" }} />
              </div>
            )}
            
          </div>
        )}
      </div>


      <button type="submit">Submit Form</button>

      <div style={{
        opacity: "0%",
      }}>
      <div className={styles.collapsibleSection}>
        <div
          className={`${styles.collapsibleHeader} ${activeSections.stage_5 ? styles.active : ''}`}
          onClick={() => toggleSection('stage_5')}
        >
          <span>PDF</span>
          <FontAwesomeIcon 
            icon={activeSections.stage_5 ? faMinus : faPlus} 
            className={styles.icon}
          />
        </div>
        
        {activeSections.stage_5 && (
          <div className={styles.collapsibleContent}>
            <PDFTemplate client={client} dependants={dependants} policies={policies} />
          </div>
        )}
      </div>
      </div>
      </form>
    </div>
  );
};




export default ClientFormComponent;
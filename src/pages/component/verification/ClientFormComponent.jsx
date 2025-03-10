import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import styles from './ClientForm.module.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import { InternetLoader } from '../ui/loading';
import { Close } from '../ui/button';
import MobilePayment from './MobilePayment';
import PayPoint from './PayPoint';
import API_URL from '../link';

const ClientFormComponent = () => {
  const [activeSections, setActiveSections] = useState({
    stage_1: false,
    stage_2: false,
    stage_3: false,
    stage_4: false,
    stage_5: false,
    stage_6: false,
    
  });

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



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update the client object to set is_submitted to true
      const updatedClient = { ...client, is_submitted: true };

      // Submit the form data to a different API
      const formData = {
        client: updatedClient,
        dependants,
        policies,
        signature: signatureRef.current.toDataURL(), // Capture the signature as a data URL
      };

      await axios.post(`${API_URL}/submit-form/`, formData);

      alert('Form submitted successfully!');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again.');
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
          <span>Stage 1 - Client Information</span>
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

              <div className="form-view">
                <label>Other Name:</label>
                <input
                  type="text"
                  name="other_names"
                  value={client.other_names || ''}
                  onChange={handleClientChange}
                />
              </div>

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
          <span>Stage 2 - Dependance</span>
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
          <span>Stage 3 - Policies</span>
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
                    value={policy.product_name || ''}
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

      {/* Signature Section */}
      <div className={styles.collapsibleSection}>
        <div
          className={`${styles.collapsibleHeader} ${activeSections.stage_4 ? styles.active : ''}`}
          onClick={() => toggleSection('stage_4')}
        >
          <span>Stage 4 - Signature</span>
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
            </div>
          </div>
        )}
      </div>

      <div className={styles.collapsibleSection}>
        <div
          className={`${styles.collapsibleHeader} ${activeSections.stage_5 ? styles.active : ''}`}
          onClick={() => toggleSection('stage_5')}
        >
          <span>Stage 5 - Payment Mode - Momo</span>
          <FontAwesomeIcon 
            icon={activeSections.stage_5 ? faMinus : faPlus} 
            className={styles.icon}
          />
        </div>
        {activeSections.stage_5 && (
          <div className={styles.collapsibleContent}>
            <MobilePayment />
          </div>
        )}
      </div>
       <h1>OR</h1> 
      <div className={styles.collapsibleSection}>
        <div
          className={`${styles.collapsibleHeader} ${activeSections.stage_6 ? styles.active : ''}`}
          onClick={() => toggleSection('stage_6')}
        >
          <span>Stage 5 - Payment Mode - Pay Check </span>
          <FontAwesomeIcon 
            icon={activeSections.stage_6 ? faMinus : faPlus} 
            className={styles.icon}
          />
        </div>
        {activeSections.stage_6 && (
          <div className={styles.collapsibleContent}>
            <PayPoint />
          </div>
        )}
      </div>
      <button type="submit">Submit Form</button>
      </form>
    </div>
  );
};

export default ClientFormComponent;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ClientForm.module.css'; 

const ClientForm = ({ clientId }) => {
  const [clientData, setClientData] = useState({
    first_name: '',
    surname: '',
    other_names: '',
    date_of_birth: '',
    gender: '',
    id_type: '',
    id_number: '',
    phone_number: '',
    email_address: '',
    nationality: '',
    residential_address: '',
    city_town: '',
    country: '',
  });

  const [policies, setPolicies] = useState([]); 
  const [signature, setSignature] = useState(null);

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/get/clients/${clientId}`);
        const data = response.data;
        setClientData({
          first_name: data.first_name || '',
          surname: data.surname || '',
          other_names: data.other_names || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          id_type: data.id_type || '',
          id_number: data.national_id_number || '',
          phone_number: data.phone_number || '',
          email_address: data.email_address || '',
          nationality: data.nationality || '',
          residential_address: data.residential_address || '',
          city_town: data.city_town || '',
          country: data.country || '',
        });
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClientData();
  }, [clientId]);

  // Fetch policies (dependants)
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/client-policies/');
        const policiesData = response.data.filter(policy => policy.client_id === clientId); // Filter policies for this client
        setPolicies(policiesData);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    fetchPolicies();
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSignature(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in clientData) {
      formDataToSend.append(key, clientData[key]);
    }

    // Append policies (dependants)
    policies.forEach((policy, index) => {
      formDataToSend.append(`policies[${index}][policy_id]`, policy.policy_id);
      formDataToSend.append(`policies[${index}][product_name]`, policy.product_name);
      formDataToSend.append(`policies[${index}][product_code]`, policy.product_code);
    });

    // Append signature file
    if (signature) {
      formDataToSend.append('signature', signature);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/submit-endpoint', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Form submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit Client Information</h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Personal Information</legend>
          <input type="text" name="first_name" placeholder="First Name" value={clientData.first_name} onChange={handleChange} required className={styles.input} />
          <input type="text" name="surname" placeholder="Surname" value={clientData.surname} onChange={handleChange} required className={styles.input} />
          <input type="text" name="other_names" placeholder="Other Names" value={clientData.other_names} onChange={handleChange} className={styles.input} />
          <input type="date" name="date_of_birth" value={clientData.date_of_birth} onChange={handleChange} required className={styles.input} />
          <select name="gender" value={clientData.gender} onChange={handleChange} required className={styles.input}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" name="id_type" placeholder="ID Type" value={clientData.id_type} onChange={handleChange} required className={styles.input} />
          <input type="text" name="id_number" placeholder="ID Number" value={clientData.id_number} onChange={handleChange} required className={styles.input} />
        </fieldset>

        {/* Contact Information */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Contact Information</legend>
          <input type="tel" name="phone_number" placeholder="Phone Number" value={clientData.phone_number} onChange={handleChange} required className={styles.input} />
          <input type="email" name="email_address" placeholder="Email Address" value={clientData.email_address} onChange={handleChange} className={styles.input} />
          <input type="text" name="nationality" placeholder="Nationality" value={clientData.nationality} onChange={handleChange} className={styles.input} />
          <input type="text" name="residential_address" placeholder="Residential Address" value={clientData.residential_address} onChange={handleChange} className={styles.input} />
          <input type="text" name="city_town" placeholder="City/Town" value={clientData.city_town} onChange={handleChange} className={styles.input} />
          <input type="text" name="country" placeholder="Country" value={clientData.country} onChange={handleChange} className={styles.input} />
        </fieldset>

        {/* Policies (Dependants) */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Policies</legend>
          <div id="policies-container">
            {policies.map((policy, index) => (
              <div className={styles.dependant} key={index}>
                <input type="text" name="policy_id" placeholder="Policy ID" value={policy.policy_id} readOnly className={styles.input} />
                <input type="text" name="product_name" placeholder="Product Name" value={policy.product_name} readOnly className={styles.input} />
                <input type="text" name="product_code" placeholder="Product Code" value={policy.product_code} readOnly className={styles.input} />
              </div>
            ))}
          </div>
        </fieldset>

        {/* Signature Upload */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Signature</legend>
          <input type="file" name="signature" accept="image/*" onChange={handleFileChange} required className={styles.input} />
        </fieldset>

        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
};

export default ClientForm;
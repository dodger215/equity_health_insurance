import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import styles from './ClientForm.module.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import { InternetLoader } from '../ui/loading';
import { Close } from '../ui/button';
import ImageUploadForm from '../forms/form-image';
import { bankData } from '../payments/bankData';

import API_URL from '../link';
import MobilePayment from '../payments/momo';
import PayPoint from '../payments/paycheck';
import BankPayPoint from '../payments/bank';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { PopupContext } from '../../../App';
import SignatureComponent from './Signature';

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
    stage_8: false,
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
  const [loading, setLoading] = useState(false)
  const [clientPolicies, setClientPolicies] = useState([]);
  const [products, setProducts] = useState([]);


  // State for form inputs and selections

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPayment, setSelectedPayment] = useState("");
    const [staffId, setStaffId] = useState("");
    const [staffName, setStaffName] = useState("");
    const [institutionName, setInstitutionName] = useState("");
  
    const [staffIdError, setStaffIdError] = useState("");
    
  
    // Payment options data
    const paymentOptions = [
      { id: 1, name: "CONTROLLER", icon: "🔄" },
      { id: 2, name: "ECG", icon: "⚡" },
      { id: 3, name: "GHANA WATER", icon: "💧" },
      { id: 4, name: "GHANA PAY", icon: "🇬🇭" },
      { id: 5, name: "BANK TRANSFER", icon: "🏦" },
      { id: 6, name: "GHANA HEALTH SERVICE", icon: "🏥" },
    ];
  
    // Filtered payment options based on search term
    const filteredPayments = paymentOptions.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Handle search input change
    




  // bank Pay Check
  
  const [selectedBank, setSelectedBank] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({
    accountName: "",
    accountNumber: "",
    bankBranch: "",
    amount: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);


  const bankOptions = Object.keys(bankData).map(bankName => ({
    id: bankName.toLowerCase().replace(/\s+/g, '-'),
    name: bankName,
    icon: "🏦"
  }));

  // Filtered bank options based on search term
  const filteredBanks = bankOptions.filter((bank) =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get branches for selected bank
  const bankBranches = selectedBank ? bankData[selectedBank] || [] : [];

  // Form validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      accountName: "",
      accountNumber: "",
      bankBranch: "",
    };

    if (!accountName.trim()) {
      newErrors.accountName = "Please enter account name";
      isValid = false;
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Please enter account number";
      isValid = false;
    } else if (!/^\d+$/.test(accountNumber)) {
      newErrors.accountNumber = "Account number should contain only digits";
      isValid = false;
    }

    if (!bankBranch) {
      newErrors.bankBranch = "Please select a bank branch";
      isValid = false;
    }

  

  

    setErrors(newErrors);
    return isValid;
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/show/product/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  // Handle bank selection
  const handleBankSelect = (bank) => {
    setSelectedBank(bank.name);
    setBankBranch("");
    setSearchTerm(bank.name);
    setShowBranchDropdown(true);
    setErrors({ ...errors, bankBranch: "" });
  };

  // Handle branch selection
  const handleBranchSelect = (branch) => {
    setBankBranch(branch);
    setShowBranchDropdown(false);
    setErrors({ ...errors, bankBranch: "" });
  };

  
  const handleBankSubmit = async (policyId, clientId, amounts, underAgent) => {
    

    setIsProcessing(true);
    setSuccessMessage("");
    setErrorMessage("");

    

    try {
      const payload = {
        bank_name: selectedBank,
        bank_account_number: accountNumber,
        branch: bankBranch,
        account_name: accountName,
        policy_id: parseInt(policyId),
        client_id: parseInt(clientId),
        under_agent: parseInt(underAgent),
        amount: amounts,
      };

      console.log("Bank Details Param: ", payload);

      const response = await axios.post(`${API_URL}/bank-deductions/`, payload);
      
      setSuccessMessage("Bank deduction created successfully!");
      
      setShowBranchDropdown(false);
    } catch (error) {
      console.error("Error creating bank deduction:", error);
      setErrorMessage(error.response?.data?.detail || "Failed to create bank deduction");
    } finally {
      setIsProcessing(false);
    }
  };


  // Controller

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle payment option selection
  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment.name);
    setSearchTerm(payment.name);
    setInstitutionName(payment.name); 
  };

  const handleStaffIdChange = (e) => {
    setStaffId(e.target.value);
    setStaffIdError("");
  };

  // Handle Staff Name input change
  const handleStaffNameChange = (e) => {
    setStaffName(e.target.value);
  };

  // Validate form inputs
  const controllerValidateForm = () => {
    if (!staffId.trim()) {
      setStaffIdError("Please enter a Staff ID");
      return false;
    }
    if (!staffName.trim()) {
      setStaffIdError("Please enter Staff Name");
      return false;
    }
    if (!selectedPayment) {
      setStaffIdError("Please select a payment option");
      return false;
    }
    return true;
  };
  
  // Handle Pay button click
  const handlePayClick = async (policyId, clientId, amounts, underAgent) => {
    if (!controllerValidateForm()) return;
    
    setIsProcessing(true);
    
    try {
      const payload = {
        staff_id: staffId,  // Don't need toString() if already string
        staff_name: staffName,
        institution_name: institutionName,
        amount: Number(amounts),  // Use Number instead of parseInt
        policy_id: policyId,  // Use as-is if API accepts this format
        client_id: clientId,
        under_agent: underAgent.toString()  // Only convert if needed
      };

    const tryLoad = {
      "staff_id": staffId,
      "staff_name": staffName,
      "institution_name": institutionName,
      "amount": Number(amounts),
      "policy_id": policyId,
      "client_id": clientId,
      "under_agent": underAgent.toString()
    };
  
      console.log("Controller Data:", payload);
      
      const response = await fetch(`${API_URL}/deductions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tryLoad),        
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        // This will catch 422 errors and show the server's validation messages
        throw new Error(result.detail || JSON.stringify(result));
      }
  
      console.log("Successful", result);
      setIsProcessing(false);
      setSuccessMessage("Payment processed successfully!");
      return result;
  
    } catch (error) {
      setIsProcessing(false);
      setErrorMessage(error.message);
      console.error("Deduction error:", error);
      throw error;  
    }
  };

 


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
      
    } catch (error) {
      console.error('Error deleting client:', error);
      
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

  const handlePayment = async (policyId, clientId, amount, underAgent) => {
    if (activeTab === 'page3') {
      return handleBankSubmit(policyId, clientId, amount, underAgent);
    }
    if (activeTab === 'page2') {
      return handlePayClick(policyId, clientId, amount, underAgent);
    }
    // Momo handling if needed
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
      try {

        const clients = {
          ...client, is_submitted: true
        }
        const today = new Date();
        const start_date = new Date().toISOString().split('T')[0];
        const matchedPolicy = policies.find(p => p.client_id === clientId);

        const productName = String(products?.Name || '').toUpperCase();
        const policyProductName = String(matchedPolicy?.product_name || '').toUpperCase();

        const isProductMatch = productName === policyProductName;

      
        const totalFloat = parseFloat(amount.total.replace(/[^\d.]/g, ''));
        const validDependants = dependants.filter(
          d => d.full_name && d.date_of_birth && d.relation_type
        );


        console.log(clients)
        const formData = {
          agent_id: localStorage.getItem("id"),
          branch_id: 1,
          client_info: {
            FirstName: clients.first_name,
            LastName: clients.surname,
            OtherNames: clients.other_names || "",
            Gender: clients.gender,
            DateOfBirth: clients.date_of_birth,
            PhoneNumber: clients.phone_number,
            Email: clients.email_address,
            NationalIDNumber: clients?.national_id_number?.trim() || clients.id_number,
            ResidentialAddress: clients.residential_address,
            City: clients.city_town,
            CountryCode: "GH",
            Occupation: clients.occupation
          },
          policy: {
            product_id: isProductMatch ? String(products.ProductID) : '',
            product_name: matchedPolicy?.product_name,
            product_code: isProductMatch ? products.ProductCode : '',
            sum_assured: Number(amount.sum_assured),
            premium: totalFloat,
            term: 1,
            start_date: start_date,
            },
            ...(validDependants.length > 0 && { dependants: validDependants })
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

        setClientPolicies(result);

        
        // await handleBankSubmit(
        //   result.policy_id, 
        //   result.client_id, 
        //   totalFloat, 
        //   localStorage.getItem("id")
        // );

        // if(activeTab === "page3"){
        //   await handleBankSubmit(
        //     result.policy_id, 
        //     result.client_id, 
        //     totalFloat, 
        //     localStorage.getItem("id")
        //   );
        // }
        // if(activeTab === "page2"){
        //   await handlePayClick(
        //     result.policy_id, 
        //     result.client_id, 
        //     totalFloat, 
        //     localStorage.getItem("id")
        //   );
        // }
        

        if (activeTab === 'page3') {
          handleBankSubmit(
            result.policy_id, 
            result.client_id, 
            totalFloat, 
            localStorage.getItem("id")
          );
        }
        if (activeTab === 'page2') {
          handlePayClick(
            result.policy_number, 
            result.cli_id, 
            totalFloat, 
            localStorage.getItem("id")
          );
        }
        
        

        


        const msg = `
Dear ${formData.client_info.FirstName.toUpperCase()} ${client.surname.toUpperCase()},
We are pleased to inform you that your subscription to the ${data?.product.toUpperCase()} has been successfully processed. The payment of ${amount?.total} has been made using your chosen payment method, Monthly.
Should you have any questions or require further details regarding your subscription, please do not hesitate to contact our office. Our team is available to assist you and provide any additional information you may need.
Thank you for choosing our services. We appreciate your trust and look forward to serving you.

Best regards,
Equity Health Insurance
`;

  
        

        setTimeout(async () => {
          await deleteClient();
        
          if (dependants > 0) {
            await deleteDependent();
          }
        
          await deletePolicy();
        
          navigate("/agent/main");
        }, 1000);

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
        
      } catch (error) {
        console.error("Error during form submission:", error);
      }
      finally{
        setLoading(false)
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
                
                {/* <div className="form-view">
                <label>Product Code:</label>
                <input
                  type="text"
                  name="product_code"
                  value={policy.product_code || ''}
                  onChange={(e) => handlePolicyChange(index, e)}
                />
                </div> */}
                
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
                {activeTab === 'page2' && 
                  <div className="payment-container">
                  <div className="payment-header">
                    <h1>Pay Point</h1>
                  </div>
                    <div className="form-group">
                      <h5>Payment Details</h5>
            
                      <div className="payment-options">
                        <h3 className="section-title">Payment Options</h3>
            
                        {/* Search Field */}
                        <div className="search-container">
                          <span className="search-icon"></span>
                          <input
                            type="text"
                            className="search-field"
                            placeholder="Search payment options..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                          />
                        </div>
            
                        <div className="dropdown-container">
                          <ul className="auto-generated-list" id="paymentList">
                            {filteredPayments.length > 0 ? (
                              filteredPayments.map((payment) => (
                                <li key={payment.id}>
                                  <div
                                    className={`payment-link ${
                                      selectedPayment === payment.name ? "selected" : ""
                                    }`}
                                    onClick={() => handlePaymentSelect(payment)}
                                  >
                                    <span className="link-icon">{payment.icon}</span>
                                    {payment.name}
                                    <button
                                      type="button"
                                      className={`badge ${
                                        isProcessing && selectedPayment === payment.name
                                          ? "processing"
                                          : ""
                                      }`}
                                      onClick={() => handlePayClick(payment)}
                                    >
                                      <span className="badge-text">Select</span>
                                      <span className="badge-dots"></span>
                                    </button>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <div className="no-results" id="noResults">
                                No payment options found
                              </div>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
            
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="staffId">Staff ID</label>
                        <input
                          type="text"
                          id="staffId"
                          placeholder="Enter Staff ID"
                          value={staffId}
                          onChange={handleStaffIdChange}
                          required
                        />
                        {staffIdError && (
                          <div className="error-message" id="staffIdError">
                            {staffIdError}
                          </div>
                        )}
                      </div>
            
                      <div className="form-group">
                        <label htmlFor="staffName">Staff Name</label>
                        <input
                          type="text"
                          id="staffName"
                          placeholder="Enter Staff Name"
                          value={staffName}
                          onChange={handleStaffNameChange}
                          required
                        />
                      </div>
                    </div>
            
                    <input type="hidden" id="selectedPayment" value={selectedPayment} />
                  
                </div>
                
                }
                {activeTab === 'page3' && 
                  <div className="bank-main-container">
                    <div className="payment-container" style={{
                      height: "90vh",
                      overflowY: "auto",
                      width: "100%",
                    }}>
                      <div className="payment-header">
                        <h1>Bank Paypoint</h1>
                      </div>

                      {successMessage && (
                        <div className="alert alert-success">
                          {successMessage}
                        </div>
                      )}

                      {errorMessage && (
                        <div className="alert alert-error">
                          {errorMessage}
                        </div>
                      )}
                      

                        {/* Rest of the bank form fields */}
                        <div className="form-group">
                          <h5>Payment Details</h5>
                          <div className="payment-options">
                            <h3 className="section-title">Bank</h3>

                            <div className="search-container">
                              <span className="search-icon"></span>
                              <input
                                type="text"
                                className="search-field"
                                placeholder="Search Bank options..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>

                            <div className="dropdown-container">
                              <ul className="auto-generated-list" id="paymentList">
                                {filteredBanks.length > 0 ? (
                                  filteredBanks.map((bank) => (
                                    <li key={bank.id}>
                                      <div
                                        className={`payment-link ${
                                          selectedBank === bank.name ? "selected" : ""
                                        }`}
                                        onClick={() => handleBankSelect(bank)}
                                      >
                                        <span className="link-icon">{bank.icon}</span>
                                        {bank.name}
                                      </div>
                                    </li>
                                  ))
                                ) : (
                                  <div className="no-results" id="noResults">
                                    No payment options found
                                  </div>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {selectedBank && (
                          <div className="form-group full-width">
                            <label htmlFor="bankBranch">Bank Branch</label>
                            <input
                              id="bankBranch"
                              placeholder="Select branch"
                              value={bankBranch}
                              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                              readOnly
                              className="read-only-input"
                            />
                            {showBranchDropdown && (
                              <ul className="branch-dropdown" style={{
                                maxHeight: "50vh",
                                overflowY: "scroll",
                              }}>
                                {bankBranches.map((branch, index) => (
                                  <li className="list-details" style={{
                                    textDecoration: "none",
                                  }} key={index} onClick={() => handleBranchSelect(branch)}>
                                    {branch}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {errors.bankBranch && (
                              <div className="error-message">{errors.bankBranch}</div>
                            )}
                          </div>
                        )}

                        <div className="form-group full-width">
                          <label htmlFor="accountName">Account Name</label>
                          <input
                            type="text"
                            id="accountName"
                            placeholder="Account Name"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            required
                          />
                          {errors.accountName && (
                            <div className="error-message">{errors.accountName}</div>
                          )}
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="accountNumber">Account Number</label>
                          <input
                            type="text"
                            id="accountNumber"
                            placeholder="Enter Acct number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            required
                          />
                          {errors.accountNumber && (
                            <div className="error-message">{errors.accountNumber}</div>
                          )}
                        </div>

                        
                    
                    </div>
                  </div>
                }
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
            
            <SignatureComponent style={{
              scale: "0.5",
            }}/>
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
            <ImageUploadForm/>
          </div>
        )}
      </div>


      <button type="submit" className="btn btn-primary">
        {loading ? 'Submitting...' : 'Submit Form'}
      </button>

      
      </form>
    </div>
  );
};




export default ClientFormComponent;
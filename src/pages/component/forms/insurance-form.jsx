"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from "./insurance-form.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faMinus, faCalendar } from "@fortawesome/free-solid-svg-icons"
import { premiums } from "../calculator/abs/premiums"
import { Close, Forms } from "../ui/button"
import axios from 'axios';
import API_URL from '../link';

export default function InsuranceForm() {
  const navigate = useNavigate()

  const token = localStorage.getItem("jwtToken")
  const agentId = localStorage.getItem("id")
  const branch = "1"

  const id = localStorage.getItem("prospect_id")
  console.log(`Prospects id: ${id}`)
  

  const generateClientCode = () => {
    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD format
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `CLI_${currentDate}_${randomNumber}`;
  }
  // const generateProductCode = () => {
  //   const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD format
  //   const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  //   return `PUD_${currentDate}_${randomNumber}`;
  // }

  const [prospect, setProspect] = useState({
    BranchID: 0,
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    DateOfBirth: '',
    Address: '',
    Source: '',
    Stage: '',
    Status: '',
    Notes: ''
  });

  const clientid = generateClientCode()
  

  const [firstName, setFirstName] = useState("")
  const [otherName, setOtherName] = useState("")
  const [surname, setSurname] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDOB] = useState("")
  const [gender, setGender] = useState("")

  const [nationalNumber, setNationalNumber] = useState("")

  const [idType, setIdType] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [occupation, setOccupation] = useState("")

  const [abs, setABS] = useState(false)
  const [daakye, setDaakye] = useState(false)
  const [ebusua, setEbusua] = useState(false)
  const [telemed, setTele] = useState(false)
  const [micro, setMicro] = useState(false)


  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    }
  };

  
  const [phonenumber, setPhonenumber] = useState("")
  const [city, setCity] = useState("")
  const [email, setEmail] = useState("")
  const [nationality, setNationality] = useState("")
  const [country, setCountry] = useState("")
  const [address, setAddress] = useState("")

  const [dependent_dob, setDependentDOB] = useState("")
  const [dependent_name, setDependentName] = useState("")
  const [dependent_rel, setDependentRel] = useState("")

  


  // State for form values
  const [microPlan, setMicroPlan] = useState("")
  const [microFrequency, setMicroFrequency] = useState("")
  const [microPremium, setMicroPremium] = useState("GHS 0.00")

  const [absPlan, setAbsPlan] = useState("")
  const [absType, setAbsType] = useState("")
  const [absFrequency, setAbsFrequency] = useState("")
  const [absPremium, setAbsPremium] = useState("GHS 0.00")
  const [absHospital, setAbsHospital] = useState("GHS 0.00")
  const [absQuarterlyPharmacy, setAbsQuarterlyPharmacy] = useState("GHS 0.00")
  const [absAnnualPharmacy, setAbsAnnualPharmacy] = useState("GHS 0.00")
  const [absScreening, setAbsScreening] = useState("GHS 0.00")

  const [daakyeCalculationType, setDaakyeCalculationType] = useState("sumAssured")
  const [daakyeYears, setDaakyeYears] = useState("")
  const [daakyeSumAssured, setDaakyeSumAssured] = useState(10000)
  const [daakyeMonthlyPremium, setDaakyeMonthlyPremium] = useState("0.00")
  const [daakyeAnnualPremium, setDaakyeAnnualPremium] = useState("0.00")
  const [daakyeYearsPremium, setDaakyeYearsPremium] = useState("")
  const [daakyeEnteredPremium, setDaakyeEnteredPremium] = useState(290)
  const [daakyeCalculatedSumAssured, setDaakyeCalculatedSumAssured] = useState("0.00")

  const [teleSubscription, setTeleSubscription] = useState("")
  const [telePremium, setTelePremium] = useState("GHC 0.00")

  const [ebusuaPlan, setEbusuaPlan] = useState("")
  const [ebusuaLevel, setEbusuaLevel] = useState("")
  const [ebusuaLives, setEbusuaLives] = useState("")
  const [ebusuaPremium, setEbusuaPremium] = useState("GHS 0.00")
  const [ebusuaBeneficiaries, setEbusuaBeneficiaries] = useState([])


  const [selectedPolicy, setSelectedPolicy] = useState("");

  // State for collapsible sections
  const [activeSections, setActiveSections] = useState({
    micro: false,
    abs: false,
    daakye: false,
    telemedicine: false,
    ebusua: false,
  })

  // Premium calculation data
  const microPremiums = {
    "Micro 1": { monthly: 52, quarterly: 156, "half-yearly": 312, annually: 624 },
    "Micro 2": { monthly: 88, quarterly: 264, "half-yearly": 528, annually: 1056 },
    "Micro 3": { monthly: 122, quarterly: 366, "half-yearly": 732, annually: 1464 },
  }

  const absPremiums = {
    ABS1: {
      adult: { monthly: 23, quarterly: 69, "half-yearly": 138, annually: 276 },
      child: { monthly: 11.5, quarterly: 34.5, "half-yearly": 69, annually: 138 },
      hospital: 50,
      quarterlyPharmacy: 25,
      annualPharmacy: 100,
      screening: 100,
    },
    ABS2: {
      adult: { monthly: 33, quarterly: 99, "half-yearly": 198, annually: 396 },
      child: { monthly: 16.5, quarterly: 49.5, "half-yearly": 99, annually: 198 },
      hospital: 75,
      quarterlyPharmacy: 37.5,
      annualPharmacy: 150,
      screening: 150,
    },
    ABS3: {
      adult: { monthly: 41, quarterly: 123, "half-yearly": 246, annually: 492 },
      child: { monthly: 20.5, quarterly: 61.5, "half-yearly": 123, annually: 246 },
      hospital: 100,
      quarterlyPharmacy: 50,
      annualPharmacy: 200,
      screening: 200,
    },
  }

  const daakyePremiumRates = {
    5: { rate: 0.34397 },
    6: { rate: 0.31897 },
    7: { rate: 0.29397 },
    8: { rate: 0.26897 },
    9: { rate: 0.24397 },
    10: { rate: 0.21897 },
  }

  const ebusuaPremiums = {
    Shea: {
      1: { M: 1875.72, "M+1": 3620.14, "M+2": 5345.8, "M+3": 6940.16, "M+4": 8440.74, "M+5": 10128.89 },
      2: { M: 2355.72, "M+1": 4546.54, "M+2": 6713.8, "M+3": 8716.16, "M+4": 10600.74, "M+5": 12720.89 },
      3: { M: 2595.72, "M+1": 5009.74, "M+2": 7397.8, "M+3": 9604.16, "M+4": 11680.74, "M+5": 14016.89 },
      4: { M: 3795.72, "M+1": 7325.74, "M+2": 10817.8, "M+3": 14044.16, "M+4": 17080.74, "M+5": 20496.89 },
    },
    Oak: {
      1: { M: 2397.96, "M+1": 4628.06, "M+2": 6834.19, "M+3": 8872.45, "M+4": 10790.82, "M+5": 12948.98 },
      2: { M: 2997.96, "M+1": 5786.06, "M+2": 8544.19, "M+3": 11092.45, "M+4": 13490.82, "M+5": 16188.98 },
      3: { M: 3297.96, "M+1": 6365.06, "M+2": 9399.19, "M+3": 12202.45, "M+4": 14840.82, "M+5": 17808.98 },
      4: { M: 5097.96, "M+1": 9839.06, "M+2": 14529.19, "M+3": 18862.45, "M+4": 22940.82, "M+5": 27528.98 },
    },
    Mahogany: {
      1: { M: 3786.48, "M+1": 7307.91, "M+2": 10791.47, "M+3": 14009.98, "M+4": 17039.16, "M+5": 20446.99 },
      2: { M: 4626.48, "M+1": 8929.11, "M+2": 13185.47, "M+3": 17117.98, "M+4": 20819.16, "M+5": 24982.99 },
      3: { M: 5046.48, "M+1": 9739.71, "M+2": 14382.47, "M+3": 18671.98, "M+4": 22709.16, "M+5": 27250.99 },
      4: { M: 8046.48, "M+1": 15529.71, "M+2": 22932.47, "M+3": 29771.98, "M+4": 36209.16, "M+5": 43450.99 },
    },
    Rosewood: {
      1: { M: 5067.0, "M+1": 9779.31, "M+2": 14440.95, "M+3": 18747.9, "M+4": 22801.5, "M+5": 27361.8 },
      2: { M: 6087.0, "M+1": 11747.91, "M+2": 17347.95, "M+3": 22521.9, "M+4": 27391.5, "M+5": 32869.8 },
      3: { M: 6597.0, "M+1": 12732.21, "M+2": 18801.45, "M+3": 24408.9, "M+4": 29686.5, "M+5": 35623.8 },
      4: { M: 10497.0, "M+1": 20259.21, "M+2": 29916.45, "M+3": 38838.9, "M+4": 47236.5, "M+5": 56683.8 },
    },
  }


  useEffect(() => {
    if (id) {
      const fetchProspect = async () => {
        try {
          const response = await fetch(`${API_URL}/get/prospects/${id}`);
          const data = await response.json();
          setProspect(data);
        } catch (error) {
          console.error('Error fetching prospect data:', error);
        }
      };

      fetchProspect();
    }
  }, [id]);

  

  // Toggle collapsible sections
  const toggleSection = (section) => {
    setActiveSections((prevActiveSections) => ({
      ...Object.keys(prevActiveSections).reduce((acc, key) => {
        acc[key] = key === section ? !prevActiveSections[key] : false;
        return acc;
      }, {}),
    }));
  };
  
  const handlePolicyChange = (policy) => {
    setSelectedPolicy(policy);
    setActiveSections({
      micro: false,
      abs: false,
      daakye: false,
      telemedicine: false,
      ebusua: false,
      [policy]: true,
    });
  
    // Reset all other policy states
    setABS(policy === "abs");
    setDaakye(policy === "daakye");
    setEbusua(policy === "ebusua");
    setMicro(policy === "micro");
    setTele(policy === "telemedicine");
  };

  // Calculate MICRO premium
  useEffect(() => {
    if (microPlan && microFrequency) {
      const premium = microPremiums[microPlan][microFrequency]
      setMicroPremium(`GHS ${premium.toFixed(2)}`)
    } else {
      setMicroPremium("GHS 0.00")
    }
    
  }, [microPlan, microFrequency])

  

  // Calculate ABS premium
  useEffect(() => {
    if (absPlan && absType && absFrequency) {
      const premium = absPremiums[absPlan][absType][absFrequency]
      setAbsPremium(`GHS ${premium.toFixed(2)}`)
      setAbsHospital(`GHS ${absPremiums[absPlan].hospital.toFixed(2)}`)
      setAbsQuarterlyPharmacy(`GHS ${absPremiums[absPlan].quarterlyPharmacy.toFixed(2)}`)
      setAbsAnnualPharmacy(`GHS ${absPremiums[absPlan].annualPharmacy.toFixed(2)}`)
      setAbsScreening(`GHS ${absPremiums[absPlan].screening.toFixed(2)}`)
    } else {
      setAbsPremium("GHS 0.00")
      setAbsHospital("GHS 0.00")
      setAbsQuarterlyPharmacy("GHS 0.00")
      setAbsAnnualPharmacy("GHS 0.00")
      setAbsScreening("GHS 0.00")
    }
  }, [absPlan, absType, absFrequency])

  // Calculate Daakye premium based on sum assured
  useEffect(() => {
    if (daakyeYears && daakyeSumAssured > 0) {
      const rate = daakyePremiumRates[daakyeYears].rate
      const annualPremium = (daakyeSumAssured * rate).toFixed(2)
      const monthlyPremium = (annualPremium / 12).toFixed(2)
      setDaakyeMonthlyPremium(monthlyPremium)
      setDaakyeAnnualPremium(annualPremium)
    } else {
      setDaakyeMonthlyPremium("0.00")
      setDaakyeAnnualPremium("0.00")
    }
  }, [daakyeYears, daakyeSumAssured])

  // Calculate Daakye sum assured based on premium
  useEffect(() => {
    if (daakyeYearsPremium && daakyeEnteredPremium > 0) {
      const rate = daakyePremiumRates[daakyeYearsPremium].rate
      const estimatedSumAssured = ((daakyeEnteredPremium * 12) / rate).toFixed(2)
      setDaakyeCalculatedSumAssured(estimatedSumAssured)
    } else {
      setDaakyeCalculatedSumAssured("0.00")
    }
  }, [daakyeYearsPremium, daakyeEnteredPremium])

  // Calculate Telemedicine premium
  useEffect(() => {
    if (teleSubscription === "monthly") {
      setTelePremium("GHC 5.00")
    } else if (teleSubscription === "yearly") {
      setTelePremium("GHC 60.00")
    } else {
      setTelePremium("GHC 0.00")
    }
  }, [teleSubscription])

 



  // Calculate EBUSUA premium
  useEffect(() => {
    if (ebusuaPlan && ebusuaLevel && ebusuaLives) {
      const premium = ebusuaPremiums[ebusuaPlan][Number.parseInt(ebusuaLevel)][ebusuaLives]
      setEbusuaPremium(`GHS ${premium.toFixed(2)}`)

      // Generate beneficiary fields
      if (ebusuaLives !== "M") {
        const numBeneficiaries = Number.parseInt(ebusuaLives.split("+")[1])
        const beneficiaries = []

        for (let i = 1; i <= numBeneficiaries; i++) {
          beneficiaries.push({
            id: i,
            name: "",
            dob: "",
            relation: "",
          })
        }
        setEbusuaBeneficiaries(beneficiaries)
      } else {
        setEbusuaBeneficiaries([])
      }
    } else {
      setEbusuaPremium("GHS 0.00")
      setEbusuaBeneficiaries([])
    }
  }, [ebusuaPlan, ebusuaLevel, ebusuaLives])

  const [formData, setFormData] = useState({
      clientInfo: {
      }
    })

    const { clientId } = useParams();
    const [formState, setFormState] = useState({
      firstName: '',
      surname: '',
      dateOfBirth: '',
      phonenumber: '',
      email: '',
      address: '',
      nationalNumber: '',
      idType: '',
      idNumber: '',
      occupation: '',
      nationality: '',
      city: '',
      country: '',
      frontImage: null,
      backImage: null,
      // dependent_name: '',
      // dependent_dob: '',
      // dependent_rel: ''
    });

    //const [selectedPolicy, setSelectedPolicy] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Authentication check
    useEffect(() => {
      if (!token || !agentId) {
        console.log("No authentication token or agent ID found");
        navigate("/login");
      }
    }, [token, agentId, navigate]);

    console.log(token)
    console.log(agentId)
  
    useEffect(() => {
      if (prospect) {
        setFirstName(prospect.FirstName || '');
        setSurname(prospect.LastName || '');
        setDOB(prospect.DateOfBirth || '');
        setPhonenumber(prospect.Phone || '');
        setEmail(prospect.Email || '');
        setAddress(prospect.Address || '');
        setNationalNumber(prospect.NationalIdNumber || '');
        setIdType(prospect.IdType || '');
        setIdNumber(prospect.IdNumber || '');
        setOccupation(prospect.Occupation || '');
        setNationality(prospect.Nationality || '');
        setCity(prospect.City || '');
        setCountry(prospect.Country || '');
        

        console.log(prospect.FirstName)
      }
    }, [prospect]);
    
    const handleSubmit = async (e) => {
      e.preventDefault();

      const generatePolicyId = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); 
        const randomInt = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000; 
        const policyPrefix = selectedPolicy.slice(0, 3);
        return `${policyPrefix}_${year}$${month}&${randomInt}`;
      };

      
      
      const generateClientId = () => {
        const now = new Date();
        const year = now.getFullYear(); 
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const randomInt = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        return `CLI_${year}$${month}&${randomInt}`;
      };

      const productCode = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

      
    
      const personal = {
        client_id: clientid,
        agent_id: agentId,
        agent_branch: branch,
        first_name: firstName,
        surname: surname,
        other_name: otherName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        national_id_number: nationalNumber,
        gender: gender,
        id_type: idType,
        id_number: idNumber,
        front_image: frontImage,
        back_image: backImage,
        phone_number: phonenumber,
        email_address: email,
        nationality: nationality,
        residential_address: address,
        city_town: city,
        country: country,
        occupation: occupation,
      };
      let policyId = generatePolicyId();

      const policyData = {
        policy_id: policyId, 
        client_id: clientid, 
        agent: agentId.toString(),
        product_name: selectedPolicy, 
        product_code: productCode.toString(),
      };


      const dependentData = {
        client_id: clientid, 
        agent: agentId, 
        product_name: selectedPolicy, 
        product_code: productCode, 
        full_name: dependent_name, 
        date_of_birth: dependent_dob, 
        relation_type: dependent_rel, 
      };

      console.log(policyData)
    
      try {
        const response = await fetch(`${API_URL}/create/clients/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(personal),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const result = await response.json();
        console.log("Successfully", result);


      } catch (error) {
        console.error("Error:", error);
        alert("There was an error submitting the form. Please try again.");
      }


      try {
        // Submit the policy data
        const policyResponse = await fetch(`${API_URL}/client-policies/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(policyData),
        });
    
        if (!policyResponse.ok) {
          throw new Error(`HTTP error! status: ${policyResponse.status}`);
        }
    
        const policyResult = await policyResponse.json();
        console.log("Policy submitted successfully:", policyResult);

        if(dependentData.product_name === "ebusua"){
          // Submit the dependent data
          const dependentResponse = await fetch(`${API_URL}/dependants/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dependentData),
          });
      
          if (!dependentResponse.ok) {
            throw new Error(`HTTP error! status: ${dependentResponse.status}`);

          }
          const dependentResult = await dependentResponse.json();
          console.log("Dependent submitted successfully:", dependentResult);

        }    navigate('/ListClient');
      } catch (error) {
        console.error('Submission error:', error);
        alert(error.response?.data?.message || 'Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

 

  
  const set = () => {
    const nav = "product"

    localStorage.setItem("nav", nav)
    navigate("/agent/main")
    
  }

  const qwabs = {
    "micro": microPremium,
    "daakye": daakyeCalculatedSumAssured,
    "abs": absPremium,
    "ebusua": ebusuaPremium,
    "tele": telePremium
  }

  console.log(qwabs)
  localStorage.setItem("total_premium", JSON.stringify(qwabs));

  return (
    <div className={styles.container}>
      <Close />
      <h1 style={{
        display:"flex",
        justifyContent:"space-evenly",
        flexDirection:"row",
        alignItems:"center"
      }}>
         Policy Form
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Client Information Section */}
        <h2 className={styles.sectionTitle}>Client Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input 
            type="text" 
            id="firstName" 
            name="firstName"
            value={ prospect.firstName || firstName }
            onChange={(e) => setFirstName(e.target.value)} 
            required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="surname">Surname</label>
            <input 
            type="text" 
            id="surname" 
            name="surname"
            value={ prospect.lastName || surname }
            onChange={(e) => setSurname(e.target.value)} 
            required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Other name</label>
            <input 
            type="text" 
            id="lastName" 
            name="lastName"
            value={ lastName || '' }
            onChange={(e) => setLastName(e.target.value)}  
            required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <div className={styles.dateInputWrapper}>
              <input 
              type="date" 
              id="dateOfBirth" 
              name="dateOfBirth"
              value={ prospect.DateOfBirth || dateOfBirth }
              onChange={(e) => setDOB(e.target.value)}  
              required />
              {/* <FontAwesomeIcon icon={faCalendar} /> */}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="nationalNumber">National Id Number</label>
            <input 
            type="text" 
            id="nationalNumber" 
            name="nationalNumber"
            value={ nationalNumber }
            onChange={(e) => setNationalNumber(e.target.value)}  
            required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="idType">Id Type</label>
            <input 
            type="text" 
            id="idType" 
            name="idType"
            value={ idType }
            onChange={(e) => setIdType(e.target.value)}  
            required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="idNumber">Id Number</label>
            <input 
            type="text" 
            id="idNumber" 
            name="idNumber"
            value={ idNumber }
            onChange={(e) => setIdNumber(e.target.value)}  
            required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="frontImage">Front Image of Ghana Card</label>
            <input 
              type="file" 
              id="frontImage" 
              name="frontImage"
              onChange={(e) => setFrontImage(e.target.value)}
              accept="image/*"
              required 
            />
            {frontImage && <p>Selected file: {frontImage.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="backImage">Back Image of Ghana Card</label>
            <input 
              type="file" 
              id="backImage" 
              name="backImage"
              onChange={(e) => setBackImage(e.target.value)}
              accept="image/*"
              required 
            />
            {backImage && <p>Selected file: {backImage.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="occupation">Occupation</label>
            <input 
            type="text" 
            id="occupation" 
            name="occupation"
            value={ occupation }
            onChange={(e) => setOccupation(e.target.value)}  
            required />
          </div>
        </div>

        

        <div className={styles.formGroup}>
          <label>Gender</label>
          <div className={styles.radioGroup}>
            <label>
              <input 
              type="radio" 
              name="gender"
              value="male"
              checked={gender === "male"}
              onChange={(e) => setGender(e.target.value)} />
              Male
            </label>
            <label>
              <input 
              type="radio" 
              name="gender" 
              value="female"
              checked={gender === "female"}
              onChange={(e) => setGender(e.target.value)}/>
              Female
            </label>
          </div>
        </div>

        {/* Policy Selection Section */}
        <h2 className={styles.sectionTitle}>Policy Selection</h2>

        {/* MICRO Policy Section */}

        <div className={styles.collapsibleSection}>
          <div
            className={`${styles.collapsibleHeader} ${activeSections.micro ? styles.active : ""}`}
            onClick={() => {
              setSelectedPolicy("micro"); // Set the selected policy to "micro"
              toggleSection("micro"); // Toggle the micro section
            }}
          >
            <span>MICRO</span>
            <FontAwesomeIcon icon={activeSections.micro ? faMinus : faPlus} />
          </div>
          <div className={styles.collapsibleContent} style={{ display: activeSections.micro ? "block" : "none" }}>
            <div className={styles.formGroup}>
              <label className={styles.checkbox} htmlFor="checkMicro">
                <input
                  type="radio"
                  name="policy"
                  id="checkMicro"
                  value="micro"
                  checked={selectedPolicy === "micro"}
                  onChange={() => {
                    setSelectedPolicy("micro"); // Update the selected policy
                    toggleSection("micro"); // Expand the micro section
                  }}
                />
                If requested select
              </label>

              <label htmlFor="microPlan">Select Plan:</label>
              <select id="microPlan" value={microPlan} onChange={(e) => setMicroPlan(e.target.value)}>
                <option value="">Select Plan</option>
                <option value="Micro 1">Micro 1</option>
                <option value="Micro 2">Micro 2</option>
                <option value="Micro 3">Micro 3</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="microFrequency">Select Payment Frequency:</label>
              <select id="microFrequency" value={microFrequency} onChange={(e) => setMicroFrequency(e.target.value)}>
                <option value="">Select Payment Frequency</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half-Yearly</option>
                <option value="annually">Annually</option>
              </select>
            </div>

            <div className={styles.premiumDisplay}>
              <h2>
                Total Premium: <span id="microPremium">{microPremium}</span>
              </h2>
            </div>
          </div>
        </div>  

        {/* ABS Policy Section */}
        <div className={styles.collapsibleSection}>
          <div
            className={`${styles.collapsibleHeader} ${activeSections.abs ? styles.active : ""}`}
            onClick={() => {
              setSelectedPolicy("abs"); // Set the selected policy to "abs"
              toggleSection("abs"); // Toggle the abs section
            }}
          >
            <span>ABS</span>
            <FontAwesomeIcon icon={activeSections.abs ? faMinus : faPlus} />
          </div>
          <div className={styles.collapsibleContent} style={{ display: activeSections.abs ? "block" : "none" }}>
            <label className={styles.checkbox} htmlFor="checkABS">
              <input
                type="radio"
                name="policy"
                id="checkABS"
                value="abs"
                checked={selectedPolicy === "abs"}
                onChange={() => {
                  setSelectedPolicy("abs"); // Update the selected policy
                  toggleSection("abs"); // Expand the abs section
                }}
              />
              If requested select
            </label>

            <div className={styles.formGroup}>
              <label htmlFor="absPlan">Select ABS Plan:</label>
              <select id="absPlan" value={absPlan} onChange={(e) => setAbsPlan(e.target.value)}>
                <option value="">Select Plan</option>
                <option value="ABS1">ABS1</option>
                <option value="ABS2">ABS2</option>
                <option value="ABS3">ABS3</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="absType">Select Policy Type:</label>
              <select id="absType" value={absType} onChange={(e) => setAbsType(e.target.value)}>
                <option value="">Select Type</option>
                <option value="adult">Adult</option>
                <option value="child">Child</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="absFrequency">Select Payment Frequency:</label>
              <select id="absFrequency" value={absFrequency} onChange={(e) => setAbsFrequency(e.target.value)}>
                <option value="">Select Payment Frequency</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half-Yearly</option>
                <option value="annually">Annually</option>
              </select>
            </div>

            <div className={styles.premiumDisplay}>
              <h2>
                Total Premium: <span>{absPremium}</span>
              </h2>
              <p>
                Hospital Cash: <span>{absHospital}</span>
              </p>
              <p>
                Quarterly Pharmacy: <span>{absQuarterlyPharmacy}</span>
              </p>
              <p>
                Annual Pharmacy: <span>{absAnnualPharmacy}</span>
              </p>
              <p>
                Screening: <span>{absScreening}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Daakye Policy Section */}
        <div className={styles.collapsibleSection}>
          <div
            className={`${styles.collapsibleHeader} ${activeSections.daakye ? styles.active : ""}`}
            onClick={() => {
              setSelectedPolicy("daakye"); // Set the selected policy to "abs"
              toggleSection("daakye");
            }}
          >
            <span>DAAKYE</span>
            <FontAwesomeIcon icon={activeSections.daakye ? faMinus : faPlus} />
          </div>
          <div className={styles.collapsibleContent} style={{ display: activeSections.daakye ? "block" : "none" }}>
            


          <label className={styles.checkbox} htmlFor="checkDaakye">
              <input 
                type="radio" 
                name="policy" 
                id="checkDaakye"
                value="daakye"
                checked={selectedPolicy === "daakye"}
                onChange={() => {
                  setSelectedPolicy("daakye"); // Set the selected policy to "abs"
                  toggleSection("daakye");
                }} />
              If requested select
            </label>
            <div className={styles.formGroup}>
              <label htmlFor="daakyeCalculationType">Choose Calculation Method:</label>
              <select
                id="daakyeCalculationType"
                value={daakyeCalculationType}
                onChange={(e) => setDaakyeCalculationType(e.target.value)}
              >
                <option value="sumAssured">Calculate Based on Sum Assured & Term</option>
                <option value="premiumFee">Calculate Based on Premium + Policy Fee & Term</option>
              </select>
            </div>

            <div
              id="daakyeSumAssuredSection"
              style={{ display: daakyeCalculationType === "sumAssured" ? "block" : "none" }}
            >
              <div className={styles.formGroup}>
                <label htmlFor="daakyeYears">Select Term (Years):</label>
                <select id="daakyeYears" value={daakyeYears} onChange={(e) => setDaakyeYears(e.target.value)}>
                  <option value="">Select Term</option>
                  <option value="5">5 Years</option>
                  <option value="6">6 Years</option>
                  <option value="7">7 Years</option>
                  <option value="8">8 Years</option>
                  <option value="9">9 Years</option>
                  <option value="10">10 Years</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="daakyeSumAssured">Enter Sum Assured (₵):</label>
                <input
                  type="number"
                  id="daakyeSumAssured"
                  value={daakyeSumAssured}
                  onChange={(e) => setDaakyeSumAssured(Number.parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className={styles.premiumDisplay}>
                <h2>Calculated Premium</h2>
                <p>
                  Monthly Premium: ₵<span>{daakyeMonthlyPremium}</span>
                </p>
                <p>
                  Annual Premium: ₵<span>{daakyeAnnualPremium}</span>
                </p>
              </div>
            </div>

            <div
              id="daakyePremiumFeeSection"
              style={{ display: daakyeCalculationType === "premiumFee" ? "block" : "none" }}
            >
              <div className={styles.formGroup}>
                <label htmlFor="daakyeYearsPremium">Select Term (Years):</label>
                <select
                  id="daakyeYearsPremium"
                  value={daakyeYearsPremium}
                  onChange={(e) => setDaakyeYearsPremium(e.target.value)}
                >
                  <option value="">Select Term</option>
                  <option value="5">5 Years</option>
                  <option value="6">6 Years</option>
                  <option value="7">7 Years</option>
                  <option value="8">8 Years</option>
                  <option value="9">9 Years</option>
                  <option value="10">10 Years</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="daakyeEnteredPremium">Enter Monthly Premium (₵):</label>
                <input
                  type="number"
                  id="daakyeEnteredPremium"
                  value={daakyeEnteredPremium}
                  onChange={(e) => setDaakyeEnteredPremium(Number.parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className={styles.premiumDisplay}>
                <h2>Calculated Sum Assured</h2>
                <p>
                  Estimated Sum Assured: ₵<span>{daakyeCalculatedSumAssured}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Telemedicine Section */}
        <div className={styles.collapsibleSection}>
          <div
            className={`${styles.collapsibleHeader} ${activeSections.telemedicine ? styles.active : ""}`}
            onClick={() => {
              setSelectedPolicy("telemedicine"); // Set the selected policy to "abs"
              toggleSection("telemedicine");
            }}
          >
            <span>TELEMEDICINE</span>
            <FontAwesomeIcon icon={activeSections.telemedicine ? faMinus : faPlus} />
          </div>
          <div className={styles.collapsibleContent} style={{ display: activeSections.telemedicine ? "block" : "none" }}>
            


              <label className={styles.checkbox} htmlFor="checkTele">
                <input 
                  type="radio" 
                  name="policy" 
                  id="checkTele"
                  value="telemedicine"
                  checked={selectedPolicy === "telemedicine"}
                  onChange={() => {
                    setSelectedPolicy("telemedicine"); // Set the selected policy to "abs"
                    toggleSection("telemedicine");
                  }} />
                If requested select
              </label>
            <div className={styles.formGroup}>
              <label htmlFor="teleSubscription">Select Subscription Type:</label>
              <select
                id="teleSubscription"
                value={teleSubscription}
                onChange={(e) => setTeleSubscription(e.target.value)}
              >
                <option value="">Select Subscription Type</option>
                <option value="monthly">Monthly (GHC 5.00 per person)</option>
                <option value="yearly">Yearly (GHC 60.00 per person)</option>
              </select>
            </div>

            <div className={styles.premiumDisplay}>
              <h2>
                Total Premium: <span>{telePremium}</span>
              </h2>
            </div>
          </div>
        </div>

        {/* EBUSUA Section */}
        <div className={styles.collapsibleSection}>
          <div
            className={`${styles.collapsibleHeader} ${activeSections.micro ? styles.active : ""}`}
            onClick={() => {
              setSelectedPolicy("ebusua"); // Set the selected policy to "abs"
              toggleSection("ebusua");
            }}
          >
            <span>EBUSUA</span>
            <FontAwesomeIcon icon={activeSections.ebusua ? faMinus : faPlus} />
          </div>
          <div className={styles.collapsibleContent} style={{ display: activeSections.ebusua ? "block" : "none" }}>
            
          <label className={styles.checkbox} htmlFor="checkEbusua">
              <input 
                type="radio" 
                name="policy" 
                id="checkEbusua"
                value="ebusua"
                checked={selectedPolicy === "ebusua"}
                onChange={() => {
                  setSelectedPolicy("ebusua"); // Set the selected policy to "abs"
                  toggleSection("ebusua");
                }} />
              If requested select
            </label>
            <div className={styles.formGroup}>
              <label htmlFor="ebusuaPlan">Select Plan:</label>
              <select id="ebusuaPlan" value={ebusuaPlan} onChange={(e) => setEbusuaPlan(e.target.value)}>
                <option value="">Select Plan</option>
                <option value="Shea">Shea</option>
                <option value="Oak">Oak</option>
                <option value="Mahogany">Mahogany</option>
                <option value="Rosewood">Rosewood</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ebusuaLevel">Select Level:</label>
              <select id="ebusuaLevel" value={ebusuaLevel} onChange={(e) => setEbusuaLevel(e.target.value)}>
                <option value="">Select Level</option>
                <option value="1">Level 1 (Base Cover)</option>
                <option value="2">Level 2 (Base + Dental)</option>
                <option value="3">Level 3 (Base + Dental + Optical)</option>
                <option value="4">Level 4 (Base + Dental + Optical + Maternity)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ebusuaLives">Select Number of Lives:</label>
              <select id="ebusuaLives" value={ebusuaLives} onChange={(e) => setEbusuaLives(e.target.value)}>
                <option value="">Select Lives</option>
                <option value="M">M (Individual)</option>
                <option value="M+1">M+1</option>
                <option value="M+2">M+2</option>
                <option value="M+3">M+3</option>
                <option value="M+4">M+4</option>
                <option value="M+5">M+5</option>
              </select>
            </div>

            <div className={styles.premiumDisplay}>
              <h2>
                Yearly Premium: <span>{ebusuaPremium}</span>
              </h2>
            </div>

            {ebusuaBeneficiaries.length > 0 && (
              <div id="ebusuaBeneficiarySection">
                {ebusuaBeneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className={styles.beneficiaryContainer}>
                    <h3>Beneficiary {beneficiary.id}</h3>
                    <div className={styles.formGroup}>
                      <label htmlFor={`ebusuaBeneficiaryName${beneficiary.id}`}>Full Name:</label>
                      <input 
                      type="text" 
                      id={`ebusuaBeneficiaryName${beneficiary.id}`} 
                      placeholder="Enter full name"
                      name="dependent_name"
                      onChange={(e) => setDependentName(e.target.value)}
                      value={ dependent_name } />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor={`ebusuaBeneficiaryDob${beneficiary.id}`}>Date of Birth:</label>
                      <input 
                      type="date" 
                      id={`ebusuaBeneficiaryDob${beneficiary.id}`} 
                      name="dependent_dob"
                      onChange={(e) => setDependentDOB(e.target.value)}
                      value={ dependent_dob } />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor={`ebusuaBeneficiaryRelation${beneficiary.id}`}>Relationship with Client:</label>
                      <input
                        type="text"
                        id={`ebusuaBeneficiaryRelation${beneficiary.id}`}
                        placeholder="e.g., Spouse, Child"
                        name="dependent_rel"
                        onChange={(e) => setDependentRel(e.target.value)}
                        value={ dependent_rel }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


        </div>
        <h2 className={styles.sectionTitle}>Client Contact</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone number</label>
            <input 
            type="tel" 
            id="phone" 
            name="phonenumber"
            value={ prospect.phone || phonenumber }
            onChange={(e) => setPhonenumber(e.target.value)} 
            placeholder="+233 (0) "
            required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
            type="email" 
            id="email" 
            name="email"
            value={ prospect.email || email }
            onChange={(e) => setEmail(e.target.value)} 
            required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="nationality">Nationality</label>
            <input 
            type="text" 
            id="nationality" 
            name="nationality"
            value={ nationality }
            onChange={(e) => setNationality(e.target.value)}  
            required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="city">Residential Address</label>
            <div className={styles.dateInputWrapper}>
              <textarea  
              id="address" 
              name="address"
              value={ address }
              onChange={(e) => setAddress(e.target.value)}  
              required ></textarea>
              
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="city">City/Town</label>
            <div className={styles.dateInputWrapper}>
              <input 
              type="text" 
              id="city" 
              name="city"
              value={ city }
              onChange={(e) => setCity(e.target.value)}  
              required />
              
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="county">Country</label>
            <div className={styles.dateInputWrapper}>
              <input 
              type="text" 
              id="country" 
              name="country"
              value={ country }
              onChange={(e) => setCountry(e.target.value)}  
              required />
              
            </div>
          </div>
        </div>

  

        <button type="submit" className={styles.submitButton}>
          Submit Application
        </button>
      </form>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react";
import styles from "./ProspectForm.module.css";
import { Close } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import API_URL from "../link";
import { useContext } from "react";
import { PopupContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import DocumentScanner from "./DocumentScanner";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import AOS from 'aos';
import 'aos/dist/aos.css';

function ProspectForm() {
  const agentid = parseInt(localStorage.getItem('id'), 10);
  const branchid = parseInt(localStorage.getItem('branch'), 10) || 1;
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in milliseconds
      easing: 'ease-in-out', // default easing for AOS animations
      once: false // whether animation should happen only once
    });
  })

  const [formData, setFormData] = useState({
    "AgentID": agentid || 0,
    "BranchID": branchid,
    "FirstName": "",
    "LastName": "",
    "Email": "",
    "Phone": "",
    "DateOfBirth": "",
    "Address": "",
    "Source": "Referral",  // Keep it as an object
    "Stage": "New",
    "Status": "Active",
    "Notes": "",
  });
  const { setPopupState } = useContext(PopupContext)

  const [productKey, setProductKey] = useState("");
  const [productValue, setProductValue] = useState("");

  const handleDataExtracted = (extractedData) => {
    setFormData(prev => ({
      ...prev,
      ...extractedData
    }));
    
    setPopupState({
      show: true,
      message: 'Data extracted successfully!',
      page: 'prospect_forms',
    });
  };


  useEffect(() => {
    const onResize = () => {
      const viewport = window.visualViewport;
      if (viewport) {
        const keyboardHeight = window.innerHeight - viewport.height;
        document.body.style.paddingBottom = keyboardHeight + 'px';
      }
    };
  
    window.visualViewport?.addEventListener('resize', onResize);
  
    return () => {
      window.visualViewport?.removeEventListener('resize', onResize);
      document.body.style.paddingBottom = '0px';
    };
  }, []);
  


  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: type === "number" ? (value === "" ? null : Number(value)) : (value === "" ? null : value),
    }));
  };

  const addInterestedProduct = (e) => {
    e.preventDefault();
    if (productKey.trim() !== "") {
      setFormData(prevState => ({
        ...prevState,
        InterestedProducts: {
          ...prevState.InterestedProducts,
          [productKey]: productValue,
        },
      }));
      setProductKey("");
      setProductValue("");
    }
  };


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submitToAPI = async (data) => {
    const apiUrl = `${API_URL}/prospects/`;
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("API response:", result);
  
      setPopupState({
        show: true,
        message: 'Prospect Created Successfully!',
        page: 'prospect_forms',
      });
  
      navigate('/Appointment');
      return result;
  
    } catch (error) {
      console.error("Error submitting to API:", error);
  
      setPopupState({
        show: true,
        message: error.message,
        page: 'prospect_forms',
      });
    }
  };
  

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitError(null);
  setSubmitSuccess(false);

  // Prepare the payload with proper formatting
  const payload = {
    "AgentID": formData.AgentID,
    "BranchID": formData.BranchID,
    "FirstName": formData.FirstName,
    "LastName": formData.LastName,
    "Email": formData.Email || null,
    "Phone": formData.Phone || null,
    "DateOfBirth": formData.DateOfBirth ? formData.DateOfBirth : null,
    "Address": formData.Address || null,
    "Source": formData.Source,
    "Stage": formData.Stage,
    "Status": formData.Status,
    "Notes": formData.Notes || null,
  };

  console.log("Prepared payload:", payload);

  try {
    await submitToAPI(payload);
    setSubmitSuccess(true);
  } catch (error) {
    setSubmitError(error.message);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className={styles.Container}>
      <Close title={"Prospects Form"} tab={"home"}/>
      <div className={`${styles.formContainer} card mt-4 mb-4`}>
        <div className="card-body">
          <h1>Prospects Form</h1>

          {/* Add Camera/Upload Button */}
          <div className="mb-3" style={{
            position: "absolute",
            bottom: "30px",
            right: "30px",
            borderRadius: "100px",
          }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setShowScanner(true)}
            >
              <FontAwesomeIcon icon={faCamera} className="me-2" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>

            <fieldset data-aos="zoom-in" data-aos-delay="100">
              <div className="row mb-6">
                <div className="col-md-6">
                  <label htmlFor="FirstName" className="form-label">
                    First Name*
                  </label>
                  <input
                    type="text"
                    className=""
                    id="FirstName"
                    name="FirstName"
                    style={{ textTransform: 'capitalize' }}
                    value={formData.FirstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="LastName" className="form-label">
                    Surname*
                  </label>
                  <input
                    type="text"
                    className="control"
                    id="LastName"
                    name="LastName"
                    style={{ textTransform: 'capitalize' }}
                    value={formData.LastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </fieldset>

            <fieldset data-aos="zoom-in" data-aos-delay="500">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="Email" className="form-label">
                    Email*
                  </label>
                  <input
                    type="email"
                    className="control"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="Phone" className="form-label">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    className="control"
                    id="Phone"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </fieldset>

            <fieldset data-aos="zoom-in" data-aos-delay="1000">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="DateOfBirth" className="form-label">
                    Date of Birth*
                  </label>
                  <input
                    type="date"
                    className="control"
                    id="DateOfBirth"
                    name="DateOfBirth"
                    value={formData.DateOfBirth}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="Source" className="form-label">
                    Source*
                  </label>
                  <select
                    className="form-select"
                    id="Source"
                    name="Source"
                    value={formData.Source}
                    onChange={handleChange}
                    required
                  >
                    <option value="Referral">Referral</option>
                    <option value="Online">Online</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Campaign">Campaign</option>
                    <option value="Other">Other</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="Address" className="form-label">
                  Address*
                </label>
                <textarea
                  className=""
                  id="Address"
                  name="Address"
                  rows="2"
                  value={formData.Address}
                  onChange={handleChange}
                ></textarea>
              </div>
            </fieldset>

            
            <div className="mb-3">
              <label htmlFor="Notes" className="form-label">
                Notes Plan
              </label>
              <textarea
                className=""
                id="Notes"
                name="Notes"
                rows="3"
                value={formData.Notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className={styles.buttonContainer}>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Save Prospect"}
              </button>
            </div>
            {submitError && (
              <div className="alert alert-danger mt-3" role="alert">
                Error: {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="alert alert-success mt-3" role="alert">
              </div>
            )}
          </form>
        </div>
      </div>
      {showScanner && (
        <div style={{
          position: "absolute",
          top: "0%",
          left: "0%",
          width: "100%",
          height: "100%",
          background: "#000000ab",
          backdropFilter: "blur(20px)",
          zIndex: "99999999",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}>
        <DocumentScanner 
          onDataExtracted={handleDataExtracted}
          onClose={() => setShowScanner(false)}
        />
        </div>
      )}
    </div>
  );
}

export default ProspectForm;
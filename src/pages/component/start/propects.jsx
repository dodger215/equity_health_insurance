"use client"

import { useState } from "react";
import styles from "./ProspectForm.module.css";
import { Close } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

function ProspectForm() {
  const agentid = parseInt(localStorage.getItem('id'), 10);
  const branchid = parseInt(localStorage.getItem('branch'), 10) || 1;

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

  const [productKey, setProductKey] = useState("");
  const [productValue, setProductValue] = useState("");

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

  // const removeInterestedProduct = (key) => {
  //   setFormData(prevState => {
  //     const updatedProducts = { ...prevState.InterestedProducts };
  //     delete updatedProducts[key];
  //     return { ...prevState, InterestedProducts: updatedProducts };
  //   });
  // };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submitToAPI = async (data) => {
    const apiUrl = "http://127.0.0.1:8000/prospects/";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Don't stringify InterestedProducts separately
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response:", result);
      return result;
    } catch (error) {
      console.error("Error submitting to API:", error);
      throw error;
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
      <Close title={"Prospects Form"} />
      <div className={`${styles.formContainer} card mt-4 mb-4`}>
        <div className="card-body">
          <h1>Prospects Form</h1>
          <form onSubmit={handleSubmit}>

            <fieldset>
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
                    value={formData.FirstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="LastName" className="form-label">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    className="control"
                    id="LastName"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="Email" className="form-label">
                    Email
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

            <fieldset>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="DateOfBirth" className="form-label">
                    Date of Birth
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
                  Address
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

            <fieldset>
              <div className="row mb-3 field">
                <div className="col-md-6">
                  <label htmlFor="Stage" className="form-label">
                    Stage
                  </label>
                  <select
                    className="form-select"
                    id="Stage"
                    name="Stage"
                    value={formData.Stage}
                    onChange={handleChange}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="Status" className="form-label">
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="Status"
                    name="Status"
                    value={formData.Status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* <fieldset>
              <div className="mb-3">
                <label className="form-label">Interested Products</label>
                <div className="card p-3 mb-2">
                  <div className="row g-2">
                    <div className="col-md-5">
                      <input
                        type="text"
                        className=""
                        placeholder="Product Name"
                        value={productKey}
                        onChange={(e) => setProductKey(e.target.value)}
                      />
                    </div>
                    <div className="col-md-5">
                      <input
                        type="text"
                        className=""
                        placeholder="Details"
                        value={productValue}
                        onChange={(e) => setProductValue(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <button className="btn btn-success w-100" onClick={addInterestedProduct}>
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>

                  {Object.keys(formData.InterestedProducts).length > 0 && (
                    <div className="mt-3 card border">
                      <h6>Added Products:</h6>
                      <ul className="list-group">
                        {Object.entries(formData.InterestedProducts).map(([key, value]) => (
                          <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{key}</strong>: {value}
                            </div>
                            <button className="btn btn-sm btn-danger" onClick={() => removeInterestedProduct(key)}>
                              <FontAwesomeIcon icon={faTrash} /> Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )} 
                </div>
              </div>
            </fieldset> */}

            <div className="mb-3">
              <label htmlFor="Notes" className="form-label">
                Notes
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
                Prospect successfully saved!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProspectForm;
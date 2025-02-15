"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./kyc.module.css"

const KYCForm = () => {
  const router = useNavigate()
  const [formData, setFormData] = useState({
    personal_info: {
      first_name: "",
      surname: "",
      other_names: "",
      date_of_birth: "",
      gender: "",
      id_type: "",
      id_number: "",
      product_type: "",
    },
    contact_info: {
      phone_number: "",
      email_address: "",
      nationality: "",
      residential_address: "",
      city_town: "",
      country: "",
    },
    dependants: [],
  })

  const [errors, setErrors] = useState({})

  const handleChange = (section, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }))
  }

  const handleDependantChange = (index, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      dependants: prevState.dependants.map((dep, i) => (i === index ? { ...dep, [field]: value } : dep)),
    }))
  }

  const addDependant = () => {
    setFormData((prevState) => ({
      ...prevState,
      dependants: [...prevState.dependants, { full_name: "", date_of_birth: "", relationship: "" }],
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.personal_info.first_name) newErrors.first_name = "First name is required"
    if (!formData.personal_info.surname) newErrors.surname = "Surname is required"
    if (!formData.personal_info.date_of_birth) newErrors.date_of_birth = "Date of birth is required"
    if (!formData.personal_info.gender) newErrors.gender = "Gender is required"
    if (!formData.personal_info.id_type) newErrors.id_type = "ID type is required"
    if (!formData.personal_info.id_number) newErrors.id_number = "ID number is required"
    if (!formData.personal_info.product_type) newErrors.product_type = "Product type is required"
    if (!formData.contact_info.phone_number) newErrors.phone_number = "Phone number is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const token = localStorage.getItem("jwtToken")
    if (!token) {
      setErrors({ submit: "Not authenticated. Please log in." })
      return
    }

    try {
      // Submit personal info
      const personalInfoResponse = await fetch("https://equity-health-insurance-agent-api.onrender.com/personal_info/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData.personal_info),
      })

      if (!personalInfoResponse.ok) throw new Error("Failed to submit personal info")
      const personalInfoData = await personalInfoResponse.json()

      // Submit contact info
      const contactInfoResponse = await fetch("https://equity-health-insurance-agent-api.onrender.com/contact_info/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData.contact_info),
      })

      if (!contactInfoResponse.ok) throw new Error("Failed to submit contact info")

      // Submit dependants
      for (const dependant of formData.dependants) {
        const dependantResponse = await fetch("https://equity-health-insurance-agent-api.onrender.com/dependants/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...dependant, client_id: personalInfoData.id }),
        })

        if (!dependantResponse.ok) throw new Error("Failed to submit dependant info")
      }

      alert("KYC form submitted successfully!")
      router.push("/agent/main")
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors({ submit: error.message })
    }
  }

  const handleBack = () => {
    router('/agent/main')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          &larr; Back to Main
        </button>
        <h2>Equity Health Insurance KYC</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <fieldset className={styles.fieldset}>
          <legend>Personal Information</legend>
          <label className={styles.label}>
            First Name:
            <input
              type="text"
              value={formData.personal_info.first_name}
              onChange={(e) => handleChange("personal_info", "first_name", e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Surname:
            <input
              type="text"
              value={formData.personal_info.surname}
              onChange={(e) => handleChange("personal_info", "surname", e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Other Name(s):
            <input
              type="text"
              value={formData.personal_info.other_names}
              onChange={(e) => handleChange("personal_info", "other_names", e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Date of Birth:
            <input
              type="date"
              value={formData.personal_info.date_of_birth}
              onChange={(e) => handleChange("personal_info", "date_of_birth", e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Gender:
            <select
              value={formData.personal_info.gender}
              onChange={(e) => handleChange("personal_info", "gender", e.target.value)}
              required
              className={styles.select}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className={styles.label}>
            ID Type:
            <select
              value={formData.personal_info.id_type}
              onChange={(e) => handleChange("personal_info", "id_type", e.target.value)}
              required
              className={styles.select}
            >
              <option value="">Select ID Type</option>
              <option value="passport">Passport</option>
              <option value="drivers_license">Driver's License</option>
              <option value="national_id">National ID</option>
              <option value="ghana_card">Ghana Card</option>
            </select>
          </label>
          <label className={styles.label}>
            ID Number:
            <input
              type="text"
              value={formData.personal_info.id_number}
              onChange={(e) => handleChange("personal_info", "id_number", e.target.value)}
              required
              className={styles.input}
            />
          </label>
        </fieldset>

        {/* Contact Information */}
        <fieldset className={styles.fieldset}>
          <legend>Contact Information</legend>
          <label className={styles.label}>
            Phone Number:
            <input
              type="tel"
              value={formData.contact_info.phone_number}
              onChange={(e) => handleChange("contact_info", "phone_number", e.target.value)}
              placeholder="+233 (0)"
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Email Address:
            <input
              type="email"
              value={formData.contact_info.email_address}
              onChange={(e) => handleChange("contact_info", "email_address", e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Nationality:
            <input
              type="text"
              value={formData.contact_info.nationality}
              onChange={(e) => handleChange("contact_info", "nationality", e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Residential Address:
            <input
              type="text"
              value={formData.contact_info.residential_address}
              onChange={(e) => handleChange("contact_info", "residential_address", e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            City/Town:
            <input
              type="text"
              value={formData.contact_info.city_town}
              onChange={(e) => handleChange("contact_info", "city_town", e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Country:
            <input
              type="text"
              value={formData.contact_info.country}
              onChange={(e) => handleChange("contact_info", "country", e.target.value)}
              className={styles.input}
            />
          </label>
        </fieldset>

        {/* Dependant Details */}
        <fieldset className={styles.fieldset}>
          <legend>Dependant Details (If Applicable)</legend>
          {formData.dependants.map((dependant, index) => (
            <div key={index}>
              <label className={styles.label}>
                Dependant {index + 1} Full Name:
                <input
                  type="text"
                  value={dependant.full_name}
                  onChange={(e) => handleDependantChange(index, "full_name", e.target.value)}
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Dependant {index + 1} Date of Birth:
                <input
                  type="date"
                  value={dependant.date_of_birth}
                  onChange={(e) => handleDependantChange(index, "date_of_birth", e.target.value)}
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Dependant {index + 1} Relationship:
                <input
                  type="text"
                  value={dependant.relationship}
                  onChange={(e) => handleDependantChange(index, "relationship", e.target.value)}
                  className={styles.input}
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={addDependant} className={styles.button}>
            Add Dependant
          </button>
        </fieldset>

        {/* Product Type */}
        <fieldset className={styles.fieldset}>
          <legend>Product Type</legend>
          <div className={styles.productType}>
            {["MICRO", "TELEMEDICINE", "ABS", "EBUSUA", "DAAKYE"].map((product) => (
              <label key={product} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="product"
                  value={product}
                  checked={formData.personal_info.product_type === product}
                  onChange={(e) => handleChange("personal_info", "product_type", e.target.value)}
                  className={styles.radioInput}
                />
                {product}
              </label>
            ))}
          </div>
        </fieldset>

        {errors.submit && <div className={styles.error}>{errors.submit}</div>}
        <div className={styles.buttonGroup}>
          <button type="button" onClick={handleBack} className={styles.backButton}>
            Back
          </button>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default KYCForm


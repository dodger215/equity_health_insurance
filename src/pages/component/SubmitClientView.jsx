"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styles from "./SubmitClient.module.css"

const SubmitClient = () => {
  const { id } = useParams()
  const navigate = useNavigate()
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
  const [signature, setSignature] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClientData = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        setError("Not authenticated. Please log in.")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`https://ehi-agent-api.onrender.com/get_client_info/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch client data")
        }

        const data = await response.json()
        setFormData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchClientData()
  }, [id])

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

  const handleSignatureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSignature(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      setError("Not authenticated. Please log in.")
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("signature", signature)
      formDataToSend.append("client_data", JSON.stringify(formData))

      const response = await fetch(`https://ehi-agent-api.onrender.com/upload_client/${id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to submit client data")
      }

      alert("Client data submitted successfully!")
      navigate("/agent/main")
    } catch (error) {
      console.error("Error submitting form:", error)
      setError(error.message)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>
  }

  return (
    <div className={styles.container}>
      <h2>Edit Client Information</h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <fieldset>
          <legend>Personal Information</legend>
          <input
            type="text"
            value={formData.personal_info.first_name}
            onChange={(e) => handleChange("personal_info", "first_name", e.target.value)}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            value={formData.personal_info.surname}
            onChange={(e) => handleChange("personal_info", "surname", e.target.value)}
            placeholder="Surname"
            required
          />
          <input
            type="text"
            value={formData.personal_info.other_names}
            onChange={(e) => handleChange("personal_info", "other_names", e.target.value)}
            placeholder="Other Names"
          />
          <input
            type="date"
            value={formData.personal_info.date_of_birth}
            onChange={(e) => handleChange("personal_info", "date_of_birth", e.target.value)}
            required
          />
          <select
            value={formData.personal_info.gender}
            onChange={(e) => handleChange("personal_info", "gender", e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            value={formData.personal_info.id_type}
            onChange={(e) => handleChange("personal_info", "id_type", e.target.value)}
            placeholder="ID Type"
            required
          />
          <input
            type="text"
            value={formData.personal_info.id_number}
            onChange={(e) => handleChange("personal_info", "id_number", e.target.value)}
            placeholder="ID Number"
            required
          />
        </fieldset>

        {/* Contact Information */}
        <fieldset>
          <legend>Contact Information</legend>
          <input
            type="tel"
            value={formData.contact_info.phone_number}
            onChange={(e) => handleChange("contact_info", "phone_number", e.target.value)}
            placeholder="Phone Number"
            required
          />
          <input
            type="email"
            value={formData.contact_info.email_address}
            onChange={(e) => handleChange("contact_info", "email_address", e.target.value)}
            placeholder="Email Address"
          />
          <input
            type="text"
            value={formData.contact_info.nationality}
            onChange={(e) => handleChange("contact_info", "nationality", e.target.value)}
            placeholder="Nationality"
          />
          <input
            type="text"
            value={formData.contact_info.residential_address}
            onChange={(e) => handleChange("contact_info", "residential_address", e.target.value)}
            placeholder="Residential Address"
          />
          <input
            type="text"
            value={formData.contact_info.city_town}
            onChange={(e) => handleChange("contact_info", "city_town", e.target.value)}
            placeholder="City/Town"
          />
          <input
            type="text"
            value={formData.contact_info.country}
            onChange={(e) => handleChange("contact_info", "country", e.target.value)}
            placeholder="Country"
          />
        </fieldset>

        {/* Dependants */}
        <fieldset>
          <legend>Dependants</legend>
          {formData.dependants.map((dependant, index) => (
            <div key={index}>
              <input
                type="text"
                value={dependant.full_name}
                onChange={(e) => handleDependantChange(index, "full_name", e.target.value)}
                placeholder="Full Name"
              />
              <input
                type="date"
                value={dependant.date_of_birth}
                onChange={(e) => handleDependantChange(index, "date_of_birth", e.target.value)}
              />
              <input
                type="text"
                value={dependant.relation_type}
                onChange={(e) => handleDependantChange(index, "relation_type", e.target.value)}
                placeholder="Relationship"
              />
            </div>
          ))}
        </fieldset>

        {/* Signature Upload */}
        <fieldset>
          <legend>Signature</legend>
          <input type="file" accept="image/*" onChange={handleSignatureChange} required />
        </fieldset>

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default SubmitClient


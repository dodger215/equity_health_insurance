"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function LoginForm() {
  const [formData, setFormData] = useState({
    agent_code: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.agent_code) newErrors.agent_code = "Agent code is required"
    if (!formData.password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      setIsSubmitting(true)
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      console.log("Submitting form data:", formData)
      fetch("https://equity-health-insurance-agent-api.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success" && data.access_token) {
            console.log("Login successful")
            localStorage.setItem("jwtToken", data.access_token)
            localStorage.setItem("agents_name", data.full_name)
            localStorage.setItem("id", data.id)
            navigate("/agent/main")
          } else {
            console.log("Login failed")
            setErrors({ submit: "Login failed. Please check your credentials and try again." })
          }
        })
        .catch((error) => {
          console.error("Login error:", error)
          setErrors({ submit: `An error occurred: ${error.message}. Please try again.` })
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    }
  }, [isSubmitting, formData, navigate])

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="agent_code">Agent Code:</label>
        <input
          type="text"
          id="agent_code"
          name="agent_code"
          value={formData.agent_code}
          onChange={handleChange}
          required
        />
        {errors.agent_code && <span className="error">{errors.agent_code}</span>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      {errors.submit && <div className="error">{errors.submit}</div>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <div className="loader"></div> : "Login"}
      </button>
    </form>
  )
}

export default LoginForm


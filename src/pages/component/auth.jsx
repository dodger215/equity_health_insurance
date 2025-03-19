"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PrimaryLoading } from "./ui/loading"
import API_URL from "./link"

import { useContext } from "react"
import { PopupContext } from "../../App"

function LoginForm() {
  const { setPopupState } = useContext(PopupContext)
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
      fetch(`${API_URL}/login`, {
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
            console.log(`Token: ${data.access_token}`)
            localStorage.setItem("jwtToken", data.access_token)
            localStorage.setItem("agents_name", data.name)
            localStorage.setItem("id", data.id)
            setPopupState({
              show: true,
              message: 'Login Successful! 🎉', 
              page: 'login', 
            });
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
        {/* <label htmlFor="agent_code">Agent Code:</label> */}
        <input
          type="text"
          id="agent_code"
          name="agent_code"
          placeholder="Agent Code"
          value={formData.agent_code}
          onChange={handleChange}
          required
        />
        {errors.agent_code && <span className="error">{errors.agent_code}</span>}
      </div>
      <div>
        {/*  */}
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {
          errors.password && 
          <span className="error">{errors.password}</span>
        }
      </div>
      {
        errors.submit && 
        <div 
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#b22222",
          fontSize: "0.6em"
        }}
        className="error"
        
        >
          {errors.submit}
        </div>
      }
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <PrimaryLoading /> : "Login"}
      </button>
    </form>
  )
}

export default LoginForm


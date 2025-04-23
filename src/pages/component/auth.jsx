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
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const uploadLogin = async (clientID) => {
    const param = {
      "ClientID": clientID.toString(),
    }
    await fetch(`${API_URL}/agent/logins/`, {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(param),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        console.log("Login successful")
      }
    })
    .catch((error) => {
      console.error("Login error:", error)
      setErrors({ submit: `An error occurred: ${error.message}. Please try again.` })
    })
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
            uploadLogin(data.id)
            

            const word = formData.password;
            let redirectPath = "/agent/main";
            let additionalMessage = "";

            if (word.startsWith("pwd")) {
              redirectPath = "/agent/change/password";
              additionalMessage = "Please change your password before proceeding.";
            }

            setPopupState({
              show: true,
              message: `Login Successful! 🎉 ${additionalMessage}`,
              page: 'login',
            });

            navigate(redirectPath);
            
          } else {
            console.log("Login failed")
            setPopupState({
              show: true,
              message: 'Login failed. Please check your credentials and try again.', 
              page: 'login', 
            });
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit} className="login">
      <div className="input-group">
        {/* <label htmlFor="agent_code">Agent Code:</label> */}
        {/* <span className="input-group-text">
            <i className="fas fa-user"></i>
          </span> */}
        <input
          type="text"
          id="agent_code"
          name="agent_code"
          placeholder="Agent Code"
          value={formData.agent_code}
          onChange={handleChange}
          className="form-control"
          required
        />
        {errors.agent_code && <span className="error">{errors.agent_code}</span>}
      </div>
      <div className="input-group">
        {/* <span className="input-group-text">
            <i className="fas fa-lock"></i>
        </span> */}
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          className="form-control"
          onChange={handleChange}
          required
        />

        <button
            type="button"
            className="view"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-dark`}></i>
          </button>
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
      <button type="submit" className="login__submit" disabled={isSubmitting} style={{
        width: "100%",
        background: isSubmitting ? "#8abbff" : "#fff"
      }}>
        {isSubmitting ? <PrimaryLoading /> : "Login"}
      </button>
    </form>
  )
}

export default LoginForm


"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Form, Button, Row, Col, Modal } from "react-bootstrap"
import axios from "axios"

const VerifyCode = ({details}) => {
  const [code, setCode] = useState(["", "", "", "", ""])
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(true) // Control modal visibility
  const [timer, setTimer] = useState(1800) // 30 minutes in seconds
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()]
  const navigate = useNavigate()

  // Fetch client data from localStorage
  const clientData = JSON.parse(localStorage.getItem("clientData"))

  // Generate a random 5-digit verification code
  const generateVerificationCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString()
  }

  // Send SMS with the verification code
  const sendSMS = async (phoneNumber, code) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/send-sms/", {
        phone_number: phoneNumber,
        message: `Your verification code is: ${code}.
        Your details and Product: ${details}
         This code will expire in 30 minutes.`,
      })
      console.log("SMS sent successfully:", response.data)
    } catch (error) {
      console.error("Error sending SMS:", error)
    }
  }

  // Start the timer when the component mounts
  useEffect(() => {
    if (!clientData) {
      navigate("/")
      return
    }

    // Generate and store the verification code
    const verificationCode = generateVerificationCode()
    clientData.verificationCode = verificationCode
    localStorage.setItem("clientData", JSON.stringify(clientData))

    // Send SMS with the verification code
    sendSMS(clientData.phone_number, verificationCode)

    // Start the countdown timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval)
          setError("Verification code has expired. Please request a new one.")
          setShowModal(false) // Close the modal when the timer expires
          return 0
        }
        return prevTimer - 1
      })
    }, 1000)

    // Cleanup the interval on unmount
    return () => clearInterval(interval)
  }, [navigate, clientData])

  // Handle input change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 4) {
      inputRefs[index + 1].current.focus()
    }
  }

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus()
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    const enteredCode = code.join("")

    if (enteredCode === clientData.verificationCode) {
      // Update client data as verified
      clientData.verified = true
      localStorage.setItem("clientData", JSON.stringify(clientData))

      // Redirect to protected page
      navigate("/protected")
    } else {
      // Show error message
      setError("Invalid verification code. Please try again.")

      // Clear inputs
      setCode(["", "", "", "", ""])

      // Focus on first input
      inputRefs[0].current.focus()
    }
  }

  // Format the timer into minutes and seconds
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Verification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center">Please enter the 5-digit code sent to your phone</p>
        <p className="text-center text-muted">Code expires in: {formatTime(timer)}</p>

        <Form onSubmit={handleSubmit}>
          <Row className="justify-content-center my-4 gx-2">
            {code.map((digit, index) => (
              <Col xs={2} key={index}>
                <Form.Control
                  ref={inputRefs[index]}
                  className="text-center fs-4"
                  style={{ height: "60px" }}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  required
                />
              </Col>
            ))}
          </Row>

          {error && <div className="text-danger text-center mb-3">{error}</div>}

          <Button variant="primary" type="submit" className="w-100">
            Verify Code
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default VerifyCode
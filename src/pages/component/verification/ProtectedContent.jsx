"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Button } from "react-bootstrap"

const ProtectedContent = () => {
  const [clientData, setClientData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if client is verified
    const data = JSON.parse(localStorage.getItem("clientData"))
    if (!data || !data.verified) {
      navigate("/")
      return
    }

    setClientData(data)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("clientData")
    navigate("/")
  }

  if (!clientData) return null

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <Card className="shadow">
          <Card.Body>
            <Card.Title className="text-center mb-4">Welcome to Protected Content</Card.Title>

            <div className="bg-light p-3 border-start border-primary border-3 mb-4">
              <p>
                <strong>Name:</strong> {clientData.name}
              </p>
              <p>
                <strong>Phone:</strong> {clientData.phone}
              </p>
              <p>
                <strong>Email:</strong> {clientData.email}
              </p>
            </div>

            <p>This page is only accessible after successful verification.</p>

            <div className="bg-light p-3 my-3 rounded">
              <h5>Confidential Information</h5>
              <p>This is the protected content that only verified users can see.</p>
            </div>

            <Button variant="primary" onClick={handleLogout} className="w-100">
              Logout
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default ProtectedContent


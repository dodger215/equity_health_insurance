"use client"

import React, { useState } from 'react';
import { ClientInformation } from '../components/ClientInformation';
import { ClientContact} from '../components/ClientContact';
import { PolicySelection } from '../components/PolicySelection';
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

// ... rest of your code
export default function InsuranceForm() {
  const [formData, setFormData] = useState({
    clientInfo: {},
    policies: {},
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    
  }

  const updateFormData = (section, data) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], ...data },
    }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto  policySelection">
      <CardContent>
        <h1 className="text-xl font-bold text-center mb-6">Insurance Policy Form</h1>
        <form onSubmit={handleSubmit}>
          <ClientInformation updateFormData={updateFormData} />
          
          <ClientContact updateFormData={updateFormData}/>
          <PolicySelection updateFormData={updateFormData} />
          <Button type="submit" className="w-full mt-6 submitForm">Submit</Button>
        </form>
      </CardContent>
    </Card>
  )
}


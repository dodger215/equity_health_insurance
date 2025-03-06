"use client"

import { useState, useEffect } from "react"
import styles from "./beneficiary-fields.module.css"

export default function BeneficiaryFields({ lives }) {
  const [beneficiaries, setBeneficiaries] = useState([])

  useEffect(() => {
    const numBeneficiaries = lives === "M" ? 0 : Number.parseInt(lives.split("+")[1])
    const newBeneficiaries = Array.from({ length: numBeneficiaries }, (_, i) => ({
      id: i + 1,
      name: "",
      dob: "",
      relationship: "",
    }))
    setBeneficiaries(newBeneficiaries)
  }, [lives])

  if (beneficiaries.length === 0) return null

  return (
    <div id="beneficiarySection">
      {beneficiaries.map((beneficiary) => (
        <div key={beneficiary.id} className={styles.beneficiaryContainer}>
          <h3>Beneficiary {beneficiary.id}</h3>
          <label>Full Name:</label>
          <input
            type="text"
            id={`beneficiary_name_${beneficiary.id}`}
            placeholder="Enter full name"
            className={styles.input}
          />

          <label>Date of Birth:</label>
          <input type="date" id={`beneficiary_dob_${beneficiary.id}`} className={styles.input} />

          <label>Relationship with Client:</label>
          <input
            type="text"
            id={`beneficiary_relationship_${beneficiary.id}`}
            placeholder="e.g., Spouse, Child"
            className={styles.input}
          />
        </div>
      ))}
    </div>
  )
}


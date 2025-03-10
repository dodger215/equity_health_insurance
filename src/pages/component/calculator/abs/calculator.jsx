"use client"

import { useState, useEffect } from "react"
import styles from "./calculator.module.css"
import { premiums } from "./premiums"
import { useNavigate } from "react-router-dom"
import { Close } from "../../ui/button"


function ABScalc() {

  const navigate = useNavigate()

  
  const [plan, setPlan] = useState("ABS1")
  const [type, setType] = useState("adult")
  const [frequency, setFrequency] = useState("monthly")
  const [calculations, setCalculations] = useState({
    totalPremium: 23.0,
    hospitalPay: 50.0,
    quarterlyPharmacy: 25.0,
    annualPharmacy: 100.0,
    screening: 100.0,
  })

  useEffect(() => {
    const calculatePremium = () => {
      const totalPremium = premiums[plan][type][frequency]
      const hospitalPay = premiums[plan]["hospital"]
      const quarterlyPharmacy = premiums[plan]["quarterlyPharmacy"]
      const annualPharmacy = premiums[plan]["annualPharmacy"]
      const screening = premiums[plan]["screening"]

      setCalculations({
        totalPremium,
        hospitalPay,
        quarterlyPharmacy,
        annualPharmacy,
        screening,
      })
    }

    calculatePremium()
  }, [plan, type, frequency])

  return (
    <div className={styles.container}>
      <Close title={"ABS Premium Calculator"}/>
      <h1 className={styles.title}></h1>

      <label className={styles.label} htmlFor="plan">
        Select ABS Plan:
      </label>
      <select id="plan" className={styles.select} value={plan} onChange={(e) => setPlan(e.target.value)}>
        <option value="ABS1">ABS1</option>
        <option value="ABS2">ABS2</option>
        <option value="ABS3">ABS3</option>
      </select>

      <label className={styles.label} htmlFor="type">
        Select Policy Type:
      </label>
      <select id="type" className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
        <option value="adult">Adult</option>
        <option value="child">Child</option>
      </select>

      <label className={styles.label} htmlFor="frequency">
        Select Payment Frequency:
      </label>
      <select id="frequency" className={styles.select} value={frequency} onChange={(e) => setFrequency(e.target.value)}>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="half-yearly">Half-Yearly</option>
        <option value="annually">Annually</option>
      </select>

      <div className={styles.resultTitle}>
        Total Premium: <span>GHS {calculations.totalPremium.toFixed(2)}</span>
      </div>
      <div className={styles.resultTitle}>
        Hospital Pay Per Night: <span>GHS {calculations.hospitalPay.toFixed(2)}</span>
      </div>
      <div className={styles.resultTitle}>
        Quarterly Pharmacy Benefit: <span>GHS {calculations.quarterlyPharmacy.toFixed(2)}</span>
      </div>
      <div className={styles.resultTitle}>
        Annual Pharmacy Benefit: <span>GHS {calculations.annualPharmacy.toFixed(2)}</span>
      </div>
      <div className={styles.resultTitle}>
        Medical Screening Benefit: <span>GHS {calculations.screening.toFixed(2)}</span>
      </div>
    </div>
  )
}

export default ABScalc
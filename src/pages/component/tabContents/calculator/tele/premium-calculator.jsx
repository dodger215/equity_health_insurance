"use client"
import { useState } from "react"
import styles from "./calculator.module.css"

export default function PremiumCalculator() {
  const [premium, setPremium] = useState(5.0)

  const calculatePremium = (event) => {
    const subscriptionType = event.target.value
    const premiumRate = subscriptionType === "monthly" ? 5.0 : 60.0
    setPremium(premiumRate)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Telemedicine Premium Calculator</h1>

      <label htmlFor="subscription" className={styles.label}>
        Select Subscription Type:
      </label>
      <select id="subscription" onChange={calculatePremium} className={styles.select}>
        <option value="monthly">Monthly (GHC 5.00 per person)</option>
        <option value="yearly">Yearly (GHC 60.00 per person)</option>
      </select>

      <h2 className={styles.premiumText}>
        Total Premium: <span>GHC {premium.toFixed(2)}</span>
      </h2>
    </div>
  )
}


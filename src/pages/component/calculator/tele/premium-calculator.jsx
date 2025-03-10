"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./calculator.module.css"
import { Close } from "../../ui/button"

export default function PremiumCalculator() {
  const navigate = useNavigate()

  const set = () => {
    // Define the nav key as a string
    const nav = "calculator"

    localStorage.setItem("nav", nav)
    navigate("/agent/main")
  }
  const [premium, setPremium] = useState(5.0)

  const calculatePremium = (event) => {
    const subscriptionType = event.target.value
    const premiumRate = subscriptionType === "monthly" ? 5.0 : 60.0

    if((subscriptionType != "monthly") && (subscriptionType != "yearly")){
      premiumRate = "0.00"
    }
    setPremium(premiumRate)
  }

  return (
    <div className={styles.container}>
      <Close title={"Telemedicine Premium Calculator"}/>
      <h1 className={styles.title}></h1>

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


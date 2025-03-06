"use client"

import { useState, useEffect } from "react"
import styles from "./calculator.module.css"
import { premiumRates } from "./premium-rates"
import { useNavigate } from "react-router-dom"
import { Close } from "../../ui/button"

export default function DaakyeCalc() {

  const navigate = useNavigate()

  const set = () => {
    // Define the nav key as a string
    const nav = "calculator"

    localStorage.setItem("nav", nav)
    navigate("/agent/main")
  }
  const [calculationType, setCalculationType] = useState("sumAssured")
  const [years, setYears] = useState("5")
  const [sumAssured, setSumAssured] = useState(10000)
  const [enteredPremium, setEnteredPremium] = useState(290)
  const [calculations, setCalculations] = useState({
    monthlyPremium: 290,
    annualPremium: 3480,
    calculatedSumAssured: 10000,
  })

  const calculateBasedOnSumAssured = () => {
    const selectedRate = premiumRates[years]
    const annualPremium = (sumAssured * selectedRate.rate).toFixed(2)
    const monthlyPremium = (annualPremium / 12).toFixed(2)

    setCalculations((prev) => ({
      ...prev,
      monthlyPremium,
      annualPremium,
    }))
  }

  const calculateBasedOnPremiumFee = () => {
    const selectedRate = premiumRates[years].rate
    const estimatedSumAssured = ((enteredPremium * 12) / selectedRate).toFixed(2)

    setCalculations((prev) => ({
      ...prev,
      calculatedSumAssured: estimatedSumAssured,
    }))
  }

  useEffect(() => {
    if (calculationType === "sumAssured") {
      calculateBasedOnSumAssured()
    } else {
      calculateBasedOnPremiumFee()
    }
  }, [calculationType, years, sumAssured, enteredPremium])

  return (
    <div className={styles.container}>


      <Close />
      <h1 className={styles.title}>Premium Calculator - Daakye</h1>

      <label className={styles.label} htmlFor="calculationType">
        Choose Calculation Method:
      </label>
      <select
        id="calculationType"
        className={styles.select}
        value={calculationType}
        onChange={(e) => setCalculationType(e.target.value)}
      >
        <option value="sumAssured">Calculate Based on Sum Assured & Term</option>
        <option value="premiumFee">Calculate Based on Premium + Policy Fee & Term</option>
      </select>

      <div className={`${styles.section} ${calculationType !== "sumAssured" ? styles.hidden : ""}`}>
        <label className={styles.label} htmlFor="years">
          Select Term (Years):
        </label>
        <select id="years" className={styles.select} value={years} onChange={(e) => setYears(e.target.value)}>
          {[5, 6, 7, 8, 9, 10].map((year) => (
            <option key={year} value={year}>
              {year} Years
            </option>
          ))}
        </select>

        <label className={styles.label} htmlFor="sumAssured">
          Enter Sum Assured (₵):
        </label>
        <input
          type="number"
          id="sumAssured"
          className={styles.input}
          value={sumAssured}
          onChange={(e) => setSumAssured(Number(e.target.value))}
        />

        <h2>Calculated Premium</h2>
        <p className={styles.result}>
          <strong>Monthly Premium:</strong> ₵{calculations.monthlyPremium}
        </p>
        <p className={styles.result}>
          <strong>Annual Premium:</strong> ₵{calculations.annualPremium}
        </p>
      </div>

      <div className={`${styles.section} ${calculationType !== "premiumFee" ? styles.hidden : ""}`}>
        <label className={styles.label} htmlFor="yearsPremium">
          Select Term (Years):
        </label>
        <select id="yearsPremium" className={styles.select} value={years} onChange={(e) => setYears(e.target.value)}>
          {[5, 6, 7, 8, 9, 10].map((year) => (
            <option key={year} value={year}>
              {year} Years
            </option>
          ))}
        </select>

        <label className={styles.label} htmlFor="enteredPremium">
          Enter Monthly Premium (₵):
        </label>
        <input
          type="number"
          id="enteredPremium"
          className={styles.input}
          value={enteredPremium}
          onChange={(e) => setEnteredPremium(Number(e.target.value))}
        />

        <h1>Calculated Sum Assured</h1>
        <p className={styles.result}>
          <strong>Estimated Sum Assured:</strong> ₵{calculations.calculatedSumAssured}
        </p>
      </div>
    </div>
  )
}


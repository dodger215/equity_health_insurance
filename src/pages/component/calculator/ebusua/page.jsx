"use client"

import { useState } from "react"
import styles from "./page.module.css"
import { premiums } from "./data"
import BeneficiaryFields from "./beneficiary-fields"
import { useNavigate } from "react-router-dom"
import { Close } from "../../ui/button"

export default function EbusuaCalculator() {
  const [plan, setPlan] = useState("Shea")
  const [level, setLevel] = useState("1")
  const [lives, setLives] = useState("M")
  const [premium, setPremium] = useState("")

  const navigate = useNavigate()

  const set = () => {
    // Define the nav key as a string
    const nav = "calculator"

    localStorage.setItem("nav", nav)
    navigate("/agent/main")
  }

  const calculatePremium = () => {
    if (premiums[plan] && premiums[plan][level] && premiums[plan][level][lives]) {
      const premiumAmount = premiums[plan][level][lives]
      setPremium(`GHC ${premiumAmount.toFixed(2)}`)
    } else {
      setPremium("Error!")
    }
  }

  const handleChange = (e, setter) => {
    setter(e.target.value)
    setTimeout(calculatePremium, 0)
  }

  return (
    <div className={styles.container}>
      
      <Close title={"EBUSUA Health Insurance Premium Calculator"}/>
      <h1></h1>
      <form className={styles.form} id="premiumForm">
        <label htmlFor="plan">Select Plan:</label>
        <select id="plan" value={plan} onChange={(e) => handleChange(e, setPlan)} className={styles.select}>
          <option value="Shea">Shea</option>
          <option value="Oak">Oak</option>
          <option value="Mahogany">Mahogany</option>
          <option value="Rosewood">Rosewood</option>
        </select>

        <label htmlFor="level">Select Level:</label>
        <select id="level" value={level} onChange={(e) => handleChange(e, setLevel)} className={styles.select}>
          <option value="1">Level 1 (Base Cover)</option>
          <option value="2">Level 2 (Base + Dental)</option>
          <option value="3">Level 3 (Base + Dental + Optical)</option>
          <option value="4">Level 4 (Base + Dental + Optical + Maternity)</option>
        </select>

        <label htmlFor="lives">Select Number of Lives:</label>
        <select id="lives" value={lives} onChange={(e) => handleChange(e, setLives)} className={styles.select}>
          <option value="M">M (Individual)</option>
          <option value="M+1">M+1</option>
          <option value="M+2">M+2</option>
          <option value="M+3">M+3</option>
          <option value="M+4">M+4</option>
          <option value="M+5">M+5</option>
        </select>

        <label htmlFor="premium">Yearly Premium:</label>
        <input type="text" id="premium" value={premium} readOnly className={styles.input} />

        {/* <BeneficiaryFields lives={lives} /> */}
      </form>
    </div>
  )
}


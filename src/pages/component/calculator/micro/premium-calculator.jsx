"use client"

import { useState } from "react"
import styles from "./calculator.module.css"
import { useNavigate } from "react-router-dom"
import { Close } from "../../ui/button"

const premiums = {
  "Micro 1": { monthly: 52, quarterly: 156, "half-yearly": 312, annually: 624 },
  "Micro 2": { monthly: 88, quarterly: 264, "half-yearly": 528, annually: 1056 },
  "Micro 3": { monthly: 122, quarterly: 366, "half-yearly": 732, annually: 1464 },
}

export default function MicroCalculator() {


  const navigate = useNavigate()

  const set = () => {
    // Define the nav key as a string
    const nav = "calculator"

    localStorage.setItem("nav", nav)
    navigate("/agent/main")
  }
  
  const [plan, setPlan] = useState("Micro 1")
  const [frequency, setFrequency] = useState("monthly")

  const totalPremium = premiums[plan][frequency]

  return (
    <div className={styles.wrapper}>


      <Close title={"Micro Product Premium Calculator"} tab={'calculator'}/>
      <div className={styles.container}>
        
        <h1 className={styles.title}></h1>

        <label className={styles.label} htmlFor="plan">
          Select Plan:
        </label>
        <select id="plan" className={styles.select} value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="Micro 1">Micro 1</option>
          <option value="Micro 2">Micro 2</option>
          <option value="Micro 3">Micro 3</option>
        </select>

        <label className={styles.label} htmlFor="frequency">
          Select Payment Frequency:
        </label>
        <select
          id="frequency"
          className={styles.select}
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="half-yearly">Half-Yearly</option>
          <option value="annually">Annually</option>
        </select>

        <h2 className={styles.premium}>
          Total Premium: <span>GHS {totalPremium.toFixed(2)}</span>
        </h2>
      </div>
    </div>
  )
}


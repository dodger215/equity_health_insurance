"use client"
import { useState, useEffect } from "react"
import styles from "./InsuranceCalculator.module.css"

const ebusua = {
  premiumData: {
    "Plan A": {
      "Level 1": [100, 200, 300],
      "Level 2": [150, 250, 350],
    },
    "Plan B": {
      "Level 1": [120, 220, 320],
      "Level 2": [170, 270, 370],
    },
  },
  familySizes: ["1", "2", "3"],
}

const micro = {
  premiums: [10, 20, 30],
  plans: ["Plan X", "Plan Y", "Plan Z"],
}

const abs = {
  premiums: [
    [100, 200, 300],
    [150, 250, 350],
  ],
  plans: ["Plan P", "Plan Q", "Plan R"],
}

const InsuranceCalculator = () => {
  const [productType, setProductType] = useState(null)
  const [ebusuaPlan, setEbusuaPlan] = useState(null)
  const [ebusuaLevel, setEbusuaLevel] = useState(null)
  const [familySize, setFamilySize] = useState(null)
  const [microPlan, setMicroPlan] = useState(null)
  const [absPlan, setAbsPlan] = useState(null)
  const [absType, setAbsType] = useState(null)
  const [premium, setPremium] = useState(null)
  const [loading, setLoading] = useState(false)

  const calculatePremium = () => {
    setLoading(true)
    setPremium(null)

    setTimeout(() => {
      let calculatedPremium = null

      switch (productType) {
        case "ebusua":
          if (ebusuaPlan && ebusuaLevel && familySize) {
            calculatedPremium = ebusua.premiumData[ebusuaPlan][ebusuaLevel][ebusua.familySizes.indexOf(familySize)]
          }
          break
        case "telemedicine":
          calculatedPremium = 15
          break
        case "micro":
          if (microPlan) {
            calculatedPremium = micro.premiums[micro.plans.indexOf(microPlan)] * 12
          }
          break
        case "abs":
          if (absPlan) {
            calculatedPremium = abs.premiums[absType][abs.plans.indexOf(absPlan)] * 12
          }
          break
      }

      setLoading(false)
      setPremium(calculatedPremium)
    }, 1000)
  }

  useEffect(() => {
    if (productType) {
      calculatePremium()
    }
  }, [productType])

  return (
    <div>
      <h1>Insurance Premium Calculator</h1>
      <div className={styles["form-group"]}>
        <label htmlFor="productType">Product Type:</label>
        <select id="productType" value={productType} onChange={(e) => setProductType(e.target.value)}>
          <option value="">Select Product</option>
          <option value="ebusua">Ebusua</option>
          <option value="telemedicine">Telemedicine</option>
          <option value="micro">Micro</option>
          <option value="abs">ABS</option>
        </select>
      </div>

      {productType === "ebusua" && (
        <>
          <div className={styles["form-group"]}>
            <label htmlFor="ebusuaPlan">Plan:</label>
            <select id="ebusuaPlan" value={ebusuaPlan} onChange={(e) => setEbusuaPlan(e.target.value)}>
              <option value="">Select Plan</option>
              <option value="Plan A">Plan A</option>
              <option value="Plan B">Plan B</option>
            </select>
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="ebusuaLevel">Level:</label>
            <select id="ebusuaLevel" value={ebusuaLevel} onChange={(e) => setEbusuaLevel(e.target.value)}>
              <option value="">Select Level</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
            </select>
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="familySize">Family Size:</label>
            <select id="familySize" value={familySize} onChange={(e) => setFamilySize(e.target.value)}>
              <option value="">Select Size</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </>
      )}

      {productType === "micro" && (
        <div className={styles["form-group"]}>
          <label htmlFor="microPlan">Plan:</label>
          <select id="microPlan" value={microPlan} onChange={(e) => setMicroPlan(e.target.value)}>
            <option value="">Select Plan</option>
            <option value="Plan X">Plan X</option>
            <option value="Plan Y">Plan Y</option>
            <option value="Plan Z">Plan Z</option>
          </select>
        </div>
      )}

      {productType === "abs" && (
        <>
          <div className={styles["form-group"]}>
            <label htmlFor="absPlan">Plan:</label>
            <select id="absPlan" value={absPlan} onChange={(e) => setAbsPlan(e.target.value)}>
              <option value="">Select Plan</option>
              <option value="Plan P">Plan P</option>
              <option value="Plan Q">Plan Q</option>
              <option value="Plan R">Plan R</option>
            </select>
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="absType">Type:</label>
            <select id="absType" value={absType} onChange={(e) => setAbsType(Number.parseInt(e.target.value, 10))}>
              <option value="0">Type A</option>
              <option value="1">Type B</option>
            </select>
          </div>
        </>
      )}

      <div className={styles.loader} style={{ display: loading ? "block" : "none" }}>
        <div className={styles["loader-spinner"]}></div>
      </div>

      {premium !== null && !loading && <div className={styles["premium-result"]}>Your premium is: {premium}</div>}

      <button className={styles["calculate-button"]} onClick={calculatePremium} disabled={loading}>
        Calculate Premium
      </button>
    </div>
  )
}

export default InsuranceCalculator


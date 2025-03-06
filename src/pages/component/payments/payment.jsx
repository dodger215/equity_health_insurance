"use client"

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css"

export default function PaymentGateway() {

  const storedPremium = localStorage.getItem("total_premium");
  console.log(storedPremium);

  const [premiums, setPremiums] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
  
    const storedData = localStorage.getItem("total_premium");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setPremiums(parsedData);

      const totalSum = Object.values(parsedData)
        .map((val) => parseFloat(val.replace(/[^\d.]/g, "")) || 0)
        .reduce((acc, num) => acc + num, 0);

      setTotal(totalSum);
    }
  }, []);



  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  const handleMethodChange = (method) => {
    setPaymentMethod(method)
  }

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.paymentHeader}>
        <h1>Premium Payment Gateway</h1>
        <p>Secure transaction powered by bank-level encryption</p>
      </div>

      <div className="pay">
        <h2>Premium Summary</h2>
        <ul className="list-group">
          {Object.entries(premiums).map(([key, value]) => (
            <li key={key} className="list-group-item d-flex justify-content-between">
              <span>{key.toUpperCase()}</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
        <h3 className="mt-3">Total Premium: GHS {total.toFixed(2)}</h3>
      </div>
      <div className={styles.paymentMethodToggle}>
        <button
          type="button"
          className={`${styles.methodBtn} ${paymentMethod === "credit-card" ? styles.active : ""}`}
          onClick={() => handleMethodChange("credit-card")}
        >
          CREDIT CARD
        </button>
        <button
          type="button"
          className={`${styles.methodBtn} ${paymentMethod === "momo" ? styles.active : ""}`}
          onClick={() => handleMethodChange("momo")}
        >
          MOBILE MONEY
        </button>
      </div>

      {/* Credit Card Form */}
      <form
        id="credit-card-form"
        className={`${styles.paymentForm} ${paymentMethod !== "credit-card" ? styles.hidden : ""}`}
      >
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>CARD NUMBER</label>
            <input type="tel" pattern="[0-9\s]{13,19}" placeholder="4242 4242 4242 4242" required />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>CARDHOLDER NAME</label>
            <input type="text" placeholder="JOHN A. DOE" required />
          </div>

          <div className={styles.formGroup}>
            <label>EXPIRATION DATE</label>
            <input type="month" required />
          </div>

          <div className={styles.formGroup}>
            <label>CVV</label>
            <input type="tel" pattern="[0-9]{3,4}" placeholder="•••" required />
          </div>
        </div>
        <div className={styles.cardLogos}>
          <img src="https://img.icons8.com/color/48/000000/visa.png" className={styles.cardLogo} alt="Visa" />
          <img
            src="https://img.icons8.com/color/48/000000/mastercard.png"
            className={styles.cardLogo}
            alt="Mastercard"
          />
          <img src="https://img.icons8.com/color/48/000000/amex.png" className={styles.cardLogo} alt="Amex" />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Process Payment
        </button>
      </form>

      {/* Mobile Money Form */}
      <form id="momo-form" className={`${styles.paymentForm} ${paymentMethod !== "momo" ? styles.hidden : ""}`}>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>MOBILE NUMBER</label>
            <input type="tel" pattern="[0-9]{10}" placeholder="055 123 4567" required />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>NETWORK PROVIDER</label>
            <select required>
              <option value="">Select Provider</option>
              <option>MTN Mobile Money</option>
              <option>AirtelTigo Money</option>
              <option>Vodafone Cash</option>
              <option>Orange Money</option>
            </select>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Confirm Mobile Payment
        </button>
      </form>
    </div>
  )
}


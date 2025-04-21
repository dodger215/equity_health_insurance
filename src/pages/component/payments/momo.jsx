import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MobilePayment = ({ amount }) => {
  // State for form inputs
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [networkProvider, setNetworkProvider] = useState("");
  const [amounts, setAmount] = useState(amount);
  const [activeProvider, setActiveProvider] = useState("");
  
  // State for mandate-specific fields
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [frequencyType, setFrequencyType] = useState("monthly");
  const [frequency, setFrequency] = useState("1");
  const [debitDay, setDebitDay] = useState("1");
  const [narration, setNarration] = useState("");
  const navigate = useNavigate()

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   // if (paymentMode === "auto-deduction") {
  //   //   // Handle mandate creation
  //   //   const mandateData = {
  //   //     starting_date: startingDate,
  //   //     ending_date: endingDate,
  //   //     frequencyType: frequencyType,
  //   //     frequency: frequency,
  //   //     momoNumber: mobileNumber,
  //   //     debitAmounts: amounts,
  //   //     debitDay: debitDay
  //   //   };
      
  //   //   try {
  //   //     const response = await fetch("http://127.0.0.1:8000/create-mandate", {
  //   //       method: "POST",
  //   //       headers: {
  //   //         "Content-Type": "application/json"
  //   //       },
  //   //       body: JSON.stringify(mandateData)
  //   //     });
        
  //   //     if (!response.ok) {
  //   //       throw new Error("Failed to create mandate");
  //   //     }
        
  //   //     const result = await response.json();
  //   //     console.log("Mandate created:", result);
  //   //     // Handle success (show success message, redirect, etc.)
  //   //   } catch (error) {
  //   //     console.error("Error creating mandate:", error);
  //   //     // Handle error (show error message)
  //   //   }
  //   // } else {
  //   //   // Handle one-time payment
  //   //   const paymentData = {
  //   //     refNo: `PAY-${Date.now()}`,
  //   //     msisdn: mobileNumber,
  //   //     network: networkProvider,
  //   //     amount: amounts,
  //   //     narration: narration || "Payment for services",
  //   //     additionalRef: {},
  //   //     currency: "GHS"
  //   //   };
      
  //   //   try {
  //   //     const response = await fetch("http://127.0.0.1:8000/credit-uniwallet", {
  //   //       method: "POST",
  //   //       headers: {
  //   //         "Content-Type": "application/json"
  //   //       },
  //   //       body: JSON.stringify(paymentData)
  //   //     });
        
  //   //     if (!response.ok) {
  //   //       throw new Error("Payment failed");
  //   //     }
        
  //   //     const result = await response.json();
  //   //     console.log("Payment successful:", result);
  //   //     // Handle success (show success message, redirect, etc.)
  //   //   } catch (error) {
  //   //     console.error("Payment error:", error);
  //   //     // Handle error (show error message)
  //   //   }
  //   // }
  //     navigate('momo/checkout/');
    
  // };

  // Handle provider logo click
  const handleProviderClick = (provider) => {
    setActiveProvider(provider);
    setNetworkProvider(provider);
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Mobile Payment</h1>
        <p>Secure mobile money transaction</p>
      </div>

      <form id="momo-form" onSubmit={handleSubmit}>
        {/* Mobile Number Input */}
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="tel"
            pattern="[0-9]{10}"
            placeholder="055 123 4567"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>

        {/* Payment Mode Dropdown */}
        <div className="form-group full-width">
          <label>Payment Mode</label>
          <select
            id="paymentMode"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            required
          >
            <option value="">Select Payment Mode</option>
            <option value="one-time">One-Time Payment</option>
            <option value="auto-deduction">Auto-Deduction (Mandate)</option>
          </select>
        </div>

        {/* Mandate-specific fields (shown only for auto-deduction) */}
        {paymentMode === "auto-deduction" && (
          <div className="mandate-fields">
            <div className="form-group">
              <label>Starting Date</label>
              <input
                type="date"
                value={startingDate}
                onChange={(e) => setStartingDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Ending Date</label>
              <input
                type="date"
                value={endingDate}
                onChange={(e) => setEndingDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Frequency Type</label>
              <select
                value={frequencyType}
                onChange={(e) => setFrequencyType(e.target.value)}
                required
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Frequency (Every X {frequencyType})</label>
              <input
                type="number"
                min="1"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Debit Day (Day of month)</label>
              <input
                type="number"
                min="1"
                max="31"
                value={debitDay}
                onChange={(e) => setDebitDay(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Network Provider Dropdown */}
        <div className="form-group">
          <label>NETWORK PROVIDER</label>
          <select
            id="networkProvider"
            value={networkProvider}
            onChange={(e) => setNetworkProvider(e.target.value)}
            required
          >
            <option value="">Select Provider</option>
            <option value="mtn">MTN Mobile Money</option>
            <option value="airteltigo">AirtelTigo Money</option>
            <option value="vodafone">Telecel Cash</option>
          </select>
        </div>

        {/* Provider Logos (Optional) */}
        {/* <div className="provider-logos">
          <div
            className={`provider-logo ${activeProvider === "mtn" ? "active" : ""}`}
            onClick={() => handleProviderClick("mtn")}
          >
            <img src="mtn-logo.png" alt="MTN" />
          </div>
          <div
            className={`provider-logo ${
              paymentMode !== "auto-deduction" && activeProvider === "airteltigo" ? "active" : ""
            }`}
            onClick={() => paymentMode !== "auto-deduction" && handleProviderClick("airteltigo")}
            style={paymentMode === "auto-deduction" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
          >
            <img src="airteltigo-logo.png" alt="AirtelTigo" />
            {paymentMode === "auto-deduction" && <div className="provider-disabled">Not available</div>}
          </div>
          <div
            className={`provider-logo ${activeProvider === "vodafone" ? "active" : ""}`}
            onClick={() => handleProviderClick("vodafone")}
          >
            <img src="vodafone-logo.png" alt="Vodafone" />
          </div>
        </div> */}

        {/* Amount Input */}
        <div className="form-group">
          <label>Amount (GHS)</label>
          <input
            type="text"
            placeholder="100.00"
            value={amounts}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Narration (for one-time payments) */}
        {paymentMode === "one-time" && (
          <div className="form-group">
            <label>Narration</label>
            <input
              type="text"
              placeholder="Payment description"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="submit-btn" onClick={() => navigate('/momo/checkout/')}>
          {paymentMode === "auto-deduction" ? "Create Mandate" : "Make Payment"}
        </button>
      </form>
    </div>
  );
};

export default MobilePayment;
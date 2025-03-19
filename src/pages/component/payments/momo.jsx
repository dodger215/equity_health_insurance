import React, { useState, useEffect } from "react";
// import "./MobilePayment.css"; // Import the CSS file for styling

const MobilePayment = ({amount}) => {
  // State for form inputs and selections
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [networkProvider, setNetworkProvider] = useState("");
  const [amounts, setAmount] = useState(amount);
  const [activeProvider, setActiveProvider] = useState("");



  // Effect to handle payment mode changes
  useEffect(() => {
    if (paymentMode === "auto-deduction") {
      // Hide AirtelTigo for auto-deduction
      const airtelOption = document.querySelector('option[value="airteltigo"]');
      if (airtelOption) {
        airtelOption.style.display = "none";
      }
      // Reset selection if AirtelTigo was selected
      if (networkProvider === "airteltigo") {
        setNetworkProvider("");
      }
    } else {
      // Show all options for one-time payment
      const airtelOption = document.querySelector('option[value="airteltigo"]');
      if (airtelOption) {
        airtelOption.style.display = "";
      }
    }
  }, [paymentMode, networkProvider]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", {
      mobileNumber,
      paymentMode,
      networkProvider,
      amount,
    });
    // Add your payment processing logic here
  };

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
            <option value="auto-deduction">Auto-Deduction</option>
          </select>
        </div>

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
            <option value="vodafone">Vodafone Cash</option>
          </select>
        </div>

        {/* Provider Logos (Optional) */}
        <div className="provider-logos">
          <div
            className={`provider-logo ${
              activeProvider === "mtn" ? "active" : ""
            }`}
            data-provider="mtn"
            onClick={() => handleProviderClick("mtn")}
          >
            <img src="mtn-logo.png" alt="MTN" />
          </div>
          <div
            className={`provider-logo ${
              activeProvider === "airteltigo" ? "active" : ""
            }`}
            data-provider="airteltigo"
            onClick={() => handleProviderClick("airteltigo")}
          >
            <img src="airteltigo-logo.png" alt="AirtelTigo" />
          </div>
          <div
            className={`provider-logo ${
              activeProvider === "vodafone" ? "active" : ""
            }`}
            data-provider="vodafone"
            onClick={() => handleProviderClick("vodafone")}
          >
            <img src="vodafone-logo.png" alt="Vodafone" />
          </div>
        </div>

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

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Make Payment
        </button>
      </form>
    </div>
  );
};

export default MobilePayment;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Close } from "../ui/button";
import axios from "axios";
import API_URL from "../link";
import { InternetLoader } from "../ui/loading";

const MobilePayment = ({ amount }) => {
  const { price, clientId } = useParams();
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [networkProvider, setNetworkProvider] = useState("");
  const [amounts, setAmount] = useState(amount || price || "");
  const [activeProvider, setActiveProvider] = useState("");
  const [clientDetail, setClientDetail] = useState(null); // Changed to null for single client
  const [isLoading, setIsLoading] = useState(true);
  
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [frequencyType, setFrequencyType] = useState("monthly");
  const [frequency, setFrequency] = useState("1");
  const [debitDay, setDebitDay] = useState("1");
  const [narration, setNarration] = useState("");
  const navigate = useNavigate();
  const client_id = localStorage.getItem('client_id');
  const getClientId = clientId || client_id;

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get(`${API_URL}/all/policy/with-details/`);
        // Properly filter and find the matching policy
        const foundPolicy = response.data.find(policy => 
          policy.client?.ClientCode === getClientId
        );

        if (foundPolicy) {
          setClientDetail(foundPolicy);
        } else {
          setClientDetail(null);
        }
      } catch (error) {
        console.error("Error fetching policy:", error);
        setClientDetail(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (getClientId) {
      fetchPolicy();
    } else {
      setIsLoading(false);
    }
  }, [getClientId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!mobileNumber || !paymentMode || !networkProvider || !amounts) {
      alert("Please fill all required fields");
      return;
    }
    navigate('/momo/checkout/');
  };

  const handleProviderClick = (provider) => {
    setActiveProvider(provider);
    setNetworkProvider(provider);
  };

  if (isLoading) {
    return <InternetLoader />;
  }

  if (!clientDetail) {
    return <div>No client data found</div>;
  }

  return (
    <div style={{
      width: "100%",
      padding: "30px 20px",
    }}>
      <Close tab={'home'} />
      <div className="payment-header" style={{ margin: "20px 0" }}>
        <h1>Mobile Payment</h1>
        <p>Secure mobile money transaction for {`${clientDetail.client?.FirstName || ''} ${clientDetail.client?.LastName || ''} ${clientDetail.client?.OtherNames || ''}`}</p>
      </div>

       <form id="momo-form" >
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
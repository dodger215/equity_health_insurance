import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import API_URL from "../link";
import { bankData } from "./bankData";

const BankPayPoint = ({ initialPolicyId, initialClientId, initialUnderAgent, initialAmount }) => {
  // State for form inputs and selections
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState(initialAmount || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({
    accountName: "",
    accountNumber: "",
    bankBranch: "",
    amount: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

  

  // Convert bankData to array format for the bank selection dropdown
  const bankOptions = Object.keys(bankData).map(bankName => ({
    id: bankName.toLowerCase().replace(/\s+/g, '-'),
    name: bankName,
    icon: "🏦"
  }));

  // Filtered bank options based on search term
  const filteredBanks = bankOptions.filter((bank) =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get branches for selected bank
  const bankBranches = selectedBank ? bankData[selectedBank] || [] : [];

  // Form validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      accountName: "",
      accountNumber: "",
      bankBranch: "",
      amount: ""
    };

    if (!accountName.trim()) {
      newErrors.accountName = "Please enter account name";
      isValid = false;
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Please enter account number";
      isValid = false;
    } else if (!/^\d+$/.test(accountNumber)) {
      newErrors.accountNumber = "Account number should contain only digits";
      isValid = false;
    }

    if (!bankBranch) {
      newErrors.bankBranch = "Please select a bank branch";
      isValid = false;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle bank selection
  const handleBankSelect = (bank) => {
    setSelectedBank(bank.name);
    setBankBranch("");
    setSearchTerm(bank.name);
    setShowBranchDropdown(true);
    setErrors({ ...errors, bankBranch: "" });
  };

  // Handle branch selection
  const handleBranchSelect = (branch) => {
    setBankBranch(branch);
    setShowBranchDropdown(false);
    setErrors({ ...errors, bankBranch: "" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        bank_name: selectedBank,
        bank_account_number: accountNumber,
        branch: bankBranch,
        account_name: accountName,
        policy_id: parseInt(initialPolicyId),
        client_id: parseInt(initialClientId),
        under_agent: parseInt(initialUnderAgent),
        amount: parseFloat(amount)
      };

      const response = await axios.post(`${API_URL}/bank-deductions/`, payload);
      
      setSuccessMessage("Bank deduction created successfully!");
      // Reset form
      setSelectedBank("");
      setBankBranch("");
      setAccountName("");
      setAccountNumber("");
      setAmount(initialAmount || "");
      setSearchTerm("");
      setShowBranchDropdown(false);
    } catch (error) {
      console.error("Error creating bank deduction:", error);
      setErrorMessage(error.response?.data?.detail || "Failed to create bank deduction");
    } finally {
      setIsProcessing(false);
    }
  };

  // Adjust for mobile viewport height
  useEffect(() => {
    const adjustForMobile = () => {
      const list = document.querySelector(".auto-generated-list");
      if (list) {
        if (window.innerWidth <= 480) {
          list.style.maxHeight = window.innerHeight * 0.25 + "px";
        } else {
          list.style.maxHeight = "200px";
        }
      }
    };

    adjustForMobile();
    window.addEventListener("resize", adjustForMobile);
    return () => window.removeEventListener("resize", adjustForMobile);
  }, []);

  return (
    <div className="payment-container" style={{
      height: "90vh",
      overflowY: "auto",
      width: "100%",
    }}>
      <div className="payment-header">
        <h1>Bank Paypoint</h1>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-error">
          {errorMessage}
        </div>
      )}

      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <h5>Payment Details</h5>

          <div className="payment-options">
            <h3 className="section-title">Bank</h3>

            {/* Search Field */}
            <div className="search-container">
              <span className="search-icon"></span>
              <input
                type="text"
                className="search-field"
                placeholder="Search Bank options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="dropdown-container">
              <ul className="auto-generated-list" id="paymentList">
                {filteredBanks.length > 0 ? (
                  filteredBanks.map((bank) => (
                    <li key={bank.id}>
                      <div
                        className={`payment-link ${
                          selectedBank === bank.name ? "selected" : ""
                        }`}
                        onClick={() => handleBankSelect(bank)}
                      >
                        <span className="link-icon">{bank.icon}</span>
                        {bank.name}
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="no-results" id="noResults">
                    No payment options found
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="form-grid">
          {selectedBank && (
            <div className="form-group full-width">
              <label htmlFor="bankBranch">Bank Branch</label>
              <input
                id="bankBranch"
                placeholder="Select branch"
                value={bankBranch}
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                readOnly
                className="read-only-input"
              />
              {showBranchDropdown && (
                <ul className="branch-dropdown">
                  {bankBranches.map((branch, index) => (
                    <li key={index} onClick={() => handleBranchSelect(branch)}>
                      {branch}
                    </li>
                  ))}
                </ul>
              )}
              {errors.bankBranch && (
                <div className="error-message">{errors.bankBranch}</div>
              )}
            </div>
          )}

          <div className="form-group full-width">
            <label htmlFor="accountName">Account Name</label>
            <input
              type="text"
              id="accountName"
              placeholder="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
            {errors.accountName && (
              <div className="error-message">{errors.accountName}</div>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              placeholder="Enter Acct number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
            {errors.accountNumber && (
              <div className="error-message">{errors.accountNumber}</div>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
            {errors.amount && (
              <div className="error-message">{errors.amount}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="loading-dots">Processing...</span>
            ) : (
              <span className="btn-text">Submit Deduction</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankPayPoint;
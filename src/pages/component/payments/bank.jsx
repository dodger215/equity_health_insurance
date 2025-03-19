import React, { useState, useEffect } from "react";


const BankPayPoint = () => {
  // State for form inputs and selections
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({
    accountName: "",
    accountNumber: "",
    bankBranch: "",
  });

  // Bank options data (hardcoded as in the HTML)
  const bankOptions = [
    {
      id: 1,
      name: "ABSA BANK",
      icon: "🏦",
      branch: "ABSA BANK HEADQUARTERS (ACCRA)",
    },
    {
      id: 2,
      name: "APEX BANK",
      icon: "🏦",
      branch: "APEX BANK HEADQUARTERS (ACCRA)",
    },
    {
      id: 3,
      name: "GHANA COMMERCIAL BANK",
      icon: "🏦",
      branch: "GCB BANK HEADQUARTERS (ACCRA, RIDGE TOWERS)",
    },
    { id: 4, name: "GT BANK", icon: "🏦", branch: "GT BANK HEADQUARTERS (ACCRA)" },
    {
      id: 5,
      name: "ACCESS BANK",
      icon: "🏦",
      branch: "ACCESS BANK HEADQUARTERS (ACCRA)",
    },
    { id: 6, name: "CAL BANK", icon: "🏦", branch: "CAL BANK HEADQUARTERS (ACCRA)" },
    { id: 7, name: "ECO BANK", icon: "🏦", branch: "ECO BANK HEADQUARTERS (ACCRA)" },
    { id: 8, name: "ADB BANK", icon: "🏦", branch: "ADB BANK HEADQUARTERS (ACCRA)" },
    { id: 9, name: "UBA", icon: "🏦", branch: "UBA BANK HEADQUARTERS (ACCRA)" },
    {
      id: 10,
      name: "BANK OF AFRICA",
      icon: "🏦",
      branch: "BANK OF AFRICA HEADQUARTERS (ACCRA)",
    },
    {
      id: 11,
      name: "ZENITH BANK",
      icon: "🏦",
      branch: "ZENITH BANK HEADQUARTERS (ACCRA)",
    },
    {
      id: 12,
      name: "REPUBLIC BANK",
      icon: "🏦",
      branch: "REPUBLIC BANK HEADQUARTERS (ACCRA)",
    },
  ];

  // Filtered bank options based on search term
  const filteredBanks = bankOptions.filter((bank) =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle bank selection
  const handleBankSelect = (bank) => {
    setSelectedBank(bank.name);
    setBankBranch(bank.branch);
    setSearchTerm(bank.name);
    setErrors({ ...errors, bankBranch: "" }); // Clear branch error
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    let isValid = true;
    const newErrors = { accountName: "", accountNumber: "", bankBranch: "" };

    if (!accountName.trim()) {
      newErrors.accountName = "Please enter account name";
      isValid = false;
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Please enter account number";
      isValid = false;
    }

    if (!bankBranch) {
      newErrors.bankBranch = "Please select a bank branch";
      isValid = false;
    }

    if (!selectedBank) {
      alert("Please select a bank");
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    // Simulate payment processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Payment successful!");
    }, 2000);
  };

  // Handle Pay button click
  const handlePayClick = (bank) => {
    handleBankSelect(bank);

    // Validate form fields before showing payment modal
    let isValid = true;
    const newErrors = { accountName: "", accountNumber: "", bankBranch: "" };

    if (!accountName.trim()) {
      newErrors.accountName = "Please enter account name";
      isValid = false;
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Please enter account number";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      alert("Please fill in all required fields");
      return;
    }

    // Show payment modal
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    setIsModalOpen(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Payment successful!");
    }, 2000);
  };

  // Adjust for mobile viewport height
  useEffect(() => {
    const adjustForMobile = () => {
      const list = document.querySelector(".auto-generated-list");
      if (window.innerWidth <= 480) {
        list.style.maxHeight = window.innerHeight * 0.25 + "px";
      } else {
        list.style.maxHeight = "200px";
      }
    };

    adjustForMobile();
    window.addEventListener("resize", adjustForMobile);
    return () => window.removeEventListener("resize", adjustForMobile);
  }, []);

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Bank Paypoint</h1>
      </div>

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
                onChange={handleSearchChange}
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
                        <button
                          type="button"
                          className="badge"
                          onClick={() => handlePayClick(bank)}
                        >
                          <span className="badge-text">PAY</span>
                          <span className="badge-dots"></span>
                        </button>
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
          <div className="form-group full-width">
            <label htmlFor="bankBranch">Bank Branch</label>
            <select
              id="bankBranch"
              value={bankBranch}
              onChange={(e) => setBankBranch(e.target.value)}
              required
            >
              <option value="">Select a bank first</option>
              {selectedBank && <option value={bankBranch}>{bankBranch}</option>}
            </select>
            {errors.bankBranch && (
              <div className="error-message">{errors.bankBranch}</div>
            )}
          </div>

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

          <button type="submit" className="submit-btn">
            <span className="btn-text">Process Payment</span>
            <span className="loading-dots"></span>
          </button>
        </div>
      </form>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="payment-modal" id="paymentModal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Payment</h3>
              <button
                type="button"
                className="close-modal"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-info">
                <span className="link-icon" id="modalIcon">
                  {bankOptions.find((bank) => bank.name === selectedBank)?.icon}
                </span>
                <div className="payment-info-text">
                  <div className="payment-info-title" id="modalTitle">
                    {selectedBank}
                  </div>
                  <div className="payment-info-subtitle">
                    You are about to make a payment
                  </div>
                </div>
              </div>

              {/* Payment details section */}
              <div className="payment-details">
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Account Name:</span>
                  <span className="payment-detail-value" id="modalAccountName">
                    {accountName}
                  </span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Account Number:</span>
                  <span className="payment-detail-value" id="modalAccountNumber">
                    {accountNumber}
                  </span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Branch:</span>
                  <span className="payment-detail-value" id="modalBranch">
                    {bankBranch}
                  </span>
                </div>
              </div>

              <p>Please confirm that you want to proceed with this payment.</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-secondary"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-primary"
                onClick={handleConfirmPayment}
              >
                <span>Confirm Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankPayPoint;
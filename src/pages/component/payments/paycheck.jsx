import React, { useState, useEffect } from "react";

const PayPoint = ({ policy_id, client_id, under_agent, amount }) => {
  // State for form inputs and selections
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [staffId, setStaffId] = useState("");
  const [staffName, setStaffName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [staffIdError, setStaffIdError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Payment options data
  const paymentOptions = [
    { id: 1, name: "CONTROLLER", icon: "🔄" },
    { id: 2, name: "ECG", icon: "⚡" },
    { id: 3, name: "GHANA WATER", icon: "💧" },
    { id: 4, name: "GHANA PAY", icon: "🇬🇭" },
    { id: 5, name: "BANK TRANSFER", icon: "🏦" },
    { id: 6, name: "GHANA HEALTH SERVICE", icon: "🏥" },
  ];

  // Filtered payment options based on search term
  const filteredPayments = paymentOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle payment option selection
  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment.name);
    setSearchTerm(payment.name);
    setInstitutionName(payment.name); // Set institution name from selected payment
  };

  // Handle Staff ID input change
  const handleStaffIdChange = (e) => {
    setStaffId(e.target.value);
    setStaffIdError("");
  };

  // Handle Staff Name input change
  const handleStaffNameChange = (e) => {
    setStaffName(e.target.value);
  };

  // Validate form inputs
  const validateForm = () => {
    if (!staffId.trim()) {
      setStaffIdError("Please enter a Staff ID");
      return false;
    }
    if (!staffName.trim()) {
      setStaffIdError("Please enter Staff Name");
      return false;
    }
    if (!selectedPayment) {
      setStaffIdError("Please select a payment option");
      return false;
    }
    return true;
  };

  // Handle Pay button click
  const handlePayClick = async (payment) => {
    if (!validateForm()) return;
    
    setSelectedPayment(payment.name);
    setIsProcessing(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/deductions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staff_id: staffId,
          staff_name: staffName,
          institution_name: institutionName,
          amount: amount || 0,
          policy_id: policy_id,
          client_id: client_id,
          under_agent: under_agent
        }),
      });

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      const result = await response.json();
      setIsProcessing(false);
      setSuccessMessage("Payment processed successfully!");
      setIsModalOpen(true);
    } catch (error) {
      setIsProcessing(false);
      setErrorMessage(error.message);
      setIsModalOpen(true);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
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
        <h1>Pay Point</h1>
      </div>

      <form className="payment-form" id="paymentForm">
        <div className="form-group">
          <h5>Payment Details</h5>

          <div className="payment-options">
            <h3 className="section-title">Payment Options</h3>

            {/* Search Field */}
            <div className="search-container">
              <span className="search-icon"></span>
              <input
                type="text"
                className="search-field"
                placeholder="Search payment options..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="dropdown-container">
              <ul className="auto-generated-list" id="paymentList">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <li key={payment.id}>
                      <div
                        className={`payment-link ${
                          selectedPayment === payment.name ? "selected" : ""
                        }`}
                        onClick={() => handlePaymentSelect(payment)}
                      >
                        <span className="link-icon">{payment.icon}</span>
                        {payment.name}
                        <button
                          type="button"
                          className={`badge ${
                            isProcessing && selectedPayment === payment.name
                              ? "processing"
                              : ""
                          }`}
                          onClick={() => handlePayClick(payment)}
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
          <div className="form-group">
            <label htmlFor="staffId">Staff ID</label>
            <input
              type="text"
              id="staffId"
              placeholder="Enter Staff ID"
              value={staffId}
              onChange={handleStaffIdChange}
              required
            />
            {staffIdError && (
              <div className="error-message" id="staffIdError">
                {staffIdError}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="staffName">Staff Name</label>
            <input
              type="text"
              id="staffName"
              placeholder="Enter Staff Name"
              value={staffName}
              onChange={handleStaffNameChange}
              required
            />
          </div>
        </div>

        <input type="hidden" id="selectedPayment" value={selectedPayment} />
      </form>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="payment-modal" id="paymentModal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {successMessage ? "Payment Successful" : "Payment Error"}
              </h3>
              <button
                type="button"
                className="close-modal"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {successMessage ? (
                <>
                  <div className="payment-info">
                    <span className="link-icon" id="modalIcon">
                      {paymentOptions.find((p) => p.name === selectedPayment)?.icon}
                    </span>
                    <div className="payment-info-text">
                      <div className="payment-info-title" id="modalTitle">
                        {selectedPayment}
                      </div>
                      <div className="payment-info-subtitle">
                        {successMessage}
                      </div>
                      <div className="staff-id-display">
                        Staff ID: <span id="modalStaffId">{staffId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="payment-details">
                    <p>
                      <strong>Amount:</strong> GHS {amount}
                    </p>
                    <p>
                      <strong>Policy ID:</strong> {policy_id}
                    </p>
                  </div>
                </>
              ) : (
                <div className="error-message">
                  {errorMessage || "An error occurred during payment processing"}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-primary"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayPoint;
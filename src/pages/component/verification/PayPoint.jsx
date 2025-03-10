import React, { useState } from 'react';


const PayPoint = () => {
  const [paymentMode, setPaymentMode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentMode) {
      alert('Please select a payment mode.');
      return;
    }
    alert(`Payment mode selected: ${paymentMode}`);
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>PAY POINT</h1>
      </div>

      <form id="credit-card-form" className="payment-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full-width">
            <h5>Payment Details</h5>
            <select
              id="paymentMode"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              required
            >
              <option value="">Select Payment Mode</option>
              <option value="one-time">One-Time Payment</option>
              <option value="auto-generated">Auto-Generated Payment</option>
            </select>
          </div>

          <div className="payment-options">
            <h3 className="section-title">Auto-Generated Payment Options</h3>
            <ul className="auto-generated-list">
              <li>
                <a href="#recurring-payments" className="payment-link">
                  <span className="link-icon">🔄</span>
                  CONTROLLER
                  <span className="badge">PAY</span>
                </a>
              </li>
              <li>
                <a href="#scheduled-payments" className="payment-link">
                  <span className="link-icon"></span>
                  ECG
                  <span className="badge">PAY</span>
                </a>
              </li>
              <li>
                <a href="#invoice-templates" className="payment-link">
                  <span className="link-icon"></span>
                  GHANA WATER
                  <span className="badge">PAY</span>
                </a>
              </li>
              <li>
                <a href="#bulk-payments" className="payment-link">
                  <span className="link-icon"></span>
                  GHANA PAY
                  <span className="badge">PAY</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Process Payment
        </button>
      </form>
    </div>
  );
};

export default PayPoint;
import React, { useState } from 'react';


const MobilePayment = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [provider, setProvider] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setProvider(provider);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mobileNumber || !provider) {
      alert('Please fill in all fields and select a provider.');
      return;
    }
    alert(`Payment initiated for ${mobileNumber} via ${provider}`);
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Mobile Payment</h1>
        <p>Secure mobile money transaction</p>
      </div>

      <form id="momo-form" onSubmit={handleSubmit}>
        <div className="form-group-pay">
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

        <div className="form-group">
          <label>NETWORK PROVIDER</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            required
          >
            <option value="">Select Provider</option>
            <option>MTN Mobile Money</option>
            <option>AirtelTigo Money</option>
            <option>Vodafone Cash</option>
            <option>Other networks</option>
          </select>
        </div>

        <div className="provider-logos">
          <div
            className={`provider-logo ${selectedProvider === 'MTN' ? 'active' : ''}`}
            onClick={() => handleProviderClick('MTN')}
          >
            <img src="/path/to/mtn-logo.png" alt="MTN" />
          </div>
          <div
            className={`provider-logo ${selectedProvider === 'AirtelTigo' ? 'active' : ''}`}
            onClick={() => handleProviderClick('AirtelTigo')}
          >
            <img src="/path/to/airteltigo-logo.png" alt="AirtelTigo" />
          </div>
          <div
            className={`provider-logo ${selectedProvider === 'Vodafone' ? 'active' : ''}`}
            onClick={() => handleProviderClick('Vodafone')}
          >
            <img src="/path/to/vodafone-logo.png" alt="Vodafone" />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Make Payment
        </button>
      </form>
    </div>
  );
};

export default MobilePayment;
export function initializeKYCForm() {
  // Payment mode change handler
  const paymentModeRadios = document.getElementsByName("paymentMode")
  const paymentDetailsDiv = document.getElementById("paymentDetails")

  function updatePaymentDetails() {
    const selectedMode = document.querySelector('input[name="paymentMode"]:checked').value
    let detailsHTML = ""

    switch (selectedMode) {
      case "momo":
        detailsHTML = `
          <div class="form-group">
            <label for="mobileNetwork">Mobile Network:</label>
            <input type="text" id="mobileNetwork" name="mobileNetwork" required>
          </div>
          <div class="form-group">
            <label for="momoNumber">MoMo Number:</label>
            <input type="tel" id="momoNumber" name="momoNumber" required>
          </div>
        `
        break
      case "cagd":
        detailsHTML = `
          <div class="form-group">
            <label for="cagdNumber">CAGD Number:</label>
            <input type="text" id="cagdNumber" name="cagdNumber" required>
          </div>
        `
        break
      case "bankDeduction":
        detailsHTML = `
          <div class="form-group">
            <label for="bankName">Bank Name:</label>
            <input type="text" id="bankName" name="bankName" required>
          </div>
          <div class="form-group">
            <label for="accountNumber">Bank Account Number:</label>
            <input type="text" id="accountNumber" name="accountNumber" required>
          </div>
          <div class="form-group">
            <label for="branch">Branch:</label>
            <input type="text" id="branch" name="branch" required>
          </div>
        `
        break
      case "creditCard":
        detailsHTML = `
          <div class="form-group">
            <label for="cardholderName">Cardholder Name:</label>
            <input type="text" id="cardholderName" name="cardholderName" required>
          </div>
          <div class="form-group">
            <label for="cardNumber">Card Number:</label>
            <input type="text" id="cardNumber" name="cardNumber" required>
          </div>
          <div class="form-group">
            <label for="expiryDate">Expiry Date:</label>
            <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required>
          </div>
          <div class="form-group">
            <label for="cvv">CVV:</label>
            <input type="text" id="cvv" name="cvv" required>
          </div>
        `
        break
    }

    paymentDetailsDiv.innerHTML = detailsHTML
  }

  paymentModeRadios.forEach((radio) => {
    radio.addEventListener("change", updatePaymentDetails)
  })

  // Initial call to set up payment details
  updatePaymentDetails()
}


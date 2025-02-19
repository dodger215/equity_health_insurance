document.addEventListener('DOMContentLoaded', function() {
    // Initialize collapsible sections
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active class on header
            this.classList.toggle('active');
            
            // Toggle icon
            const icon = this.querySelector('i');
            
            // Get the content panel
            const content = this.nextElementSibling;
            
            // Toggle active class on content
            content.classList.toggle('active');
            
            // Update aria-expanded attribute for accessibility
            const isExpanded = content.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
        
        // Set initial ARIA attributes for accessibility
        header.setAttribute('aria-expanded', 'false');
        const content = header.nextElementSibling;
        const contentId = `content-${Math.random().toString(36).substr(2, 9)}`;
        content.id = contentId;
        header.setAttribute('aria-controls', contentId);
    });

    // Payment mode change handler
    const paymentModeRadios = document.getElementsByName("paymentMode");
    const paymentDetailsDiv = document.getElementById("paymentDetails");

    paymentModeRadios.forEach((radio) => {
        radio.addEventListener("change", updatePaymentDetails);
    });

    function updatePaymentDetails() {
        const selectedMode = document.querySelector('input[name="paymentMode"]:checked').value;
        let detailsHTML = "";

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
                `;
                break;
            case "cagd":
                detailsHTML = `
                    <div class="form-group">
                        <label for="cagdNumber">CAGD Number:</label>
                        <input type="text" id="cagdNumber" name="cagdNumber" required>
                    </div>
                `;
                break;
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
                `;
                break;
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
                `;
                break;
        }

        paymentDetailsDiv.innerHTML = detailsHTML;
    }

    // Add dependant handler
    const addDependantButton = document.getElementById("addDependant");
    const dependantsDiv = document.getElementById("dependants");
    let dependantCount = 0;

    addDependantButton.addEventListener("click", () => {
        dependantCount++;
        const dependantHTML = `
            <div class="dependant" id="dependant${dependantCount}">
                <h3>Dependant ${dependantCount}</h3>
                <div class="form-group">
                    <label for="dependantName${dependantCount}">Full Name:</label>
                    <input type="text" id="dependantName${dependantCount}" name="dependantName${dependantCount}" required>
                </div>
                <div class="form-group">
                    <label for="dependantDOB${dependantCount}">Date of Birth:</label>
                    <input type="date" id="dependantDOB${dependantCount}" name="dependantDOB${dependantCount}" required>
                </div>
                <div class="form-group">
                    <label for="dependantRelationship${dependantCount}">Relationship to Principal:</label>
                    <input type="text" id="dependantRelationship${dependantCount}" name="dependantRelationship${dependantCount}" required>
                </div>
                <button type="button" class="delete-dependant" data-id="${dependantCount}">Delete Dependant</button>
            </div>
        `;
        dependantsDiv.insertAdjacentHTML("beforeend", dependantHTML);
    });

    // Delete dependant handler
    dependantsDiv.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-dependant")) {
            const dependantId = event.target.getAttribute("data-id");
            const dependantToRemove = document.getElementById(`dependant${dependantId}`);
            dependantToRemove.remove();
        }
    });

    const insurancePolicyForm = {
        clientInformation: {
            firstName: document.getElementById("firstName"),
            lastName: document.getElementById("lastName"),
            dob: document.getElementById("dob"),
            phoneNumber: document.getElementById("phoneNumber"),
            email: document.getElementById("email"),
            address: document.getElementById("address")
        },
        policySelection: {
            micro: {
                coverageAmount: document.getElementById("microCoverageAmount"),
                durationMonths: document.getElementById("microDurationMonths"),
                benefits: document.getElementById("microBenefits"),
                beneficiaries: document.getElementById("microBeneficiaries")
            },
            telemedicine: {
                provider: document.getElementById("telemedicineProvider"),
                consultations: document.getElementById("telemedicineConsultations"),
                specialties: document.getElementById("telemedicineSpecialties"),
                beneficiaries: document.getElementById("telemedicineBeneficiaries")
            },
            abs: {
                type: document.getElementById("absType"),
                coverageAmount: document.getElementById("absCoverageAmount"),
                deductibleAmount: document.getElementById("absDeductibleAmount"),
                beneficiaries: document.getElementById("absBeneficiaries")
            },
            ebusua: {
                familyMembers: document.getElementById("ebusuaFamilyMembers"),
                coveragePerMember: document.getElementById("ebusuaCoveragePerMember"),
                maternityCoverage: document.getElementById("ebusuaMaternityCoverage"),
                dentalCoverage: document.getElementById("ebusuaDentalCoverage"),
                beneficiaries: document.getElementById("ebusuaBeneficiaries")
            },
            daakye: {
                plan: document.getElementById("daakyePlan"),
                durationYears: document.getElementById("daakyeDurationYears"),
                annualPremium: document.getElementById("daakyeAnnualPremium"),
                beneficiaries: document.getElementById("daakyeBeneficiaries")
            }
        },
        dependants: []
    };

    // Function to add dependants dynamically
    function addDependant() {
        const dependant = {
            firstName: document.getElementById("dependantFirstName").value,
            lastName: document.getElementById("dependantLastName").value,
            dob: document.getElementById("dependantDob").value,
            relationship: document.getElementById("dependantRelationship").value
        };

        insurancePolicyForm.dependants.push(dependant);
        console.log("Dependant added:", dependant);
    }

    document.getElementById("addDependantBtn").addEventListener("click", addDependant);

    // Function to collect and prepare data
    function prepareFormData() {
        return {
            personalData: {
                firstName: insurancePolicyForm.clientInformation.firstName.value,
                lastName: insurancePolicyForm.clientInformation.lastName.value,
                dob: insurancePolicyForm.clientInformation.dob.value,
            },
            contactData: {
                phoneNumber: insurancePolicyForm.clientInformation.phoneNumber.value,
                email: insurancePolicyForm.clientInformation.email.value,
                address: insurancePolicyForm.clientInformation.address.value
            },
            dependentData: insurancePolicyForm.dependants.map(dep => ({
                firstName: dep.firstName,
                lastName: dep.lastName,
                dob: dep.dob,
                relationship: dep.relationship
            }))
        };
    }

    // Function to submit data to API
    async function submitData() {
        const { personalData, contactData, dependentData } = prepareFormData();

        try {
            // Step 1: Send request to personalInfo
            let personalResponse = await fetch('/api/personalInfo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(personalData)
            });

            if (!personalResponse.ok) throw new Error("Failed to submit personalInfo");

            let personalResult = await personalResponse.json();
            let personalId = personalResult.id; // Assuming response contains an ID

            // Step 2: Attach personalId to contact and dependants
            contactData.personalInfoId = personalId;
            dependentData.forEach(dep => dep.personalInfoId = personalId);

            // Step 3: Send requests to contactInfo and dependants concurrently
            let [contactResponse, dependentResponse] = await Promise.all([
                fetch('/api/contactInfo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contactData)
                }),
                fetch('/api/dependent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dependentData)
                })
            ]);

            if (!contactResponse.ok || !dependentResponse.ok) {
                throw new Error("Failed to submit contactInfo or dependants");
            }

            console.log("All requests were successful!");

        } catch (error) {
            console.error("Error:", error.message);
        }
    }

    // Attach submit function to form button
    document.getElementById("submitBtn").addEventListener("click", submitData);



});
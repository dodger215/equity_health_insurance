"use client"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Close } from "../../ui/button";
import { Card, ListGroup, Badge } from 'react-bootstrap';
import '../calculator.css';
import Select from "../select";

export default function PremiumCalculator() {
  const navigate = useNavigate();
  const [subscriptionType, setSubscriptionType] = useState("monthly");
  const [premium, setPremium] = useState(5.0);

  const subscriptionOptions = [
    { value: "monthly", label: "Monthly (GHC 5.00 per person)" },
    { value: "yearly", label: "Yearly (GHC 60.00 per person)" }
  ];

  const calculatePremium = (selectedType) => {
    const premiumRate = selectedType === "monthly" ? 5.0 : 60.0;
    setPremium(premiumRate);
  };

  const handleSubscriptionChange = (value) => {
    setSubscriptionType(value);
    calculatePremium(value);
  };

  return (
    <div className="calculator-containers p-3">
      <Close tab={'calculator'} variant="light" />
      
      {/* Input Card */}
      <Card className="border-info mb-4">
        <Card.Header className="bg-info text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Telemedicine Premium Calculator</h5>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <Select
              id="subscription"
              label="Select Subscription Type"
              value={subscriptionType}
              options={subscriptionOptions}
              onChange={handleSubscriptionChange}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Results Card */}
      <Card className="border-info mt-10">
        <Card.Header className="bg-info text-white">
          <h5 className="mb-0">Premium Summary</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Subscription Type:</span>
              <Badge bg="info" pill>
                {subscriptionType === "monthly" ? "Monthly" : "Yearly"}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Premium Rate:</span>
              <Badge bg="primary" pill>
                GHC {subscriptionType === "monthly" ? "5.00" : "60.00"} per person
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Total Premium:</span>
              <Badge bg="success" pill className="fs-6">
                GHC {premium.toFixed(2)}
              </Badge>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
"use client"

import { useState, useEffect } from "react";
import { premiumRates } from "./premium-rates";
import { useNavigate } from "react-router-dom";
import { Close } from "../../ui/button";
import { Card, Row, Col, Form, ListGroup, Badge } from 'react-bootstrap';
import '../calculator.css';
import Select from "../select";

export default function DaakyeCalc() {
  const navigate = useNavigate();
  
  const [calculationType, setCalculationType] = useState("sumAssured");
  const [years, setYears] = useState("5");
  const [sumAssured, setSumAssured] = useState(10000);
  const [enteredPremium, setEnteredPremium] = useState(290);
  const [calculations, setCalculations] = useState({
    monthlyPremium: 290,
    annualPremium: 3480,
    calculatedSumAssured: 10000,
  });

  const calculateBasedOnSumAssured = () => {
    const selectedRate = premiumRates[years];
    const annualPremium = (sumAssured * selectedRate.rate).toFixed(2);
    const monthlyPremium = (annualPremium / 12).toFixed(2);

    setCalculations({
      monthlyPremium,
      annualPremium,
      calculatedSumAssured: sumAssured,
    });
  };

  const calculateBasedOnPremiumFee = () => {
    const selectedRate = premiumRates[years].rate;
    const estimatedSumAssured = ((enteredPremium * 12) / selectedRate).toFixed(2);

    setCalculations(prev => ({
      ...prev,
      calculatedSumAssured: estimatedSumAssured,
      monthlyPremium: enteredPremium,
      annualPremium: (enteredPremium * 12).toFixed(2),
    }));
  };

  useEffect(() => {
    if (calculationType === "sumAssured") {
      calculateBasedOnSumAssured();
    } else {
      calculateBasedOnPremiumFee();
    }
  }, [calculationType, years, sumAssured, enteredPremium]);

  const calculationTypeOptions = [
    { value: "sumAssured", label: "Calculate Based on Sum Assured & Term" },
    { value: "premiumFee", label: "Calculate Based on Premium + Policy Fee & Term" },
  ];

  const yearsOptions = [5, 6, 7, 8, 9, 10].map(year => ({
    value: year.toString(),
    label: `${year} Years`,
  }));

  return (
    <div className="calculator-containers p-3">
      <Close tab={'calculator'} variant="light" />
      
      {/* Input Card */}
      <Card className="border-primary mb-4">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Daakye Premium Calculator</h5>
          </div>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group controlId="calculationTypeSelect">
                  <Select
                    id="calculationType"
                    label="Calculation Method"
                    value={calculationType}
                    options={calculationTypeOptions}
                    onChange={setCalculationType}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="yearsSelect">
                  <Select
                    id="years"
                    label="Select Term (Years)"
                    value={years}
                    options={yearsOptions}
                    onChange={setYears}
                  />
                </Form.Group>
              </Col>
              
              {calculationType === "sumAssured" ? (
                <Col md={6}>
                  <Form.Group controlId="sumAssuredInput">
                    <Form.Label>Sum Assured (₵)</Form.Label>
                    <Form.Control
                      type="number"
                      value={sumAssured}
                      onChange={(e) => setSumAssured(Number(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              ) : (
                <Col md={6}>
                  <Form.Group controlId="enteredPremiumInput">
                    <Form.Label>Monthly Premium (₵)</Form.Label>
                    <Form.Control
                      type="number"
                      value={enteredPremium}
                      onChange={(e) => setEnteredPremium(Number(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              )}
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Results Card */}
      <Card className="border-primary border-info">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Premium Summary</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Monthly Premium:</span>
              <Badge bg="primary" pill>
                ₵{calculations.monthlyPremium}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Annual Premium:</span>
              <Badge bg="info" pill>
                ₵{calculations.annualPremium}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>
                {calculationType === "sumAssured" ? "Sum Assured:" : "Estimated Sum Assured:"}
              </span>
              <Badge bg="success" pill>
                ₵{calculations.calculatedSumAssured}
              </Badge>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
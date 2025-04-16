"use client"

import { useState, useEffect } from "react";
import { premiums } from "./data";
import { useNavigate } from "react-router-dom";
import { Close } from "../../ui/button";
import { Card, Row, Col, Form, ListGroup, Badge } from 'react-bootstrap';
import '../calculator.css';
import Select from "../select";

export default function EbusuaCalculator() {
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState("Shea");
  const [level, setLevel] = useState("1");
  const [lives, setLives] = useState("M");
  const [premium, setPremium] = useState("GHC 0.00");

  const calculatePremium = () => {
    if (premiums[plan] && premiums[plan][level] && premiums[plan][level][lives]) {
      const premiumAmount = premiums[plan][level][lives];
      setPremium(`GHC ${premiumAmount.toFixed(2)}`);
    } else {
      setPremium("Invalid selection");
    }
  };

  useEffect(() => {
    calculatePremium();
  }, [plan, level, lives]);

  const planOptions = [
    { value: "Shea", label: "Shea" },
    { value: "Oak", label: "Oak" },
    { value: "Mahogany", label: "Mahogany" },
    { value: "Rosewood", label: "Rosewood" },
  ];

  const levelOptions = [
    { value: "1", label: "Level 1 (Base Cover)" },
    { value: "2", label: "Level 2 (Base + Dental)" },
    { value: "3", label: "Level 3 (Base + Dental + Optical)" },
    { value: "4", label: "Level 4 (Base + Dental + Optical + Maternity)" },
  ];

  const livesOptions = [
    { value: "M", label: "Individual (M)" },
    { value: "M+1", label: "M+1 (2 lives)" },
    { value: "M+2", label: "M+2 (3 lives)" },
    { value: "M+3", label: "M+3 (4 lives)" },
    { value: "M+4", label: "M+4 (5 lives)" },
    { value: "M+5", label: "M+5 (6 lives)" },
  ];

  return (
    <div className="calculator-containers p-3">
      <Close tab={'calculator'} variant="light" />
      
      {/* Input Card */}
      <Card className="border-success mb-4">
        <Card.Header className="bg-success text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">EBUSUA Health Insurance Calculator</h5>
          </div>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="planSelect">
                  <Select
                    id="plan"
                    label="Select Plan"
                    value={plan}
                    options={planOptions}
                    onChange={setPlan}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="levelSelect">
                  <Select
                    id="level"
                    label="Select Coverage Level"
                    value={level}
                    options={levelOptions}
                    onChange={setLevel}
                  />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group controlId="livesSelect">
                  <Select
                    id="lives"
                    label="Select Number of Lives"
                    value={lives}
                    options={livesOptions}
                    onChange={setLives}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Results Card */}
      <Card className="border-success">
        <Card.Header className="bg-success text-white">
          <h5 className="mb-0">Premium Summary</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Selected Plan:</span>
              <Badge bg="success" pill>
                {plan}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Coverage Level:</span>
              <Badge bg="info" pill>
                {levelOptions.find(opt => opt.value === level)?.label.split(' ')[0]}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Number of Lives:</span>
              <Badge bg="primary" pill>
                {lives === "M" ? "1" : lives.replace("M+", "") + " + 1"}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Yearly Premium:</span>
              <Badge bg="warning" pill className="fs-6">
                {premium}
              </Badge>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
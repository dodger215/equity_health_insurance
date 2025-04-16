"use client"

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Close } from "../../ui/button";
import { Card, Row, Col, Form, ListGroup, Badge } from 'react-bootstrap';
import '../calculator.css';
import Select from "../select";

const premiums = {
  "Micro 1": { monthly: 52, quarterly: 156, "half-yearly": 312, annually: 624 },
  "Micro 2": { monthly: 88, quarterly: 264, "half-yearly": 528, annually: 1056 },
  "Micro 3": { monthly: 122, quarterly: 366, "half-yearly": 732, annually: 1464 },
};

export default function MicroCalculator() {
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState("Micro 1");
  const [frequency, setFrequency] = useState("monthly");
  const totalPremium = premiums[plan][frequency];

  const planOptions = [
    { value: "Micro 1", label: "Micro 1" },
    { value: "Micro 2", label: "Micro 2" },
    { value: "Micro 3", label: "Micro 3" },
  ];

  const frequencyOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "half-yearly", label: "Half-Yearly" },
    { value: "annually", label: "Annually" },
  ];

  return (
    <div className="calculator-containers p-3">
      <Close tab={'calculator'} variant="light" />
      
      {/* Input Card */}
      <Card className="border-warning mb-4">
        <Card.Header className="bg-warning text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Micro Product Premium Calculator</h5>
          </div>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="planSelect">
                  <Select
                    id="plan"
                    label="Select Micro Plan"
                    value={plan}
                    options={planOptions}
                    onChange={setPlan}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="frequencySelect">
                  <Select
                    id="frequency"
                    label="Select Payment Frequency"
                    value={frequency}
                    options={frequencyOptions}
                    onChange={setFrequency}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Results Card */}
      <Card className="border-warning border-info">
        <Card.Header className="bg-warning text-white">
          <h5 className="mb-0">Premium Summary</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Selected Plan:</span>
              <Badge bg="warning" pill className="text-dark">
                {plan}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Payment Frequency:</span>
              <Badge bg="info" pill>
                {frequencyOptions.find(opt => opt.value === frequency)?.label}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Total Premium:</span>
              <Badge bg="success" pill className="fs-6">
                GHS {totalPremium.toFixed(2)}
              </Badge>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
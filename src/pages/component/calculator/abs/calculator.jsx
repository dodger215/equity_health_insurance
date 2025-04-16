"use client"

import { useState, useEffect } from "react";
import { premiums } from "./premiums";
import { useNavigate } from "react-router-dom";
import { Close } from "../../ui/button";
import { Card, Row, Col, Form, ListGroup, Badge } from 'react-bootstrap';
import '../calculator.css';
import Select from "../select";

function ABScalc() {
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState("ABS1");
  const [type, setType] = useState("adult");
  const [frequency, setFrequency] = useState("monthly");
  const [calculations, setCalculations] = useState({
    totalPremium: 23.0,
    hospitalPay: 50.0,
    quarterlyPharmacy: 25.0,
    annualPharmacy: 100.0,
    screening: 100.0,
  });

  useEffect(() => {
    const calculatePremium = () => {
      const totalPremium = premiums[plan][type][frequency];
      const hospitalPay = premiums[plan]["hospital"];
      const quarterlyPharmacy = premiums[plan]["quarterlyPharmacy"];
      const annualPharmacy = premiums[plan]["annualPharmacy"];
      const screening = premiums[plan]["screening"];

      setCalculations({
        totalPremium,
        hospitalPay,
        quarterlyPharmacy,
        annualPharmacy,
        screening,
      });
    };

    calculatePremium();
  }, [plan, type, frequency]);

  const planOptions = [
    { value: "ABS1", label: "ABS1" },
    { value: "ABS2", label: "ABS2" },
    { value: "ABS3", label: "ABS3" },
  ];

  const typeOptions = [
    { value: "adult", label: "Adult" },
    { value: "child", label: "Child" },
  ];

  const frequencyOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "half-yearly", label: "Half-Yearly" },
    { value: "annually", label: "Annually" },
  ];

  return (
    <div className="calculator-container p-3">
      <Close tab={'calculator'} variant="light" />
      {/* Input Card */}
      <Card className="border-danger mb-4">
        <Card.Header className="bg-danger text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">ABS Premium Calculator</h5>
            
          </div>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="planSelect">
                <Select
                id="plan"
                label="Select ABS Plan"
                value={plan}
                options={planOptions}
                onChange={setPlan}
              />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="typeSelect">
                <Select
                  id="type"
                  label="Select Policy Type"
                  value={type}
                  options={typeOptions}
                  onChange={setType}
                />
                </Form.Group>
              </Col>
              
              <Col md={12}>
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
      <Card className="border-danger">
        <Card.Header className="bg-danger text-white">
          <h5 className="mb-0">Premium Summary</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Total Premium:</span>
              <Badge bg="primary" pill >
                GHS {calculations.totalPremium.toFixed(2)}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Hospital Pay Per Night:</span>
              <Badge bg="info" pill>
                GHS {calculations.hospitalPay.toFixed(2)}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Quarterly Pharmacy Benefit:</span>
              <Badge bg="success" pill>
                GHS {calculations.quarterlyPharmacy.toFixed(2)}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Annual Pharmacy Benefit:</span>
              <Badge bg="warning" pill>
                GHS {calculations.annualPharmacy.toFixed(2)}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span>Medical Screening Benefit:</span>
              <Badge bg="danger" pill>
                GHS {calculations.screening.toFixed(2)}
              </Badge>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ABScalc;
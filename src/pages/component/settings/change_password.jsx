import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../link';
import { PopupContext } from '../../../App';
import { useContext } from 'react';
import { PrimaryLoading } from '../ui/loading';
import { Close } from '../ui/button';

const PasswordChangeForm = () => {
    const { setPopupState } = useContext(PopupContext)
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const auth = localStorage.getItem('jwtToken');

  console.log(auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
    }
    
    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }
    
    if (formData.new_password !== formData.confirm_new_password) {
      newErrors.confirm_new_password = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API_URL}/agent/change/password/`, formData, {
        headers: {
          'Authorization': `Bearer ${auth}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccessMessage('Password changed successfully!');

      setTimeout(() => navigate('/login'), 2000); 
      setPopupState({
        show: true,
        message: 'Password changed successfully! You Can Now Login.', 
        page: 'login', 
      });
    } catch (error) {
      if (error.response) {
        setApiError(error.response.data.detail || 'Failed to change password');
      } else {
        setApiError('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


 
  return (
    <div className="container" style={{
      width: "100%",
      
    }}>
      <Close tab={'settings'}/>
      <div className="row justify-content-center" style={{
        margin: "40px 0",
      }}>
        <div className="col-md-6">
          <Card>
            <Card.Header as="h2" className="text-center">Change Password</Card.Header>
            <Card.Body>
              {apiError && <Alert variant="danger">{apiError}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              
              <Form onSubmit={handleSubmit} style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Form.Group className="mb-3" controlId="currentPassword" style={{
                  width: "100%",
                }}>
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    isInvalid={!!errors.current_password}
                    className='w-100'
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.current_password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="newPassword" style={{
                  width: "100%",
                }}>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    isInvalid={!!errors.new_password}
                    style={{
                      width: "100%",
                    }}
                    
                  />
                  <Form.Text className="text-muted">
                    Must be at least 8 characters long
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.new_password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword" style={{
                  width: "100%",
                }}>
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm_new_password"
                    value={formData.confirm_new_password}
                    onChange={handleChange}
                    isInvalid={!!errors.confirm_new_password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirm_new_password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <PrimaryLoading/> : 'Change Password'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faImages } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../link';
import { Close } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const ImageUploadForm = () => {
    const navigate = useNavigate();
    const { clientId } = useParams(); // Get clientId from the URL
    const [frontCard, setFrontCard] = useState(null);
    const [backCard, setBackCard] = useState(null);
    const [label, setLabel] = useState('');
    const [message, setMessage] = useState('');
    const [clientData, setClientData] = useState(null);

    // Refs for file inputs
    const frontCardInputRef = useRef(null);
    const backCardInputRef = useRef(null);

    // Fetch client data when clientId changes
    useEffect(() => {
        if (clientId) {
            const fetchClientData = async () => {
                try {
                    const response = await axios.get(`${API_URL}/get/client/${clientId}`);
                    setClientData(response.data);
                    setMessage('Client data fetched successfully');
                } catch (error) {
                    setMessage('Failed to fetch client data');
                    console.error('Error fetching client data:', error);
                }
            };

            fetchClientData();
        }
    }, [clientId]);

    // Handle file input change
    const handleFileChange = (setFile, e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            console.log('File selected:', e.target.files[0]); // Log the selected file
        }
    };

    const handleSkip = () => {
        navigate(`/ListClient`);
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!clientId || !frontCard || !backCard) {
            setMessage('Please fill all required fields');
            return;
        }
    
        const formData = new FormData();
        formData.append('client_id', clientId);
        formData.append('front_card', frontCard);
        formData.append('back_card', backCard);
        if (label) {
            formData.append('label', label);
        }
    
        // Log FormData contents
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    
        try {
            const response = await axios.post(`${API_URL}/upload-image/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            handleSkip();
        } catch (error) {
            setMessage('Failed to upload images');
            console.error('There was an error uploading the images!', error);
        }
    };

    return (
        <div className='imageContainer'>
            <Close title={<div className='skip' onClick={() => handleSkip()}>Skip</div>}/>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Client ID:</label>
                    <input
                        type="text"
                        value={clientId}
                        readOnly
                    />
                </div>
                <div>
                    <label>Front Card Image:</label>
                    <div onClick={() => frontCardInputRef.current.click()} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faIdCard} size="2x" />
                        <input
                            type="file"
                            ref={frontCardInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileChange(setFrontCard, e)}
                            required
                        />
                    </div>
                    {frontCard && <p>{frontCard.name}</p>}
                </div>
                <div>
                    <label>Back Card Image:</label>
                    <div onClick={() => backCardInputRef.current.click()} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faImages} size="2x" />
                        <input
                            type="file"
                            ref={backCardInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileChange(setBackCard, e)}
                            required
                        />
                    </div>
                    {backCard && <p>{backCard.name}</p>}
                </div>
                <div>
                    <label>Label (optional):</label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />
                </div>
                <button type="submit">Upload Images</button>
            </form>

            {message && <p>{message}</p>}

            {clientData && (
                <div>
                    <h3>Client Details</h3>
                    <p><strong>Client ID:</strong> {clientData.client_id}</p>
                    <p><strong>Name:</strong> {clientData.first_name} {clientData.surname}</p>
                    <p><strong>Date of Birth:</strong> {clientData.date_of_birth}</p>
                    <p><strong>National ID:</strong> {clientData.national_id_number}</p>
                    <p><strong>Phone Number:</strong> {clientData.phone_number}</p>
                    <p><strong>Email:</strong> {clientData.email_address}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploadForm;
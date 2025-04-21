import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../link';
import { Close } from '../ui/button';
import styles from '../verification/ClientForm.module.css';
import { useContext } from 'react';
import { PopupContext } from '../../../App';


const ImageUploadForm = () => {
    const { setPopupState } = useContext(PopupContext)
    const [activeSections, setActiveSections] = useState({
        stage_1: false,
    });

    const toggleSection = (section) => {
        setActiveSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const navigate = useNavigate();
    const { clientId } = useParams(); 
    const [frontCard, setFrontCard] = useState(null);
    const [backCard, setBackCard] = useState(null);
    // const [label, setLabel] = useState('');
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
    // const handleFileChange = (setFile, e) => {
    //     if (e.target.files[0]) {
    //         setFile(e.target.files[0]);
    //         console.log('File selected:', e.target.files[0]); // Log the selected file
    //     }
    // };


    // Handle form submission
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!clientId || !frontCard || !backCard) {
    //         setMessage('Please fill all required fields');
    //         return;
    //     }
    //     const label = "card";

    //     const formData = new FormData();
    //     formData.append('client_id', clientId.toString());
    //     formData.append('front_card', frontCard);
    //     formData.append('back_card', backCard);
    //     if (label) {
    //         formData.append('label', label.toString());
    //     }

    //     // Log FormData contents
    //     for (let [key, value] of formData.entries()) {
    //         console.log(key, value);
    //     }

    //     try {
    //         const response = await axios.post(`${API_URL}/upload-image/`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //         setMessage(response.data.message);
    //         setPopupState({
    //             show: true,
    //             message: 'National ID Image Uploaded Successfully 🎉', 
    //             page: 'login', 
    //           });
    //         handleSkip();
    //     } catch (error) {
    //         setMessage('Failed to upload images');
    //         console.error('There was an error uploading the images!', error);
    //     }
    // };



        const [files, setFiles] = useState([]);


      
        const handleFileChange = (event) => {
            if (event.target.files.length > 0) {
                setFrontCard(event.target.files[0]);
                setBackCard(event.target.files[1]);
                setFiles(event.target.files);
            }
          
        };
      
        const handleImageUpload = async () => {
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
          }
      
          try {
            const response = await fetch(`${API_URL}/client/upload/${clientId}`, {
              method: "POST",
              body: formData,
            });
      
            const data = await response.json();
            console.log("Upload successful:", data);

            setPopupState({
                            show: true,
                            message: 'National ID Image Uploaded Successfully 🎉', 
                            page: 'login', 
                          });
          } catch (error) {
            console.error("Error uploading files:", error);
          }
        };

        const [imageUrl, setImageUrl] = useState(null);
        const [fileId, setFileId] = useState("");
      
        // const fetchFile = async () => { 
            
        //         try {
        //           const response = await fetch(`http://localhost:8000/files/image/${clientId}`);
                  
        //           // Verify content length before processing
        //           const contentLength = response.headers.get('Content-Length');
        //           if (contentLength === '0') throw new Error('Server returned empty file');
                  
        //           const blob = await response.blob();
        //           console.log("Received blob:", {
        //             size: blob.size,  // Must match Content-Length
        //             type: blob.type   // e.g. "image/png"
        //           });
                  
        //           setImageUrl(URL.createObjectURL(blob));
        //         } catch (error) {
        //           console.error("Image load failed:", error);
        //           setImageUrl('/fallback-image.png');
        //         }

              
        //   };
          
          // Clean up blob URL on unmount
          useEffect(() => {
            return () => {
              if (imageUrl) URL.revokeObjectURL(imageUrl);
            };
          }, [imageUrl]);
          

        console.log("Image: ", imageUrl);
      
      

    return (
        <div className='imageContainer'>
            <div>               
            
               
                <form>
                <div>
                    <label>Upload Both FRONT And BACK Of National ID Card Image:</label>
                    <div onClick={() => frontCardInputRef.current.click()} style={{ 
                        cursor: 'pointer',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                         }}>
                        <FontAwesomeIcon icon={faImages} size="2x" className='icon' style={{ width: "60%", position: "relative" }} />
                        <input
                            type="file"
                            ref={frontCardInputRef}
                            style={{ display: 'none', }}
                            multiple 
                            onChange={handleFileChange}
                            required
                            accept='image/*'
                        />
                    </div>
                    <div style={{ width: "90%", display: 'flex', gap: '5px', marginTop: '20px', scale: "0.5"}}>
                        {frontCard && (
                        <div>
                            <p>Front of Card</p>
                            <img
                            src={URL.createObjectURL(frontCard)}
                            alt="Front Card"
                            style={{ width: '200px', height: 'auto', border: '1px solid #ccc' }}
                            />
                        </div>
                        )}

                        {backCard && (
                        <div>
                            <p>Back of Card</p>
                            <img
                            src={URL.createObjectURL(backCard)}
                            alt="Back Card"
                            style={{ width: '200px', height: 'auto', border: '1px solid #ccc'}}
                            />
                        </div>
                        )}
                    </div>


                </div>
                </form>
            
                <button style={{
                    width: "100%",
                    margin: "10px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                
                onClick={handleImageUpload}>Upload Images</button>

            </div>


            <div>
                {/* <input 
                    type="text" 
                    placeholder="Enter File ID" 
                    value={fileId} 
                    onChange={(e) => setFileId(e.target.value)} 
                /> */}
                {/* <button onClick={fetchFile}>View Image</button>

                {imageUrl && (
                    <div>
                    <h3>Image Preview:</h3>
                        <img 
                            key={imageUrl}
                            src={imageUrl} 
                            alt="Preview" 
                            style={{ maxWidth: "100%" }}
                            onError={(e) => console.error("Image failed to load")}
                        />
                    </div>
                )} */}
                </div>
            


            {/* <div className={styles.collapsibleSection} style={{
                margin: "40px 0",
            }}>
                <div
                    className={`${styles.collapsibleHeader} ${activeSections.stage_1 ? styles.active : ''}`}
                    onClick={() => toggleSection('stage_1')}
                >
                    <span>Client Information</span>
                    <FontAwesomeIcon
                        icon={activeSections.stage_1 ? faMinus : faPlus}
                        className={styles.icon}
                    />
                </div>
                {activeSections.stage_1 && clientData && (
                    <div style={{
                        padding: '10px',
                    }}>
                        <h3>Client Details</h3>
                        <p><strong>Client ID:</strong> {clientData.client_id}</p>
                        <p><strong>Name:</strong> {clientData.first_name} {clientData.surname}</p>
                        <p><strong>Date of Birth:</strong> {clientData.date_of_birth}</p>
                        <p><strong>National ID:</strong> {clientData.national_id_number}</p>
                        <p><strong>Phone Number:</strong> {clientData.phone_number}</p>
                        <p><strong>Email:</strong> {clientData.email_address}</p>
                    </div>
                )}
            </div> */}

            {/* {message && <p>{message}</p>} */}
        </div>
    );
};

export default ImageUploadForm;
"use client"

import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function DocumentScanner({ onDataExtracted, onClose }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isExtractingData, setIsExtractingData] = useState(false);
  const [mode, setMode] = useState(null); 

  // Function to start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setMode('camera');
    } catch (err) {
      console.error("Error accessing camera:", err);
      throw new Error('Could not access camera. Please check permissions.');
    }
  };

  // Function to capture image
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  };

  // Function to stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        setMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to extract data from image
  const extractDataFromImage = async () => {
    if (!capturedImage) return;
    
    setIsExtractingData(true);
    try {
      // Convert base64 image to blob
      const blob = await fetch(capturedImage).then(res => res.blob());
      
      // Create form data for the API
      const formData = new FormData();
      formData.append('file', blob, 'document.jpg');
      
      // Call your OCR API
      const response = await fetch('http://127.0.0.1:8000/upload/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract data from image');
      }
      
      const result = await response.json();
      
      console.log(result.extracted_data);
      const transformedData = transformExtractedData(result.extracted_data);

      
      // Pass data back to parent component
      onDataExtracted(transformedData);
      
      // Close the scanner
      onClose();
    } catch (error) {
      console.error('Error extracting data:', error);
      throw error;
    } finally {
      setIsExtractingData(false);
    }
  };

  // Transform extracted data to match form field names
  const transformExtractedData = (data) => {
    return {
      FirstName: data.first_name || '',
      LastName: data.surname || data.last_name || '',
      DateOfBirth: data.date_of_birth || '',
      // Add more fields as needed
    };
  };

  return (
    <div className="modal-backdrop show">
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className="modal-content w-100" 
          style={{
            width: "100%",
          }}>
            <div className="modal-header">
              <h5 className="modal-title">Scan Document</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
              >
                <FontAwesomeIcon icon={ faTimes }/>
              </button>
            </div>
            <div className="modal-body">
              {!capturedImage ? (
                <>
                  <div className="d-flex justify-content-center mb-3">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="img-fluid"
                      style={{ display: mode === 'camera' ? 'block' : 'none', width: "100%", marginBottom: "20px", borderRadius: "10px" }}
                    ></video>
                    {mode === null && (
                      <div className="text-center p-4 border">
                        <p>Choose how you want to scan your document</p>
                      </div>
                    )}
                  </div>
                  <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                  
                  <div className="d-flex gap-2 justify-content-center"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                    {mode === null ? (
                      <>
                        <button 
                          type="button" 
                          className="btn btn-primary"
                          onClick={startCamera}
                        >
                          <FontAwesomeIcon icon={faCamera} className="me-2" />
                          Use Camera
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => fileInputRef.current.click()}
                        >
                          Upload Image
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleFileUpload}
                        />
                      </>
                    ) : mode === 'camera' ? (
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={captureImage}
                      >
                        Capture Image
                      </button>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-3">
                    <img 
                      src={capturedImage}
                      style={{
                        width: "100%", marginBottom: "20px", borderRadius: "10px", height: "50vh",
                      }} 
                      alt="Captured Document" 
                      className="img-fluid"
                    />
                  </div>
                  <div className="d-flex gap-2 justify-content-center">
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={extractDataFromImage}
                      disabled={isExtractingData}
                    >
                      {isExtractingData ? 'Extracting...' : 'Extract Data'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setCapturedImage(null);
                        setMode(null);
                      }}
                    >
                      Retake
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
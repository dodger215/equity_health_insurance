import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignatureComponent = () => {
  const signatureRef = useRef(null);
  const fileInputRef = useRef(null);
  const [signatureMethod, setSignatureMethod] = useState('draw'); 
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current.files[0]) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('signature', fileInputRef.current.files[0]);

    try {
      const response = await fetch('upload.php', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      if (response.ok) {
        alert('Signature uploaded successfully!');
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="sign" style={{
        width: "100%",
        height: "45vh",
        maxHeight: "45vh",
        overflowY: "scroll",
    }}>  
      <h2>Signature</h2>
      
      <div style={{ display: "flex", flexDirection: "row"}} classname="group">
        <label style={{ display: "flex", flexDirection: "row"}}>
          <input
            type="radio"
            name="signatureMethod"
            value="draw"
            checked={signatureMethod === 'draw'}
            onChange={() => setSignatureMethod('draw')}
            style={{ marginRight: '5px', width: "20px" }}
          />
          Draw Signature
        </label>
        
        <label style={{ display: "flex", flexDirection: "row"}}>
          <input
            type="radio"
            name="signatureMethod"
            value="upload"
            checked={signatureMethod === 'upload'}
            onChange={() => setSignatureMethod('upload')}
            style={{  }}
          />
          Upload Signature
        </label>
      </div>

      {signatureMethod === 'draw' ? (
        <>
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              width: 250,
              height: 200,
              className: 'signature-canvas',
              style: { border: '1px solid #000', background: '#fff', margin: "5px 30px", borderRadius: "20px"}
            }}
          />
          <button 
            type="button" 
            onClick={() => signatureRef.current.clear()}
            style={{ 
              margin: '10px 0',
              padding: '8px 15px',
              backgroundColor: 'var(--light)',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Signature
          </button>
        </>
      ) : (
        <>
          <input 
            type="file" 
            accept='image/*'
            ref={fileInputRef}
            
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          {previewImage ? (
            <div style={{ margin: '10px 0', position: 'relative',  width: "250px", height: "200px" }}>
              <img 
                src={previewImage} 
                alt="Signature Preview" 
                style={{ 
                  maxWidth: '500px', 
                  maxHeight: '200px', 
                  border: '1px solid #000',
                  display: 'block'
                }}
              />
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                style={{ 
                  position: 'absolute', 
                  top: '5px', 
                  right: '5px', 
                  background: 'red', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '100px',
                  width: '25px',
                  height: '25px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <div 
              onClick={triggerFileInput}
              style={{
                width: '500px',
                height: '200px',
                border: '2px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                margin: '10px 0',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                transition: 'border-color 0.3s',
                ':hover': {
                  borderColor: '#999'
                },
                 width: "250px", height: "200px"

              }}
            >
              <p style={{ color: '#666' }}>Click to select signature image</p>
            </div>
          )}
          
          {/* <button
            type="button"
            onClick={handleUpload}
            disabled={!previewImage || isUploading}
            style={{ 
              margin: '10px 0',
              padding: '8px 15px',
              backgroundColor: previewImage ? '#4CAF50' : 'var(--light)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: previewImage ? 'pointer' : 'not-allowed',
              opacity: isUploading ? 0.7 : 1
            }}
          >
            {isUploading ? 'Uploading...' : 'Upload Signature'}
          </button> */}
        </>
      )}
    </div>
  );
};

export default SignatureComponent;
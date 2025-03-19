import React from 'react';
import { useRef } from 'react';

const PDFTemplate = ({ client, dependants, policies }) => {
  const pdfTemplateRef = useRef(null);
  return (
    <div id="pdf-template" className='pdf-template' style={{ fontFamily: 'Times New Roman, serif', padding: '20px', maxWidth: '700px', margin: '0 auto', fontSize: '12px', color: '#333333' }} ref={pdfTemplateRef}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a73e8', margin: '0' }}>EQUITY HEALTH INSURANCE</h1>
        <h2 style={{ fontSize: '16px', color: '#1a73e8', margin: '5px 0 0 0' }}>POLICY FORM</h2>
      </div>

      {/* Form Number Section */}
      <div style={{ margin: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
          <span style={{ width: '150px', color: '#555555', fontWeight: 'bold' }}>FORM NUMBER:</span>
          <input type="text" style={{ flex: 1, border: 'none', borderBottom: '1px solid #cccccc', marginLeft: '10px', padding: '4px 0' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
          <span style={{ width: '150px', color: '#555555', fontWeight: 'bold' }}>PASSPORT PICTURE</span>
          {/* <label style={{ color: '#1a73e8', textDecoration: 'underline', cursor: 'pointer' }}>
            <input type="file" hidden accept="image/*" />
            [Upload Photo]
          </label> */}
        </div>
      </div>

      <div style={{ borderBottom: '1px solid #cccccc', margin: '15px 0' }}></div>

      {/* Client Information */}
      <div style={{ margin: '20px 0' }}>
        <div style={{ fontWeight: 'bold', color: '#1a73e8', marginBottom: '10px', fontSize: '14px' }}>CLIENT INFORMATION</div>
        {[
          { label: 'First Name:', value: client.first_name },
          { label: 'Surname:', value: client.surname },
          { label: 'Other Names:', value: client.other_names },
          { label: 'Gender:', value: client.gender },
          { label: 'Ghana Card No:', value: client.national_id_number },
          { label: 'ID Type:', value: client.id_type },
          { label: 'ID Number:', value: client.id_number },
          { label: 'Phone Number:', value: client.phone_number },
          { label: 'Email Address:', value: client.email_address },
          { label: 'Nationality:', value: client.nationality },
          { label: 'Residential Address:', value: client.residential_address },
          { label: 'City/Town:', value: client.city_town },
          { label: 'Country:', value: client.country },
          { label: 'Occupation:', value: client.occupation },
        ].map((field, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
            <span style={{ width: '150px', color: '#555555', fontWeight: 'bold' }}>{field.label}</span>
            <span>{field.value}</span>
          </div>
        ))}
      </div>

      <div style={{ borderBottom: '1px solid #cccccc', margin: '15px 0' }}></div>

      {/* Dependants */}
      <div style={{ margin: '20px 0' }}>
        <div style={{ fontWeight: 'bold', color: '#1a73e8', marginBottom: '10px', fontSize: '14px' }}>DEPENDANTS</div>
        {dependants.length > 0 ? (
          dependants.map((dependant, index) => (
            <div key={index} style={{ margin: '10px 0' }}>
              <div style={{ fontWeight: 'bold', color: '#555555', fontSize: '13px' }}>Dependant {index + 1}</div>
              {[
                { label: 'Full Name:', value: dependant.full_name },
                { label: 'Date of Birth:', value: dependant.date_of_birth },
                { label: 'Relation Type:', value: dependant.relation_type },
              ].map((field, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', margin: '6px 0' }}>
                  <span style={{ width: '150px', color: '#555555', fontWeight: 'bold' }}>{field.label}</span>
                  <span>{field.value}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No dependants found.</p>
        )}
      </div>

      <div style={{ borderBottom: '1px solid #cccccc', margin: '15px 0' }}></div>

      {/* Policies */}
      <div style={{ margin: '20px 0' }}>
        <div style={{ fontWeight: 'bold', color: '#1a73e8', marginBottom: '10px', fontSize: '14px' }}>POLICIES</div>
        {policies.length > 0 ? (
          policies.map((policy, index) => (
            <div key={index} style={{ margin: '10px 0' }}>
              <div style={{ fontWeight: 'bold', color: '#555555', fontSize: '13px' }}>Policy {index + 1}</div>
              {[
                { label: 'Product Name:', value: policy.product_name },
                { label: 'Product Code:', value: policy.product_code },
              ].map((field, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', margin: '6px 0' }}>
                  <span style={{ width: '150px', color: '#555555', fontWeight: 'bold' }}>{field.label}</span>
                  <span>{field.value}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No policies found.</p>
        )}
      </div>

      <div style={{ borderBottom: '1px solid #cccccc', margin: '15px 0' }}></div>

      {/* Signature */}
      {/* <div style={{ margin: '20px 0' }}>
        <div style={{ fontWeight: 'bold', color: '#1a73e8', marginBottom: '10px', fontSize: '14px' }}>SIGNATURE</div>
        <div style={{ width: '100%', height: '80px', border: '1px solid #cccccc', marginTop: '10px' }}>
          <img src={signature} alt="Signature" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </div> */}
    </div>
  );
};

export default PDFTemplate;
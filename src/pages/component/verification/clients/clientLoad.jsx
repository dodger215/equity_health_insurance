import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAngleRight, faAngleDown, faSearch, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../link';
import { PrimaryLoading } from '../../ui/loading';

const ClientListLoaded = () => {
  const [allClients, setAllClients] = useState([]);
  const [uniqueClients, setUniqueClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [clientCounts, setClientCounts] = useState({});
  const [expandedClient, setExpandedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedPolicies, setSubmittedPolicies] = useState([]);
  const navigate = useNavigate();


  // useEffect(() => {
  //   const fetchSumbmitedPolicies = async () => {
  //     await fetch(`${API_URL}/submitted/policies/`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch clients');
  //       }
  //     })
  //     .then(data => {
  //       setSubmittedPolicies(data);
  //       console.table(data)
  //     })
  //   }

  //   fetchSumbmitedPolicies();
  // })

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_URL}/clients/policy/`);
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        setAllClients(data);

        // Create a count of how many times each name combination appears
        const counts = {};
        data.forEach(client => {
          const nameKey = `${client.FirstName || ''}|${client.LastName || ''}|${client.OtherNames || ''}`;
          counts[nameKey] = (counts[nameKey] || 0) + 1;
        });
        setClientCounts(counts);

        // Filter duplicates based on name combination
        const unique = data.filter((client, index, self) =>
          index === self.findIndex((c) => (
            c.FirstName === client.FirstName &&
            c.LastName === client.LastName &&
            c.OtherNames === client.OtherNames
          ))
        );
        
        setUniqueClients(unique);
        setFilteredClients(unique);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(uniqueClients);
    } else {
      const filtered = uniqueClients.filter(client => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${client.FirstName || ''} ${client.LastName || ''} ${client.OtherNames || ''}`.toLowerCase();
        const phone = client.PhoneNumber ? client.PhoneNumber.toLowerCase() : '';
        const email = client.Email ? client.Email.toLowerCase() : '';
        const id = client.NationalIDNumber ? client.NationalIDNumber.toLowerCase() : '';
        
        return (
          fullName.includes(searchLower) || 
          phone.includes(searchLower) || 
          email.includes(searchLower) || 
          id.includes(searchLower)
        );
      });
      setFilteredClients(filtered);
    }
  }, [searchTerm, uniqueClients]);

  const toggleClientDetails = (clientId) => {
    if (expandedClient === clientId) {
      setExpandedClient(null);
    } else {
      setExpandedClient(clientId);
    }
  };

  const getDuplicateCount = (client) => {
    const nameKey = `${client.FirstName || ''}|${client.LastName || ''}|${client.OtherNames || ''}`;
    return clientCounts[nameKey] || 1;
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center" style={{
        background: "var(--main-light)",
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden"><PrimaryLoading/></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Oops! Something Went wrong! 
          
        </div>
      </div>
    );
  }

  return (
    <div className="" style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
    }}>
      {uniqueClients.length > 10 && (
        <div className="mb-3" style={{
          padding: '0 15px',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 100,
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div className="input-group">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
      
      <div className="list-group" style={{
        maxHeight: "85vh",
        overflowY: "scroll",
      }}>
        {filteredClients.map((client) => {
          const duplicateCount = getDuplicateCount(client);
          
          return (
            <div key={client.ClientID} className="list-group-item" style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                 >
                    <div className="me-3">
                      <FontAwesomeIcon icon={faUser} size="lg" />
                    </div>
                    <div style={{
                      fontSize: "1em",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center"
                    }}>
                      {(() => {
                        const nameParts = [
                          client.FirstName,
                          client.LastName,
                          client.OtherNames
                        ].filter(part => part && part.trim() !== ''); 

                        return (
                          <>
                            {nameParts.join(' ')}
                            {duplicateCount > 1 && (
                              <span style={{
                                marginLeft: "8px",
                                backgroundColor: "#e0e0e0",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8em"
                              }}>
                                {duplicateCount}
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div>
                    <FontAwesomeIcon 
                      onClick={() => toggleClientDetails(client.ClientID)}
                      icon={expandedClient === client.ClientID ? faAngleDown : faAngleRight} 
                      size="lg" 
                    />
                  </div>
                </div>
              </div>

              {expandedClient === client.ClientID && (
                <div className="mt-3 p-3 bg-light rounded" style={{
                  margin: "20px 0",
                  maxHeight: "40vh",
                  overflowY: "scroll",
                }}>
                  <div className="row">
                    <div className="col-md-6 list-detail">
                      <p><strong>Gender:</strong> {client.Gender}</p>
                      <p><strong>Date of Birth:</strong> {client.DateOfBirth}</p>
                      <p><strong>Phone:</strong> {client.PhoneNumber}</p>
                      <p><strong>Email:</strong> {client.Email}</p>
                    </div>
                    <div className="col-md-6 list-detail">
                      <p><strong>National ID:</strong> {client.NationalIDNumber}</p>
                      <p><strong>Address:</strong> {client.ResidentialAddress}</p>
                      <p><strong>City:</strong> {client.City}</p>
                      <p><strong>Country Code:</strong> {client.CountryCode}</p>
                      <p><strong>Occupation:</strong> {client.Occupation}</p>
                      {/* <p style={{
                        fontSize: "0.7em",
                      }}><strong>Client Code:</strong> {client.ClientCode}</p> */}
                    </div>
                    <button 
                    style={{
                      width: "100%"
                    }}
                    onClick={() => navigate(`/insurance/form/shortcut/${client.ClientID}`)}
                    ><FontAwesomeIcon icon={faFileAlt}/></button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientListLoaded;
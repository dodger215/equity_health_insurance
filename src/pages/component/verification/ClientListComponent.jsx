import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ClientListLoaded from './clients/clientLoad';
import { InternetLoader } from '../ui/loading';
import { Close } from '../ui/button';
import { faTrash, faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../link';
import { PopupContext } from '../../../App';

const ClientList = () => {
  const { setPopupState } = useContext(PopupContext);
  const [Error, setError] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('clients');
  const [selectedClients, setSelectedClients] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const agentId = localStorage.getItem("id");

  useEffect(() => {
    axios.get(`${API_URL}/get/clients/${agentId}`)
      .then(response => {
        const filteredClients = response.data.filter(client => !client.is_submitted);
        setClients(filteredClients);
        setNotFound(filteredClients.length === 0);
      })
      .catch(error => {
        console.error('Error fetching clients:', error);
        setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [agentId]);

  const handleDelete = (clientId) => {
    setIsLoading(true);
    axios.delete(`${API_URL}/delete/client/${clientId}`)
      .then(response => {
        setPopupState({
          show: true,
          message: `Client deleted successfully`,
          page: 'prospect_forms',
        });
        // Remove deleted client from the list
        setClients(clients.filter(client => client.client_id !== clientId));
        // Remove from selected clients if present
        setSelectedClients(selectedClients.filter(id => id !== clientId));
      })
      .catch(error => {
        setPopupState({
          show: true,
          message: `Error deleting client: ${error.message}`,
          page: 'prospect_forms',
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteSelected = () => {
    setIsLoading(true);
    const deletePromises = selectedClients.map(clientId => 
      axios.delete(`${API_URL}/delete/client/${clientId}`)
    );

    Promise.all(deletePromises)
      .then(() => {
        setPopupState({
          show: true,
          message: `${selectedClients.length} clients deleted successfully`,
          page: 'prospect_forms',
        });
        // Remove all selected clients from the list
        setClients(clients.filter(client => !selectedClients.includes(client.client_id)));
        setSelectedClients([]);
        setIsSelectMode(false);
      })
      .catch(error => {
        setPopupState({
          show: true,
          message: `Error deleting clients: ${error.message}`,
          page: 'prospect_forms',
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleClientClick = (clientId) => {
    if (isSelectMode) {
      toggleSelect(clientId);
    } else {
      navigate(`/validate-code/${clientId}`);
    }
  };

  // Selection logic
  const handleLongPress = (clientId) => {
    setIsSelectMode(true);
    if (!selectedClients.includes(clientId)) {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const toggleSelect = (clientId) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const clearSelection = () => {
    setSelectedClients([]);
    setIsSelectMode(false);
  };

  // Long press detection
  let pressTimer;
  const startPressTimer = (clientId) => {
    pressTimer = setTimeout(() => handleLongPress(clientId), 500);
  };
  const clearPressTimer = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };

  if (isLoading) {
    return <InternetLoader />;
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'clients':
        return (
          <>
            {isSelectMode && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 25px',
                background: '#ff6161',
                color: 'white',
                alignItems: 'center'
              }}>
                <span>{selectedClients.length} selected</span>
                <div>
                  <button 
                    onClick={clearSelection}
                    style={{ marginRight: '10px', background: 'white', border: 'none', padding: '5px 10px', color: "#000", borderRadius: '5px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteSelected}
                    style={{ background: 'white', border: 'none', padding: '5px 10px', color: "#000", borderRadius: '5px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            
            {notFound ? (
              <p style={{ margin: "60px auto", padding: "30px 20px" }}>No clients found.</p>
            ) : (
              <ul style={{
                padding: "20px 25px",
                background: "#efefef",
                maxHeight: "60vh",
                overflowY: "scroll",
              }}>
                {clients.map(client => (
                  <li
                    style={{
                      background: selectedClients.includes(client.client_id) ? "#ccc" : "#ff6161",
                      color: "#fff",
                      padding: "20px",
                      borderRadius: "10px",
                      listStyle: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      margin: '10px 0',
                      color: selectedClients.includes(client.client_id) ? "#fff" : "#000",
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                    key={client.client_id}
                    onClick={() => handleClientClick(client.client_id)}
                    onTouchStart={() => startPressTimer(client.client_id)}
                    onTouchEnd={clearPressTimer}
                    onMouseDown={() => startPressTimer(client.client_id)}
                    onMouseUp={clearPressTimer}
                    onMouseLeave={clearPressTimer}
                  >
                    <p style={{
                      fontWeight: "700",
                      color: "#ffffff",
                    }}><FontAwesomeIcon icon={ faUser }/> {client.first_name} {client.surname}</p>
                    {isSelectMode ? (
                      <FontAwesomeIcon 
                        icon={faCheck} 
                        style={{
                          color: selectedClients.includes(client.client_id) ? "#ff6161" : "#fff",
                          background: selectedClients.includes(client.client_id) ? "#fff" : "transparent",
                          borderRadius: '50%',
                          padding: '2px',
                        }}
                      />
                    ) : (
                      
                     ""
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        );
      case 'shortcut':
        return (
          <div style={{ 
            padding: "20px", 
            display: "flex", 
            alignItems: "center" 
          }}>
            <ClientListLoaded style={{ width: "100%" }}/>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Close tab={'home'}/>
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #ccc',
        marginBottom: '20px',
        margin: "43px 0"
      }}>
        <button
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'clients' ? '#ff6161' : 'transparent',
            color: activeTab === 'clients' ? 'white' : 'black',
            cursor: 'pointer',
            fontSize: '16px',
            borderRadius: "0px 0px 0 0",
            flex: 1
          }}
          onClick={() => {
            setActiveTab('clients');
            setIsSelectMode(false);
            setSelectedClients([]);
          }}
        >
          Client List
        </button>
        <button
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'shortcut' ? '#ff6161' : 'transparent',
            color: activeTab === 'shortcut' ? 'white' : 'black',
            cursor: 'pointer',
            fontSize: '16px',
            borderRadius: "0px 0px 0px 0px",
            flex: 1
          }}
          onClick={() => {
            setActiveTab('shortcut');
            setIsSelectMode(false);
            setSelectedClients([]);
          }}
        >
          Captioned Client
        </button>
      </div>
      
      <h1 style={{
        margin: "20px 0",
        padding: "10px"
      }}>{activeTab === 'clients' ? 'Client List' : 'Client List'}</h1>
      
      {renderTabContent()}
    </div>
  );
};

export default ClientList;
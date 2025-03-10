import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { InternetLoader } from '../ui/loading';
import { Close } from '../ui/button';
import { faTrash, faTruck } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../link';

const ClientList = () => {
  const [Error, setError] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken")
      const agentId = localStorage.getItem("id")
      // console.log(token)

  

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

  const handleClientClick = (clientId) => {
    navigate(`/validate-code/${clientId}`);
  };

  if (isLoading) {
    return <InternetLoader />;
  }

  if (notFound) {
    return <p>No clients found.</p>;
  }

 

  return (
    <div>
      <Close/>
      <h1 style={{
        margin: "50px 0",
        padding: "10px"
      }}>Client List</h1>
      <ul style={{
        padding: "20px 25px",
        background: "#efefef"
      }}>
        {clients.map(client => (
          <li
          style={{
            background: "#ff6161",
            color: "#fff",
            padding: "20px",
            borderRadius: "10px",
            listStyle: "none",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
          key={client.client_id} onClick={() => handleClientClick(client.client_id)}>
            {client.first_name} {client.surname}

            <FontAwesomeIcon style={{color: "#fff"}} icon={ faTrash }/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
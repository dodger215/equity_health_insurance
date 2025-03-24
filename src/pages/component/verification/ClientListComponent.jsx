import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { InternetLoader } from '../ui/loading';
import { Close } from '../ui/button';
import { faTrash, faTruck } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../link';
import { PopupContext } from '../../../App';
import { useContext } from 'react';

const ClientList = () => {
   const { setPopupState } = useContext(PopupContext)
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

  const handleDelete = ({clientId}) => {
    axios.delete(`${API_URL}/delete/client/${clientId}`)
    .then(reponse => {
      setPopupState({
        show: true,
        message: `${reponse}`, 
        page: 'prospect_forms',
      });
    })
    .catch(error => {
      setPopupState({
        show: true,
        message: `${error}`, 
        page: 'prospect_forms',
      });
    })
    .finally(() => setIsLoading(false));
  };

  

  const handleClientClick = (clientId) => {
    navigate(`/validate-code/${clientId}`);
  };

  if (isLoading) {
    return <InternetLoader />;
  }

  if (notFound) {
    return (
      <div>
        <Close tab="home"/>
        <p style={{
          margin: "60px auto",
          padding: "30px 20px"
        }}>No clients found.</p>
      </div>
      );
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
        background: "#efefef",
        maxHeight: "60vh",
        overflowY: "scroll",
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
            margin: '10px 0',
          }}
          key={client.client_id} onClick={() => handleClientClick(client.client_id)}>
            {client.first_name} {client.surname}

            <FontAwesomeIcon style={{color: "#fff"}} icon={ faTrash } onClick={() => handleDelete(client.client_id)}/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Dashboard.module.css"
import Contents from "./contents"
import { InternetLoader } from "./ui/loading"

const DashboardView = () => {
  const [userData, setUserData] = useState({
    agent_id: "",
    clients: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [prospects, setProspects] = useState([]); 
  const [targetScores, setTargetScore] = useState(0);

  const [appointment, setAppointment] = useState([]); 
  const [notification, setNotification] = useState(0);



  

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("jwtToken")
      const agentId = localStorage.getItem("id")
      // console.log(token)

      let target = 0;

  

      if (!token || !agentId) {
        setError("No authentication token or agent ID found")
        setLoading(false)
        navigate("/login")
        return
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/agents/${agentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const data = await response.json()
        setUserData({
          agent_name: data.OtherNames
        })

        

          
      } catch (err) {
        setError(err.message)

      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  })


  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const agentId = localStorage.getItem("id");
  
        // Log the agentId to ensure it's correct
        console.log("Fetching appointments for agentId:", agentId);
  
        const responseProspects = await fetch(
          `http://127.0.0.1:8000/client/appointments/${agentId}`
        );
  
        // Log the response status and body
        console.log("Response status:", responseProspects.status);
        const responseBody = await responseProspects.json();
        console.log("Response body:", responseBody);
  
        if (!responseProspects.ok) {
          throw new Error(`Failed to fetch prospects: ${responseProspects.statusText}`);
        }
  
        // Ensure the response is an array
        if (Array.isArray(responseBody)) {
          setAppointment(responseBody);
          setNotification(responseBody.length);
        } else {
          setAppointment([]);
          setNotification(0);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
  
        // Set states to default values in case of error
        setAppointment([]);
        setNotification(0);
      }
    };
  
    fetchAppointment();
  }, []); 



  useEffect(() => {

    const fetchProspects = async () => {
      const agentId = localStorage.getItem("id")
      const responseProspects = await fetch(`http://127.0.0.1:8000/prospects/${agentId}`);
            if (!responseProspects.ok) {
              // throw new Error("Failed to fetch prospects");
              setProspects([]); 
              setTargetScore(0);
            }
            const prospectsData = await responseProspects.json();
    
            if (Array.isArray(prospectsData)) {
              setProspects(prospectsData.length);
              setTargetScore(prospectsData.length);
  
            } else {
              setProspects([]); 
              setTargetScore(0);
            }
    }
    fetchProspects()
    
  })


  const notify = () => {
    navigate('/notify')
  }

  if (loading) {
    return <InternetLoader/>
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>
  }

  
  // const draftScore = 0 - targetScore



 

  return (
    <div className={styles.dashboard}>
      <div className={styles.intro}><i className="fas fa-user p-3"></i>Welcome {userData.agent_name}</div>
      <div className={styles.show}>
        <div className={styles.targetScore}>
          <div className={styles.scoreCircle}>
            <div className={styles.scoreText}>{targetScores}</div>
            <p>Targets</p>
          </div>
          {/* <div className={styles.scoreCircle}>
            <div className={styles.scoreText}>{targetScores}</div>
            <p>Targets week</p>
          </div> */}
          <div className={styles.subContact}>
            <div className={styles.notification} style={{
              position: "relative",
              background: "rgb(236, 24, 24)",
            }}>
              <p style={{
                fontSize: "1.5em",
                color: "rgb(68, 7, 7)",
                fontWeight: "700",
                position: "absolute",
                right: "5px",
                top: "-5px"
              }}
              onClick={() => notify()}>{notification}</p>
              <i className="fas fa-bell"></i>
            </div>
          </div>
        </div>
      </div>

      <Contents />
      {/* <div className={styles.usersList}>
        <h3>Clients ({userData.clients.length})</h3>
        <ul>
          {userData.clients.map((client, index) => (
            <li
            key={client.id || index}
            onClick={() => navigate(`/submit-client/${client.client_id || index + 1}`)}
            className={styles.list}
          >
            {`${client.first_name} ${client.surname}` || `Client in draft ${index + 1}`}
            <i 
              className="fa fa-trash"
              onClick={() => navigate()}
              ></i>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  )
}

export default DashboardView


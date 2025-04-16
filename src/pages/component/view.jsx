"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Dashboard.module.css"
import Contents from "./contents"
import { InternetLoader } from "./ui/loading"
import API_URL from "./link"
import { faBell, faShake } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import OfflinePage from "./ui/error"
import AOS from 'aos';
import 'aos/dist/aos.css';


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

  const token = localStorage.getItem("jwtToken")
  const agentId = localStorage.getItem("id")

  
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in milliseconds
      easing: 'ease-in-out', // default easing for AOS animations
      once: false // whether animation should happen only once
    });
  })
  useEffect(() => {
    const fetchDashboardData = async () => {
      
      // console.log(token)

      let target = 0;

  

      if (!token || !agentId) {
        setError("No authentication token or agent ID found")
        setLoading(false)
        navigate("/login")
        return
      }

      try {
        const response = await fetch(`${API_URL}/agents/${agentId}`, {
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
        navigate("/login")

      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  })


  

  useEffect(() => {
    
    const fetchProspects = async () => {
      try{
        const agentId = localStorage.getItem("id")
            const responseProspects = await fetch(`${API_URL}/prospects/${agentId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
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
      catch(error){
        console.log("No Prospect Found")
        setProspects([]); 
        setTargetScore(0);
      }
      
    }
    fetchProspects()
    
  }, []);


  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const agentId = localStorage.getItem("id");
        console.log(`Agent id: ${agentId}`);
  
        // Log the agentId to ensure it's correct
        console.log("Fetching appointments for agentId:", agentId);
  
        const responseProspects = await fetch(
          `${API_URL}/client/appointments/${agentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
  
        // Log the response status and body
        console.log("Response status:", responseProspects.status);
        const responseBody = await responseProspects.json();
        console.log("Response body:", responseBody);
  
        if (!responseProspects.ok) {
          throw new Error(`Failed to fetch prospects: ${responseProspects.statusText}`);
        }

  
        if (Array.isArray(responseBody)) {
          setAppointment(responseBody);
          setNotification(responseBody.length);
        } else {
          setAppointment([]);
          setNotification(0);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
  
        console.log("No Appointments")
        setAppointment([]);
        setNotification(0);
      }
    };
  
    fetchAppointment();
  }, [token]); 



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
      <div className={styles.intro} data-aos="fade-in" data-aos-delay="100"><i className="fas fa-user p-3"></i>Welcome {userData.agent_name}</div>
      <div className={styles.show}>
        <div className={styles.targetScore}>
          <div className={styles.scoreCircle} data-aos="zoom-in" data-aos-delay="150">
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
            }}
            onClick={() => notify()}>
              <div style={{
                background: "#fff",
                borderRadius: "100px",
                padding: "5px 10px",
                fontSize: "1em",
                color: "rgb(68, 7, 7)",
                fontWeight: "700",
                position: "absolute",
                right: "-8px",
                top: "-10px"
              }}
              >{notification}</div>
              {/* <i className={`fas fa-bell ${font}`}></i> */}
              <FontAwesomeIcon 
              style={{
                color: "#fff",
                fontSize: "1.8em",
              }}
              icon={ faBell } className={notification > 0 ? "fa-shake" : ''} />
            </div>
          </div>
        </div>
      </div>

      <Contents data-aos="fade-in" data-aos-delay="200"/>
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


"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Dashboard.module.css"
import Contents from "./contents"
import { InternetLoader } from "./ui/loading"
import API_URL from "./link"
import { faBell, faShake, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import OfflinePage from "./ui/error"
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from "axios";
import { Badge } from "react-bootstrap"




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
  const [prospectsList, setProspectsList] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [policiesNumber, setPoliciesNumber] = useState(0);
  const [show, setShow] = useState(false);

  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("jwtToken")
  const agentId = localStorage.getItem("id")

  

  
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in milliseconds
      easing: 'ease-in-out', // default easing for AOS animations
      once: false // whether animation should happen only once
    });
  })



  const handleOpenPolicy = () => {
    setShow(true);
  }

  const handlePolicyRoute = ({amount, clientCode}) => {
    navigate(`/momo/payment/${amount}/${clientCode}`)
  }

  const handleClosePolicy = () => {
    setShow(false);
  }
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        
        // 1. Fetch agent data
        if (!token || !agentId) {
          throw new Error("No authentication token or agent ID found")
        }

        const productResponse = await fetch(`${API_URL}/show/product/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        

        

        if (!productResponse.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const productData = await productResponse.json();
        setProducts(productData);
        console.table(productData);

        const agentResponse = await fetch(`${API_URL}/agents/${agentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!agentResponse.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const agentData = await agentResponse.json()
        setUserData({
          agent_name: agentData.OtherNames
        })

        // 2. Fetch policies
        const policiesResponse = await axios.get(`${API_URL}/all/policy/with-details/`)
        const filteredPolicies = policiesResponse.data.filter(policy => (
          policy.AgentID.toString() === agentId &&
          policy.Status.toLowerCase() === 'pending' && 
          policy.government_deductions.length === 0 && 
          policy.bank_deductions.length === 0 && 
          policy.callback_payments.length === 0
        ))
        setPolicies(filteredPolicies)
        console.table(filteredPolicies);
        setPoliciesNumber(filteredPolicies.length)

        // 3. Fetch prospects
        const prospectsResponse = await fetch(`${API_URL}/prospects/${agentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        
        const prospectsData = await prospectsResponse.json()
        if (Array.isArray(prospectsData)) {
          setProspects(prospectsData)
          setTargetScore(prospectsData.length)
        }

        // 4. Fetch appointments
        const appointmentsResponse = await fetch(`${API_URL}/client/appointments/${agentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        
        const appointmentsData = await appointmentsResponse.json()
        if (Array.isArray(appointmentsData)) {
          setAppointment(appointmentsData)
          setNotification(appointmentsData.length)
        }

      } catch (err) {
        setError(err.message)
        if (err.message.includes("authentication")) {
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [token, agentId, navigate])




  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      setCurrentIndex(prev => Math.min(prev + 1, 1));
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

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
        <div 
            className={styles.sliderContainer}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={sliderRef}
          >
            <div 
              className={styles.sliderTrack}
              style={{ 
                width: "200%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "40px",
                transform: `translateX(-${currentIndex * 50}%)`,
              }}
            >
              <div className={`${styles.scoreCircle} ${styles.slide}`} data-aos="zoom-in" data-aos-delay="150" style={{
                left: "100px",
              }}>
                <div className={styles.scoreText}>{targetScores}</div>
                <p>Targets</p>
                
              </div>
              <div className={`${styles.scoreCircle} ${styles.slide}`} style={{
                right: "100px",
              }} 
                onClick={() => handleOpenPolicy()}
              >
                <div className={styles.scoreText}>{policiesNumber}</div>
                <p style={{
                  fontSize: "0.7em",
                  fontWeight: "700"
                }}>Pending Payments</p>
              </div>
            </div>
            
            {/* Optional dots indicator */}
            <div className={styles.dotsContainer}>
              {[0, 1].map((_, index) => (
                <span 
                  key={index}
                  className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
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

      {show === true ? (
          <div style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            background: "#00000000",
            zIndex: "999999999",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}>
            <div className={styles.card} data-aos="zoom-in" data-aos-delay="100">
              <div style={{
                margin: "5px 5px"
              }}
              onClick={() => handleClosePolicy()}
              >
                <FontAwesomeIcon icon={ faTimes } />
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}>
                <h2>Pending Payment</h2>
                
                <ul className={ styles.lists } >
                {policies.length === 0 ? (
                    <p>No Pending Payment</p>
                  ) : (
                    policies.map(policy => {
                      // Find the product that matches this policy's ProductID
                      const product = products.find(p => p.ProductID === policy.ProductID);
                      
                      return (
                        <li 
                          key={policy.ClientCode}  // Don't forget a unique key!
                          className={styles.label} 
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "20px 0",
                          }}
                          onClick={() => handlePolicyRoute(policy.Premium, policy.ClientCode)}
                        >
                          <p style={{
                            fontSize: "0.7em",
                            fontWeight: "700",
                          }}>
                            <FontAwesomeIcon icon={faUser} />
                            {policy.client.FirstName} {policy.client.LastName} - {product ? product.Name : 'Unknown Product'}
                          </p>

                          <Badge>
                            GHc {policy.Premium}
                          </Badge>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            </div>
          </div>
      ) : ''}

      
      
    </div>
  )
}

export default DashboardView


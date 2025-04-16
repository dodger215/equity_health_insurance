"use client"

import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import styles from "./logout.module.css"
import API_URL from "./link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faKey, faUser, } from "@fortawesome/free-solid-svg-icons"
import { useContext } from "react"
import { PopupContext } from "../../App"
import AOS from 'aos';
import 'aos/dist/aos.css';


const LogoutPage = () => {
  const { setPopupState } = useContext(PopupContext)
  const navigate = useNavigate()

  useEffect(() => {
    AOS.init({
      duration: 500, // animation duration in milliseconds
      easing: 'ease-in-out', // default easing for AOS animations
      once: false // whether animation should happen only once
    });
  })



const uploadLogin = async (clientID) => {
    const param = {
      "ClientID": clientID.toString(),
    }
    await fetch(`${API_URL}/agent/logins/`, {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(param),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        console.log("Login successful")
      }
    })
    .catch((error) => {
      console.error("Login error:", error)
    })
  }
 

  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("agents_name")
    localStorage.removeItem("id")
    localStorage.removeItem("nav")
    setPopupState({
      show: true,
      message: 'Logout Successful!', 
      page: 'login', 
    });
    navigate("/login")
  }

  const Details = () => {
    navigate("/agent/details")
  }

  const Change = () => {
    navigate("/agent/change/password")
  }

  return (
    <div className={styles.container}>
      <h1 style={{marginBottom: "-12px",}}>Settings</h1>
      <div className={styles.settingsItems} >
        <div className={styles.item} onClick={() => Details()} data-aos="zoom-in" data-aos-delay="100">
          <FontAwesomeIcon icon={ faUser } className={styles.icon}/>
          <span className={styles.details}>View Profile</span>
        </div>

        <div className={styles.item} onClick={() => Change()} data-aos="zoom-in" data-aos-delay="150">
          <FontAwesomeIcon icon={ faKey } className={styles.icon}/>
          <span className={styles.details}>Change Passward</span>
        </div>

        <div className={styles.item} data-aos="zoom-in" data-aos-delay="200">
          <FontAwesomeIcon icon={ faBook } className={styles.icon}/>
          <span className={styles.details}>Mannual</span>
        </div>

        <div className={styles.item} onClick={() => handleLogout()} data-aos="zoom-in" data-aos-delay="250">
          <i className={`${styles.icon} fas fa-power-off`}></i>
          <span className={styles.details}>logout</span>
        </div>
      </div>
    </div>
  )
}

export default LogoutPage


"use client"

import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import styles from "./logout.module.css"
import API_URL from "./link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faKey, faUser, } from "@fortawesome/free-solid-svg-icons"
import { useContext } from "react"
import { PopupContext } from "../../App"


const LogoutPage = () => {
  const { setPopupState } = useContext(PopupContext)
  const navigate = useNavigate()

 

  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("agents_name")
    localStorage.removeItem("id")
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

  return (
    <div className={styles.container}>
      <h1>Settings</h1>
      <div className={styles.settingsItems} >
        <div className={styles.item} onClick={() => Details()}>
          <FontAwesomeIcon icon={ faUser } className={styles.icon}/>
          <span className={styles.details}>View Profile</span>
        </div>

        <div className={styles.item}>
          <FontAwesomeIcon icon={ faKey } className={styles.icon}/>
          <span className={styles.details}>Change Passward</span>
        </div>

        <div className={styles.item}>
          <FontAwesomeIcon icon={ faBook } className={styles.icon}/>
          <span className={styles.details}>Mannual</span>
        </div>

        <div className={styles.item} onClick={() => handleLogout()}>
          <i className={`${styles.icon} fas fa-power-off`}></i>
          <span className={styles.details}>logout</span>
        </div>
      </div>
    </div>
  )
}

export default LogoutPage


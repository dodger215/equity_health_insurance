"use client"

import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import styles from "./logout.module.css"
import API_URL from "./link"

const LogoutPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Perform logout actions here (e.g., clear local storage, reset state)
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("agents_name")
    localStorage.removeItem("id")
  }, [])

  const handleLogout = () => {
    navigate("/login")
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Logout</h1>
      <p className={styles.message}>Are you sure you want to log out?</p>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Confirm Logout
      </button>
    </div>
  )
}

export default LogoutPage


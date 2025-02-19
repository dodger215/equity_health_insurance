"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Dashboard.module.css"

const DashboardView = () => {
  const [userData, setUserData] = useState({
    agent_id: "",
    clients: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("jwtToken")
      const agentId = localStorage.getItem("id")
      console.log(token)

      if (!token || !agentId) {
        setError("No authentication token or agent ID found")
        setLoading(false)
        navigate("/login")
        return
      }

      try {
        const response = await fetch(`https://equity-health-insurance-agent-api.onrender.com/clients/${agentId}`, {
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
          agent_id: data.agent_id,
          clients: data.clients,
          client_id: data.id,
        })
      } catch (err) {
        setError(err.message)

      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  })

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>
  }

  const targetScore = userData.clients.length
  const draftScore = 0 - targetScore

  return (
    <div className={styles.dashboard}>
      <div className={styles.intro}>Welcome {localStorage.getItem("agents_name")}</div>
      <div className={styles.show}>
        <div className={styles.targetScore}>
          <div className={styles.scoreCircle}>
            <div className={styles.scoreText}>{targetScore}%</div>
            <p>Target</p>
          </div>
        </div>
        <div className={styles.draftScore}>
          <div className={styles.scoreCircle}>
            <div className={styles.scoreText}>{draftScore}%</div>
            <p>Draft</p>
          </div>
        </div>
      </div>

      <div className={styles.usersList}>
        <h3>Clients ({userData.clients.length})</h3>
        <ul>
          {userData.clients.map((client, index) => (
            <li
            key={client.id || index}
            onClick={() => navigate(`/submit-client/${client.client_id || index}`)}
            style={{ cursor: "pointer" }}
          >
            {client.name || `Client in draft ${index + 1}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DashboardView


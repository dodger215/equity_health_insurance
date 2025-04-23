import React, { useState, useEffect } from "react";
import { Close } from "../ui/button";
import { InternetLoader } from "../ui/loading";
import API_URL from "../link";

const Notifications = () => {
  const [prospects, setProspects] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentId = localStorage.getItem("id"); 

        // Fetch prospects
        const prospectsResponse = await fetch(`${API_URL}/prospects/${agentId}`);
        if (!prospectsResponse.ok) {
          throw new Error("Failed to fetch prospects");
        }
        const prospectsData = await prospectsResponse.json();
        setProspects(prospectsData);

        // Fetch appointments
        const appointmentsResponse = await fetch(`${API_URL}/client/appointments/${agentId}`);
        if (!appointmentsResponse.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTimeLeft = (appointmentDate) => {
    const now = new Date();
    const appointmentTime = new Date(appointmentDate);
    const timeDifference = appointmentTime - now;

    if (timeDifference <= 0) {
      return "Appointment passed";
    }

    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    if (daysLeft > 0) {
      return `${daysLeft} day(s) ${hoursLeft} hour(s) left`;
    } else if (hoursLeft > 0) {
      return `${hoursLeft} hour(s) ${minutesLeft} minute(s) left`;
    } else {
      return `${minutesLeft} minute(s) left`;
    }
  };

  const groupAppointmentsByMonth = () => {
    const grouped = {};

    appointments.forEach((appointment) => {
      const date = new Date(appointment.appointment_date);
      const month = date.toLocaleString("default", { month: "long" });

      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(appointment);
    });

    return grouped;
  };

  const groupedAppointments = groupAppointmentsByMonth();

  const styles = {
    container: {
      padding: "16px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
    },
    header: {
      fontSize: "2em",
      fontWeight: "bold",
      color: "red",
      marginBottom: "16px",
      margin: "50px 0",
    },
    list: {
      listStyle: "none",
      padding: "0",
    },
    listItem: {
      backgroundColor: "#fff",
      padding: "12px",
      marginBottom: "8px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    monthHeader: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "red",
      margin: "16px 0 8px 0",
    },
    loading: {
      fontSize: "18px",
      color: "red",
    },
    error: {
      fontSize: "18px",
      color: "red",
    },
    timeLeft: {
      color: "green",
      fontWeight: "bold",
    },
    noData: {
      color: "#666",
      fontStyle: "italic",
    }
  };

  if (loading) {
    return <InternetLoader/>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <Close tab={"home"}/>
      <h1 style={styles.header}>Notifications</h1>

      {Object.keys(groupedAppointments).length === 0 ? (
        <p style={styles.noData}>No appointments scheduled</p>
      ) : (
        Object.keys(groupedAppointments).map((month) => (
          <div key={month}>
            <h2 style={styles.monthHeader}>Your Appointment on {month}</h2>
            <ul style={styles.list}>
              {groupedAppointments[month].map((appointment) => {
                const client = prospects.find((p) => 
                  p.ProspectID?.toString() === appointment.client_id?.toString() ||
                  p.id?.toString() === appointment.client_id?.toString()
                );

                const clientName = client 
                  ? `${client.FirstName || client.firstName || ''} ${client.LastName || client.lastName || ''}`.trim() 
                  : "Unknown Client";
                
                const timeLeft = getTimeLeft(appointment.appointment_date);

                return (
                  <li key={appointment.appointment_id} style={styles.listItem}>
                    <strong>Appointment scheduled with {clientName} on {new Date(appointment.appointment_date).toLocaleDateString()}</strong>
                    <div>Status: {appointment.appointment_status}</div>
                    {timeLeft !== "Appointment passed" && (
                      <div style={styles.timeLeft}>{timeLeft}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
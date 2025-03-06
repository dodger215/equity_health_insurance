import React, { useState, useEffect } from "react";
import { Close } from "../ui/button";
import { InternetLoader } from "../ui/loading";

const Notifications = () => {
  const [prospects, setProspects] = useState([]); // State for prospects
  const [appointments, setAppointments] = useState([]); // State for appointments
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Fetch prospects and appointments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentId = localStorage.getItem("id"); // Get agent ID from localStorage

        // Fetch prospects
        const prospectsResponse = await fetch(`http://127.0.0.1:8000/prospects/${agentId}`);
        if (!prospectsResponse.ok) {
          throw new Error("Failed to fetch prospects");
        }
        const prospectsData = await prospectsResponse.json();
        setProspects(prospectsData);

        // Fetch appointments
        const appointmentsResponse = await fetch(`http://127.0.0.1:8000/client/appointments/${agentId}`);
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

  // Function to calculate time left for an appointment
  const getTimeLeft = (appointmentDate) => {
    const now = new Date(); // Current date and time
    const appointmentTime = new Date(appointmentDate); // Appointment date and time
    const timeDifference = appointmentTime - now; // Difference in milliseconds

    if (timeDifference <= 0) {
      return "Appointment passed";
    }

    // Convert milliseconds to days, hours, and minutes
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

  // Group appointments by month
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

  // Styles for mobile view
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
  };

  if (loading) {
    return <InternetLoader/>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>

        <Close/>
      <h1 style={styles.header}>Notifications</h1>

      {/* Display prospects */}
      {/* <h2 style={styles.monthHeader}>Months:</h2> */}
      <ul style={styles.list}>
        {/* {prospects.map((prospect) => (
          <li key={prospect.ProspectID} style={styles.listItem}>
            <strong>{prospect.FirstName} {prospect.LastName}</strong>
            <div>Email: {prospect.Email}</div>
            <div>Phone: {prospect.Phone}</div>
          </li>
        ))} */}
      </ul>

      {/* Display appointments grouped by month */}
      {Object.keys(groupedAppointments).map((month) => (
        <div key={month}>
          <h2 style={styles.monthHeader}>{month}</h2>
          <ul style={styles.list}>
            {groupedAppointments[month].map((appointment) => {
              // Find the client in the prospects array
              const client = prospects?.find((p) => p.ProspectID.toString() === appointment.client_id.toString());

              // Log for debugging
              console.log("Appointment:", appointment);
              console.log("Client:", client);

              const clientName = client ? `${client.FirstName} ${client.LastName}` : "Unknown Client";
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
      ))}
    </div>
  );
};

export default Notifications;
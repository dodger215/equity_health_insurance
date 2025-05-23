"use client"

import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsDownToPeople, faCalendar, faFileAlt, faFileCirclePlus, faPeopleArrows, faTimeline, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Close } from "../ui/button"
import React from "react"
import { useNavigate } from "react-router-dom"
import { InternetLoader, PrimaryLoading } from "../ui/loading"
import API_URL from "../link"
import { useContext } from "react"
import { PopupContext } from "../../../App"
import Icon from "../../../img/logo.png"
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import useVibrate from "../ui/vibrator"
import useBell from "../ui/bell"

export default function AppointmentList() {
  const { setPopupState } = useContext(PopupContext)
    const navigate = useNavigate()
  const [prospects, setProspects] = useState([])
  const [appointment, setAppointment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [selectedProspect, setSelectedProspect] = useState(null)
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("09:00")
  const [appointmentNotes, setAppointmentNotes] = useState("")
  const [appointmentStatus, setAppointmentStatus] = useState("Scheduled")
  const [submitting, setSubmitting] = useState(false)
  const [agent, setAgent] = useState("");
  const [oneTime, setOneTime] = useState(false);


  const jwtToken = localStorage.getItem('jwtToken');
  const generateAppointmentCode = () => {
    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD format
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `APPT_${currentDate}_${randomNumber}`;
  }

  const ring = useBell(),
  vibrate = useVibrate();

  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in milliseconds
      easing: 'ease-in-out', // default easing for AOS animations
      once: false // whether animation should happen only once
    });
  })

  if(!jwtToken){
    navigate('/login');
    setPopupState({
      show: true,
      message: 'Oops! Something went wrong.', 
      page: 'login', 
    });
  }



  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    } else {
      console.log("This browser does not support notifications.");
    }
  };
  
  const triggerNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Message", {
        body: message,
        icon: Icon,
      });



    } else {
      console.log("Notification permission not granted.");
    }
  };



  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const appt_code = generateAppointmentCode()


  useEffect(() => {
    axios.get(`${API_URL}/agents/${localStorage.getItem('id')}`)
    .then(response => {
      setAgent(response.data);
    })
    .catch(error => setError(error))
    .finally(() => setLoading(false));
  });

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const agentId = localStorage.getItem('id');
        const response = await fetch(`${API_URL}/prospects/${agentId}`);
  
        if (!response.ok) {
          throw new Error('Failed to fetch prospects');
        }
  
        const data = await response.json();
        setProspects(data);
        console.log('Prospects Data:', data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchAppointment = async () => {
      try {
        const agentId = localStorage.getItem('id');
        const response = await fetch(`${API_URL}/client/appointments/${agentId}`);
  
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
  
        const data = await response.json();
        console.log('Appointment Data:', data);
  
        if (Array.isArray(data)) {
          setAppointment(data);

        } else if (data && Array.isArray(data.appointments)) {
          setAppointment(data.appointments);
        } else {
          setAppointment([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProspects();
    fetchAppointment();
  
    const interval = setInterval(() => {
      fetchProspects();
      fetchAppointment();
    }, 1000); 
  
  
    return () => clearInterval(interval);
  }, []);



  const handleCreateAppointment = (prospect) => {
    setSelectedProspect(prospect)
    const today = new Date()
    const formattedDate = today.toISOString().split("T")[0]
    setAppointmentDate(formattedDate)
    setShowAppointmentModal(true)
  }

  const handleSubmitAppointment = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const appointmentData = {
        "appointment_id": appt_code,
        "client_id": selectedProspect.ProspectID.toString(),
        "agent": selectedProspect.AgentID.toString(),
        "appointment_date": appointmentDate,
        "appointment_status": appointmentStatus,
      }

      console.log("Sending appointment data:", appointmentData)

      const response = await fetch(`${API_URL}/appointments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create appointment: ${response.status}`)
      }

      const result = await response.json()
      

      setShowAppointmentModal(false)
      setAppointmentDate("")
      setAppointmentTime("09:00")
      setAppointmentNotes("")
      setAppointmentStatus("Scheduled")

      setPopupState({
        show: true,
        message: 'Appointment scheduled Successful! 🎉', 
        page: 'login', 
      });

      const msg = `Appointment Scheduled With ${selectedProspect.FirstName.toUpperCase()} ${selectedProspect.LastName.toUpperCase()} Details: ${appointmentNotes ? '' : "No Details Set"}`;

      triggerNotification(msg);

      const message_sms = `You Have scheduled An Appointment with Agent ${agent.OtherNames.toUpperCase()} on this Date ${appointmentDate} at this ${appointmentTime}`;


        const params = {
          number: selectedProspect.Phone,
          message: message_sms
        };

          axios.post(`${API_URL}/sent-sms/`, params, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(response => {
            setPopupState({
              show: true,
              message: 'Message Sent To Client Successful!', 
              page: 'login', 
            });
            ring();
            console.log(response);
          })
          .catch(error => {
            console.log(error)
          });
    } catch (err) {
      console.error("Error creating appointment:", err)
      vibrate()
      alert(`Failed to create appointment: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }


  const deleleAppointment = async (id, $txt) => {
      try{
        const response = await fetch(`${API_URL}/delete/appointment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to create appointment: ${response.status}`)
      }
      setPopupState({
        show: true,
        message: $txt, 
        page: 'login', 
      });
    

      const msg = `Appointment Cancelled`;

      triggerNotification(msg);

      const message_sms = `Your Appointment Have Been Cancelled With Agent ${agent.OtherNames.toUpperCase()}`;


        const params = {
          number: selectedProspect.Phone,
          message: message_sms
        };

          axios.post(`${API_URL}/sent-sms/`, params, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(response => {
            setPopupState({
              show: true,
              message: 'Messege Sent To Client Successful!', 
              page: 'login', 
            });
            ring()
            console.log(response);
          })
          .catch(error => {
            console.log(error)
          });

      
       // Trigger the popup
    } catch (err) {
      console.error("Error deleting appointment:", err)
    } finally {
      setLoading(false)
    }
  }


  const closeModal = () => {
    setShowAppointmentModal(false)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        {/* <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading prospects...</p>
        </div> */}
        <InternetLoader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <p>Error: {error}</p>
        <button className="btn btn-outline-danger mt-2" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  // Check if both lists are empty
  const isBothListsEmpty = prospects.length === 0 && appointment.length === 0

  

  // Check if the lists are equal
  const areListsEqual =
    prospects.length === appointment.length &&
    prospects.every((prospect, index) => prospect.ProspectID === appointment[index]?.ProspectID)

  const handlingAutoFill = (prospects_id, appointment_id) => {
    console.log(prospects_id)
    localStorage.setItem("prospect_id", prospects_id)
    deleleAppointment(appointment_id, "Thank you for honouring your appointmet brief")

    navigate('/Form');
  }

  return (
    <div className="appiontment-container py-4 ">
      <Close title={"Appointments"} tab={"home"}/>
      <div className="card">
        <div className="card-header">
          <div className="card-main">
            <h5 className="card-title mb-0">
              <FontAwesomeIcon className="icon" icon={faPeopleArrows} />
              <div className="title-text">Your Appointments</div>
            </h5>
            <div className="card-title-1" style={{
              padding: "20px",
            }} data-aos="zoom-in" data-aos-delay="100">
              <span className="badge bg-danger rounded-pill text">{prospects.length} Prospect{prospects.length > 1 ? "s" : ''}</span>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {/* {isBothListsEmpty ? (
            <div className="text-center text-muted py-4">No prospects or appointments found.</div>
          ) : areListsEqual ? (
            <div className="text-center text-muted py-4">No new prospects to display.</div>
          ) : (
            <ul className="list-group list-group-flush">
              {prospects.map((prospect) => (
                <li
                  key={prospect.ProspectID}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="text">
                    <h6 className="mb-1">
                      {prospect.FirstName} {prospect.LastName}
                    </h6>
                    <small className="text-muted">{prospect.Email}</small>
                  </div>
                  <button className="btn btn-outline-primary" onClick={() => handleCreateAppointment(prospect)}>
                    <FontAwesomeIcon icon={faCalendar} />
                  </button>
                </li>
              ))}
            </ul>
          )} */}
          <h3 style={{
            margin: "10px",
            padding: "10px"
          }}>List Prospects</h3>
        {
          isBothListsEmpty ? (
            <div className="text-center text-muted py-4">No appointments found.</div>
          ) : areListsEqual ? (
            <div className="text-center text-muted py-4">No new appointments to display.</div>
          ) : (
            Array.isArray(prospects) && prospects.length > 0 ? (
              <ul className="list-group list-group-flush"
                style={{
                  maxHeight: "58vh",
                  overflowY: "scroll"
                }}>
                {prospects.map((prospect) => {
                  // Filter appointments for the current prospect
                  const prospectAppointments = appointment.filter(
                    (appt) => appt.client_id === prospect.ProspectID.toString()
                  );


                return (
                <React.Fragment key={prospect.ProspectID}>
                    <li className="list-group-item d-flex justify-content-between flex-column align-items-center"
                    style={{
                      margin: "15px 0",
                      marginBottom: "15px",
                    }} data-aos="zoom-in" data-aos-delay="150">
                    <div className="text">
                        <h6 className="mb-1">
                        {prospect.FirstName} {prospect.LastName}
                        </h6>
                        <small className="text-muted">{prospect.Email}</small>
                    </div>
                    <button className="btn btn-outline-primary" onClick={() => handleCreateAppointment(prospect)}>
                        <FontAwesomeIcon icon={faCalendar} />
                    </button>
                    </li>
                   
                    {prospectAppointments.length > 0 ? (
                    
                    <li className="list-group-item"
                    style={{
                        margin: "10px 0",
                        marginBottom: "30px",
                        display: "flex",
                        flexDirection: "column",
                        background: "#650505",
                        width: "100%",
                        color: "#fff"
                    }}>
                        <h2 
                        style={{
                          color: "#fff",
                          fontWeight: "600"
                        }}>Appointments:</h2>
                        <ul style={{
                            background: "#fefefef",
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column"
                        }}>
                        {prospectAppointments.map((appt) => (
                            <li key={appt.appointment_id}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              fontSize: "0.8em",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }} data-aos="zoom-in" data-aos-delay="150">
                            <div>
                              <div>
                                  <strong>Date Scheduled:</strong> <br/> {appt.appointment_date}
                              </div>
                              <div>
                                  <strong>Status:</strong> <br/> {appt.appointment_status}
                              </div>
                              <div>
                                  <strong>Create At:</strong><br/> {new Date(appt.created_at).toLocaleString()}
                              </div>
                            </div>
                            
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-around",
                              fontSize: "2em"
                            }}>
                              <FontAwesomeIcon 
                              icon={ faFileCirclePlus } 
                              style={{
                                margin: "0 15px"
                              }} 
                              onClick={() => handlingAutoFill(prospect.ProspectID, appt.appointment_id)}/>
                              <FontAwesomeIcon icon={ faTrash } 
                              onClick={() => deleleAppointment(appt.appointment_id, "Appointment Cancelled Successfully")}
                              style={{
                                margin: "0 15px",
                                color: "#fff"
                              }} />
                              
                            </div>
                            
                            </li>
                        ))}
                        </ul>
                    </li>
                    ) : (
                    <li className="list-group-item" style={{
                        color: "#fff"
                    }}>
                        <h6>Appointments:</h6>
                        <div className="text-muted" 
                        style={{
                            fontSize: "0.5em"
                        }}>Appointment not set for {prospect.FirstName} {prospect.LastName}</div>
                    </li>
                    )}
                </React.Fragment>
                );
            })}
            </ul>
        ): (
          <div className="text-center text-muted py-4">No prospects found.</div>
        )
      )
    }
        </div>
      </div>

      {/* Bootstrap Modal for Appointment Creation */}
      {showAppointmentModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ 
            backgroundColor: "rgba(0, 0, 0, 0.87)",
            position: "absolute",
            top: "4%",
            left: "0%",
            width: "100%",
            height: "96vh",
            backdropFilter: "blur(20px)",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh"
            }}>
          <div 
          
          className="modal-dialog"
          style={{
            background: "#fff",
            borderRadius: "10px",
            width: "100%",
          }}
          >
            <div className="modal-content" style={{
              width: "100%",
            }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedProspect
                    ? `Schedule Appointment with ${selectedProspect.FirstName} ${selectedProspect.LastName}`
                    : "Schedule Appointment"}
                </h5>
                
              </div>
              <form onSubmit={handleSubmitAppointment}>
                <div className="modal-body">
                  <div className="mb-3" data-aos="zoom-in" data-aos-delay="100">
                    <label htmlFor="date" className="form-label">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3" data-aos="zoom-in" data-aos-delay="150">
                    <label htmlFor="time" className="form-label">
                      Time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      required
                    />
                    <small className="text-muted">Note: Time will be stored in notes</small>
                  </div>
                  <div className="mb-3" data-aos="zoom-in" data-aos-delay="200">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      value={appointmentStatus}
                      onChange={(e) => setAppointmentStatus(e.target.value)}
                      required
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="mb-3" data-aos="zoom-in" data-aos-delay="200">
                    <label htmlFor="notes" className="form-label">
                      Notes
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      rows="3"
                      placeholder="Add any additional notes here"
                      value={appointmentNotes}
                      onChange={(e) => setAppointmentNotes(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="alert alert-info">
                    {/* <small>
                      <strong>Client ID:</strong> {selectedProspect?.ProspectID}
                      <br />
                      <strong>Agent ID:</strong> {selectedProspect?.AgentID}
                    </small> */}
                  </div>
                </div>
                <div className="modal-footer"
                style={{
                    margin: "20px 0",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
                >
                  {/* <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>
                    Cancel
                  </button> */}

                    <button type="button" className="btn-close" onClick={closeModal}>
                        <FontAwesomeIcon icon={ faTimes }/>
                    </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <PrimaryLoading />
                      </>
                    ) : (
                      "Create Appointment"
                    )}
                  </button>
                </div>
              </form>
              <button 
                type="button" 
                className="btn-close" 
                style={{ width: "100%" }} 
                onClick={() => handlingAutoFill(selectedProspect?.ProspectID)}
                >
                Fill up form, if necessary
                </button>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
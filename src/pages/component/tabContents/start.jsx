import { useNavigate } from "react-router-dom"

const Started = () => {
    const navigate = useNavigate()

    

  const set = () => {
    // Define the nav key as a string
    const nav = "product"

    localStorage.setItem("nav", nav)
    navigate("/agent/main")
    
  }
  
    const handleNavigation = (path) => {
      navigate(path)
    }
  
    return (
      <div className="start">
        <div className="list_items" onClick={() => handleNavigation("/prospect")}>
            <div className="side">
                <i className="fa-solid fa-briefcase"></i>
                <p>Prospect Form</p>
            </div>
            <i class="fa-solid fa-chevron-right"></i>
        </div>

        <div className="list_items" onClick={() => handleNavigation("/Appointment")}>
            <div className="side">
                <i className="fa-solid fa-calendar-check"></i>
                <p>Appointments</p>
            </div>
            <i class="fa-solid fa-chevron-right"></i>
        </div>

        <div className="list_items" onClick={() => handleNavigation("/ListClient")}>
            <div className="side">
                <i className="fas fa-file"></i>
                <p>Fill Forms For Clients</p>
            </div>
            <i class="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    )
  }


  export default Started
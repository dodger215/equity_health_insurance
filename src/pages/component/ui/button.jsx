import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faMinus, faCalendar, faTimes, faFileCirclePlus, faAngleLeft } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"



export function Close({title, tab}) {

    const navigate = useNavigate();

    const goBack = () => {
      navigate(-1); 
      localStorage.setItem('nav', tab);
      localStorage.removeItem('client_id')
    };
  

    return (
        <div
        
        // href="/agent/main"
         style={{
            padding: "10px 15px",
            // height: "40px",
            position: "absolute",
            width: "100%",
            top: "0px",
            left: "0px",
            color: "#fff",
            border: "none",
            background: "#fc6565",
            zIndex: "999",
            outline: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "0px",
            outline: "none",
            boxShadow: "1px 1px 12px rgba(0, 0, 17, 0.23)"
        }}>
            <FontAwesomeIcon 
            onClick={goBack}
            icon={ faAngleLeft }
            style={{
                fontSize: "1.4rem",
            }} />

            <h2 style={{
                color: "#fff",
                fontSize: "0.9em",
                marginRight: "20px"
            }}>{ title || ''}</h2>
        </div>
    )

}

export function Forms () {
    localStorage.removeItem('prospect_id');
    return (
        <a
         href="/prospect"
         style={{
            padding: "10px",
            width: "50px",
            height: "50px",
            position: "absolute",
            backgroundColor: "tranparent",
            textShadow: "1px 1px 12px rgba(0, 0, 0, 0.74)",
            bottom: "10px",
            right: "10px",
            color: "#b22222",
            border: "none",
            background: "transparent",
            fontWeight: "700",
            fontSize: "1.9em",
            zIndex: "10000000000",
            outline: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50px"
        }}
        
        >
            <FontAwesomeIcon icon={ faFileCirclePlus } />
        </a>
    )
}
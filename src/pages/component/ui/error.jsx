"client"

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi } from "@fortawesome/free-solid-svg-icons";
import { faShake } from '@fortawesome/free-solid-svg-icons'; 


const OfflinePage = () => {

    const reload = () => {
        document.location.reload();
    }

    return (
        <div style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
        }}>
            <FontAwesomeIcon icon={faWifi} beat />

            
        </div>
    );
}

export default OfflinePage;
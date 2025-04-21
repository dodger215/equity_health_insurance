import { ripples, lineSpinner } from "ldrs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export function InternetLoader () {
    useEffect(() => {
        ripples.register()
    })

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                width: "100%"
            }}
        >
            <l-ripples
            size="100"
            speed="2" 
            color="#b22222" 
            ></l-ripples>
        </div>
        
    )

}

export function MomoPending() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5); 

    useEffect(() => {
        ripples.register();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        if (countdown === 0) {
            navigate(-1);
        }

        return () => clearInterval(timer);
    }, [countdown, navigate]);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                width: "100%",
                flexDirection: "column",
                textAlign: "center",
                padding: "20px",
            }}
        >
            <l-ripples
                size="100"
                speed="2" 
                color="#b22222"
            ></l-ripples>

            <h1 style={{ fontSize: "1.2em", marginTop: "20px" }}>
                Oops! Momo Services Are Not Ready Yet
            </h1>
            <p style={{ fontSize: "1em", marginTop: "10px" }}>
                Hang tight — we're setting up Momo Payment!
            </p>
            <p style={{ marginTop: "10px", fontWeight: "bold", fontSize: "1.2em" }}>
                Returning in {countdown}...
            </p>
        </div>
    );
}





export function PrimaryLoading() {
    useEffect(() => {
        lineSpinner.register()
    })

    return(
        <l-line-spinner
        size="15"
        stroke="3"
        speed="1" 
        color="#fff" 
        ></l-line-spinner>
    )
}




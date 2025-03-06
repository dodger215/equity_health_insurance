import { ripples, lineSpinner } from "ldrs";
import { useEffect } from "react";

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


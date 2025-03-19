import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InternetLoader } from "./ui/loading";
import API_URL from "./link";


export default function ProspectDetails({prospectID}){
    const [details, setDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {
        const fetchProspect = async () => {
            try {
                const response = await fetch(`${API_URL}/get/prospects/${prospectID}`);
                if(!response.ok){
                    throw new Error(`Failed: ${response.status}`);
                }

                const result = response.json();
                setDetails(result);
                console.log(result);
            }
            catch(error){
                setError(true);
            }
            finally{
                setIsLoading(false);
            }
        };
        fetchProspect();
    }, [prospectID]);


    if (isLoading) return <InternetLoader />;
    if (error) return <p>Error .....</p>;

    return (
        <div className="details">
            {details.length === 0 ? (
                <p>No Prospect Details Found</p>
            ) : (
                <div className="info">
                    <p>Prospect's Name: {`${details.FirstName} ${details.LastName}`}</p>
                    <p>Prospect's Email Address: {`${details.Email}`}</p>
                    <p>Prospect's Date Of Birth: {`${details.DateOfBirth}`}</p>
                    <p>Prospect's Address: {`${details.Address}`}</p>
                    <a href={`tel: ${details.phone}`}>Prospect's Phone Number: {`${details.phone}`}</a>
                    <p>Prospect's Additional info: {`${details.Notes}`}</p>
                </div>
            )}
        </div>
    )
}
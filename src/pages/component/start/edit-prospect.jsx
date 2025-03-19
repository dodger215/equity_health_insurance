import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../link";
import { InternetLoader } from "../ui/loading";
import { Close } from "../ui/button";
import { useContext } from "react";
import { PopupContext } from "../../../App";

function EditProspect() {
  const { setPopupState } = useContext(PopupContext)
  const { prospectId } = useParams(); 
  const navigate = useNavigate();

  // State to store prospect details
  const [prospect, setProspect] = useState({
    ProspectID: 0,
    AgentID: 0,
    BranchID: 0,
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    DateOfBirth: "",
    Address: "",
    Source: "",
    Stage: "",
    Status: "",
    Notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch prospect details on component mount
  useEffect(() => {
    const fetchProspectDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/get/prospects/${prospectId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch prospect details");
        }
        const data = await response.json();
        setProspect(data); // Set fetched data to state
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProspectDetails();
  }, [prospectId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProspect((prevProspect) => ({
      ...prevProspect,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/prospects/${prospectId}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prospect),
      });

      if (!response.ok) {
        throw new Error("Failed to update prospect");
      }

      
      setPopupState({
        show: true,
        message: 'Updated Prospect Details Successful! 🎉', 
        page: 'prospect_forms',
      });
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <InternetLoader/>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="edit-prospect">
        <Close />
      <h2 style={{
        margin: "50px 0",
      }}>Edit Prospect</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="FirstName"
            value={prospect.FirstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="LastName"
            value={prospect.LastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={prospect.Email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="Phone"
            value={prospect.Phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="DateOfBirth"
            value={prospect.DateOfBirth}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="Address"
            value={prospect.Address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Source:</label>
          <input
            type="text"
            name="Source"
            value={prospect.Source}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* <div>
          <label>Stage:</label>
          <input
            type="text"
            name="Stage"
            value={prospect.Stage}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="text"
            name="Status"
            value={prospect.Status}
            onChange={handleInputChange}
            required
          />
        </div> */}
        <div>
          <label>Notes:</label>
          <textarea
            name="Notes"
            value={prospect.Notes}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Update Prospect</button>
      </form>
    </div>
  );
}

export default EditProspect;
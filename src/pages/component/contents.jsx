import React, { useState, useEffect, useRef } from "react";
import Tab from './tab';
import Started from './tabContents/start';
import ForwardProspect from './tabContents/commission';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import API_URL from "./link";
import { useNavigate } from "react-router-dom";
import ProspectDetails from "./details";
import { useContext } from "react";
import { PopupContext } from "../../App";

function Content() {
  const { setPopupState } = useContext(PopupContext)
  const [active, setActive] = useState('start');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [swipedId, setSwipedId] = useState(null); // Track which item is swiped
  const [touchStartX, setTouchStartX] = useState(0); // Track touch start position
  const [dialog, setDialog] = useState(null);

  const agentid = parseInt(localStorage.getItem('id'), 10);

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const response = await fetch(`${API_URL}/prospects/${agentid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch prospects");
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setProspects(data);
        } else {
          setProspects([]);
        }
      } catch (error) {
        setError("No Prospects Found");
      } finally {
        setLoading(false);
      }
    };

    fetchProspects();
  }, [agentid]);



  // Delete a prospect
  const deleteProspect = async (prospectId) => {
    try {
      const response = await fetch(`${API_URL}/prospects/${prospectId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete prospect");
      }
      // Remove the deleted prospect from the state
      setProspects((prevProspects) =>
        prevProspects.filter((prospect) => prospect.ProspectID !== prospectId)
      );
      setPopupState({
        show: true,
        message: 'Prospect deleted Successful! 🎉', // Custom message
        page: 'login', // Page identifier
      });
      deleleAppointment(prospectId);
    } catch (error) {
      console.error("Error deleting prospect:", error);
    }
  };


  const deleleAppointment = async (id) => {

        try{
          const response = await fetch(`${API_URL}/delete/appointments/${id}`, {
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
          message: "Prospect's Appointment Successful! 🎉", // Custom message
          page: 'login', 
        });
  
        

      } catch (err) {
        console.error("Error deleting appointment:", err)

      } 
    };

  const handleEdit = (prospectId) => {
    navigate(`/edit/prospect/${prospectId}`);
  };

  // Swipe logic
  const handleTouchStart = (e, prospectId) => {
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setSwipedId(prospectId); // Set the currently swiped item
  };

  const handleTouchMove = (e, prospectId) => {
    if (swipedId !== prospectId) return;

    const touch = e.touches[0];
    const diff = touch.clientX - touchStartX;

    if (diff < -50) {
      // Swipe left
      setSwipedId(prospectId);
      deleteProspect(prospectId);
    } else if (diff > 50) {
      // Swipe right
      setSwipedId(null);
    }
  };

  const handleTouchEnd = () => {
    // Reset swipe state after touch ends
    setSwipedId(null);
  };

  // Resizable recent div logic
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const recentRef = useRef(null); // Ref to the recent div

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY || e.touches[0].clientY); // Record the initial Y position (mouse or touch)
    setStartHeight(recentRef.current.offsetHeight); // Record the initial height of the recent div
  };

  const handleMouseMove = (e) => {
    if (isDragging && recentRef.current) {
      const clientY = e.clientY || (e.touches && e.touches[0].clientY); // Get Y position (mouse or touch)
      if (clientY === undefined) return;

      const deltaY = clientY - startY; // Calculate the change in Y position
      let newHeight = startHeight - deltaY; // Calculate the new height (subtract because dragging up reduces height)

      // Define height boundaries
      const minHeight = window.innerHeight * 0.5; // Minimum height (50vh)
      const maxHeight = window.innerHeight; // Maximum height (100vh)

      // Ensure the height stays within the boundaries
      if (newHeight < minHeight) {
        newHeight = minHeight;
      } else if (newHeight > maxHeight) {
        newHeight = maxHeight;
      }

      recentRef.current.style.height = `${newHeight}px`; // Update the height of the recent div
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false); // Stop dragging
  };

  useEffect(() => {
    // Add event listeners for mousemove, mouseup, touchmove, and touchend
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleMouseMove, { passive: false });
    document.addEventListener("touchend", handleMouseUp);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  // Filter prospects based on search term and filter type
  const filteredProspects = prospects.filter((prospect) => {
    const searchLower = searchTerm.toLowerCase();

    switch (filterType) {
      case "all":
        return (
          prospect.FirstName.toLowerCase().includes(searchLower) ||
          prospect.LastName.toLowerCase().includes(searchLower) ||
          prospect.Email.toLowerCase().includes(searchLower) ||
          prospect.Phone.toLowerCase().includes(searchLower)
        );
      case "name":
        return (
          prospect.FirstName.toLowerCase().includes(searchLower) ||
          prospect.LastName.toLowerCase().includes(searchLower)
        );
      case "contact":
        return (
          prospect.Email.toLowerCase().includes(searchLower) ||
          prospect.Phone.toLowerCase().includes(searchLower)
        );
      default:
        return true;
    }
  });

  return (
    <div className="contents">
      <Tab active={active} setActive={setActive} />
      <div className="contain">
        {active === 'start' && <Started />}
        {active === 'recent' && (
          <div
            className="recent"
            ref={recentRef}
            style={{ height: "50vh", position: "absolute", bottom: "-20vh" }}
          >
            <div
              className="notch"
              onMouseDown={handleMouseDown} 
              onTouchStart={handleMouseDown} 
            ></div>
            <div className="search">
              <i className="fas fa-filter"></i>
              <input
                type="text"
                placeholder="Filter"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All</option>
                <option value="name">Name</option>
                <option value="contact">Contact</option>
              </select>
            </div>

            <div className="clients-list scroll">
              <div className="client-item head">
                <div className="client-name">List Of Prospects</div>
                <div className="client-contact"></div>
              </div>
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div>Error: {error}</div>
              ) : filteredProspects.length === 0 ? (
                <div>Prospect Not Found</div>
              ) : (
                filteredProspects.map((prospect) => (
                  <div
                    key={prospect.ProspectID}
                    className={`client-item ${swipedId === prospect.ProspectID ? 'swipe-left' : ''}`}
                    onTouchStart={(e) => handleTouchStart(e, prospect.ProspectID)}
                    onTouchMove={(e) => handleTouchMove(e, prospect.ProspectID)}
                    onTouchEnd={handleTouchEnd}
                    
                  >
                    <div className="client-name">{prospect.FirstName} {prospect.LastName}</div>

                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => handleEdit(prospect.ProspectID)}
                      style={{ cursor: "pointer" }}
                    />

                    {swipedId === prospect.ProspectID && (
                      <div
                        className="delete-button"
                        onClick={() => deleteProspect(prospect.ProspectID)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {active === 'forward' && <ForwardProspect agentId={agentid} />}
      </div>
      {
        dialog === null ? '' : (
          <ProspectDetails prospectID = {dialog} />
        )
      }
    </div>
  );
}

export default Content;
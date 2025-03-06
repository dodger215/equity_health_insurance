import React, { useState, useEffect, useRef } from "react";
import Tab from './tab';
import Started from './tabContents/start';
import Commission from './tabContents/commission';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Content() {
    const [active, setActive] = useState('start');
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [prospects, setProspects] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
  
    const agentid = parseInt(localStorage.getItem('id'), 10);
    useEffect(() => {
      const fetchProspects = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/prospects/${agentid}`);
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
          setError("Not Propects Found"); 
        } finally {
          setLoading(false); 
        }
      };
  
      fetchProspects();
    }, []);
  
    // Delete a prospect
    const deleteProspect = async (prospectId) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/prospects/${prospectId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete prospect");
        }
        // Remove the deleted prospect from the state
        setProspects((prevProspects) =>
          prevProspects.filter((prospect) => prospect.ProspectID !== prospectId)
        );
      } catch (error) {
        console.error("Error deleting prospect:", error);
      }
    };
  

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
        return prospect.FirstName.toLowerCase().includes(searchLower) ||
               prospect.LastName.toLowerCase().includes(searchLower) ||
               prospect.Email.toLowerCase().includes(searchLower) ||
               prospect.Phone.toLowerCase().includes(searchLower);
      case "name":
        return prospect.FirstName.toLowerCase().includes(searchLower) ||
               prospect.LastName.toLowerCase().includes(searchLower);
      case "contact":
        return prospect.Email.toLowerCase().includes(searchLower) ||
               prospect.Phone.toLowerCase().includes(searchLower);
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
          <div className="recent"
          ref={recentRef}
          style={{ height: "50vh", position: "absolute", bottom: "-20vh" }}>
            <div className="notch"
            onMouseDown={handleMouseDown} // Mouse event for desktop
            onTouchStart={handleMouseDown} // Touch event for mobile
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
                  <div key={prospect.ProspectID} className="client-item">
                    <div className="client-name">{prospect.FirstName} {prospect.LastName}</div>
                    <div className="client-contact">{prospect.Email} | {prospect.Phone}</div>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => deleteProspect(prospect.ProspectID)} 
                      style={{ cursor: "pointer" }} 
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {active === 'commission' && <Commission />}
      </div>
    </div>
  );
}

export default Content;
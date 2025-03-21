import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faIdBadge, faVenusMars, faCheckCircle, faTimesCircle, faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';
import API_URL from './link';
import { InternetLoader } from './ui/loading';
import { Close } from './ui/button';


const AgentDetails = () => {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const agentId = localStorage.getItem("id");
  const [gain, setGain] = useState();
  const [loss, setLoss] = useState();

  useEffect(() => {
    const randomInt = Math.floor(Math.random() * 1000) + 1;
    const profit = (randomInt / 1000) * 100;
    const calculatedLoss = ((1000 - randomInt) / 1000) * 100; 

    setGain(parseInt(profit));
    setLoss(parseInt(calculatedLoss));
  }, []);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/agents/${agentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch agent details');
        }
        const data = await response.json();
        setAgent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [agentId]);

  if (loading) return <InternetLoader />;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="agent-container">
      <Close tab={'settings'}/>
      <div className="agent-card">
        {/* <img src={agent.AgentPicture || 'https://via.placeholder.com/150'} alt="Agent" className="agent-image" /> */}
        <h2 className="agent-name">
          <FontAwesomeIcon icon={faUser} className="icon" /> {agent.OtherNames}
        </h2>
            <h3 style={{
                margin: "0 auto",
                marginBottom: "5px"
            }}>Commission</h3>
        <div className='agent-quotation'>
            <div className="commission">
                <FontAwesomeIcon icon={faArrowTrendUp}  className='icon'/>
                {`Gain: ${gain}%`}
            </div>
            <div className="commission">
                <FontAwesomeIcon icon={faArrowTrendDown}  className='icon'/>
                {`Loss: ${loss}%`}
            </div>
        </div>

        <div className="agent-info">
          <p>
            <FontAwesomeIcon icon={faVenusMars} className="icon" /> Gender: {agent.Gender}
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} className="icon" /> Email: {agent.Email}
          </p>
          <p>
            <FontAwesomeIcon icon={faIdBadge} className="icon" /> Code: {agent.agent_code}
          </p>
          <p>
            <FontAwesomeIcon
              icon={agent.Status === "Active" ? faCheckCircle : faTimesCircle}
              className={`icon ${agent.Status === "Active" ? "active" : "inactive"}`}
            />
            Status: {agent.Status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
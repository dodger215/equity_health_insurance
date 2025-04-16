"use client"

import { useState, useEffect } from "react"
import API_URL from "../link"
import { InternetLoader } from "../ui/loading"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function ForwardProspect({ agentId }) {
  const [prospects, setProspects] = useState([])
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProspect, setSelectedProspect] = useState(null)
  const [selectedAgentId, setSelectedAgentId] = useState("")
  const [reason, setReason] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [isForwarding, setIsForwarding] = useState(false)

  // Fetch prospects and agents
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [prospectsRes, agentsRes] = await Promise.all([
          fetch(`${API_URL}/prospects/${agentId}`),
          fetch(`${API_URL}/agents/`)
        ])

        if (!prospectsRes.ok || !agentsRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const prospectsData = await prospectsRes.json()
        const agentsData = await agentsRes.json()

        setProspects(Array.isArray(prospectsData) ? prospectsData : [])
        setAgents(Array.isArray(agentsData) ? agentsData : [])
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [agentId])

  const handleProspectClick = (prospect) => {
    setSelectedProspect(prospect)
    setShowModal(true)
  }

  const handleForward = async () => {
    if (!selectedProspect || !selectedAgentId) return

    try {
      setIsForwarding(true)
      const response = await fetch(
        `${API_URL}/forward/prospects/${selectedProspect.ProspectID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            AgentID: parseInt(selectedAgentId),
            reason: reason
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to forward prospect")
      }

      // Update local state
      setProspects(prospects.filter(p => p.ProspectID !== selectedProspect.ProspectID))
      setShowModal(false)
      setSelectedAgentId("")
      setReason("")
    } catch (error) {
      setError(error.message)
    } finally {
      setIsForwarding(false)
    }
  }

  if (isLoading) {
    return <InternetLoader />
  }

  if (error) {
    return <p className="text-danger">Error: {error}</p>
  }

  return (
    <div className="container" style={{
      width: "100%",
      height: "100%",
      justifyContent: "start",  
      flexDirection: "column"    
    }}>
      <h2 className="mb-3">Prospects</h2>
      
      {prospects.length === 0 ? (
        <p>No prospects found</p>
      ) : (
        <ul className="list-group" style={{
          width: "100%",
        }}>
          {prospects.map((prospect) => (
            <li 
              key={prospect.ProspectID}
              className="list-group-item list-group-item-action"
              onClick={() => handleProspectClick(prospect)}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around"
                
              }}
            >
              <div className="fw-bold">
                {prospect.FirstName} {prospect.LastName}
              </div>
              {/* <div className="text-muted small">{prospect.Email}</div> */}
            </li>
          ))}
        </ul>
      )}

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} style={{
        position: "absolute",
        top: "0%",
        left: "0%",
        zIndex: "999999",
        background: "#000000ad",
        width: "100%",
        height: "100vh",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{}}>
        <Modal.Header className="m-5 w-100" >
          <Modal.Title>Forward Prospect</Modal.Title>
        </Modal.Header>
        <Modal.Body className="w-100">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Forwarding: {selectedProspect?.FirstName} {selectedProspect?.LastName}</Form.Label>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Agent</Form.Label>
              <Form.Select 
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                disabled={isForwarding}
              >
                <option value="">Select an agent</option>
                {agents.map((agent) => (
                  <option key={agent.AgentID} value={agent.AgentID}>
                    {agent.OtherNames} ({agent.agent_code})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason (Optional)</Form.Label>
              <Form.Control 
                as="input" 
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isForwarding}
                height={'300'}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}>
          <Button 
            variant="danger" 
            onClick={() => setShowModal(false)}
            disabled={isForwarding}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleForward}
            disabled={!selectedAgentId || isForwarding}
          >
            {isForwarding ? 'Forwarding...' : 'Forward'}
          </Button>
        </Modal.Footer>
        </div>
      </Modal>
    </div>
  )
}

export default ForwardProspect
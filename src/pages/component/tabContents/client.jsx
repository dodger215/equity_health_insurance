"use client"

import { useState } from "react"


function DraftClients() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const clients = [
    {
    id: 1,
    name: "John Doe",
    contact: "+1 234-567-8900",
    },
    {
    id: 2,
    name: "Jane Smith",
    contact: "jane@email.com",
    },
    {
    id: 3,
    name: "Bob Johnson",
    contact: "+1 345-678-9012",
    },
    {
    id: 4,
    name: "Alice Brown",
    contact: "alice@email.com",
    },
]
  const filteredClients = clients.filter((client) => {
    const searchLower = searchTerm.toLowerCase()

    switch (filterType) {
      case "name":
        return client.name.toLowerCase().includes(searchLower)
      case "contact":
        return client.contact.toLowerCase().includes(searchLower)
      default:
        return (
          client.name.toLowerCase().includes(searchLower) ||
          client.contact.toLowerCase().includes(searchLower) ||
          client.products.some((product) => product.toLowerCase().includes(searchLower))
        )
    }
  })

  return (
    <div className="recent m-5 container">
    <i className="fas fa-home text-danger" ></i>
      <div className="search">
        <i className="fas fa-filter"></i>
        <input type="text" placeholder="Filter" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All</option>
          <option value="name">Name</option>
          <option value="contact">Contact</option>
        </select>
      </div>

      <div className="clients-list">
        {filteredClients.map((client) => (
          <div key={client.id} className="client-item">
            <div className="client-name">{client.name}</div>
            <div className="client-contact">{client.contact}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DraftClients


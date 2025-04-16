function Tabs({ active, setActive }) {
  const tabItems = [
    { id: "start", text: "Get Started", section: "" },
    { id: "recent", text: "Prospects", section: "exclude" },
    { id: "forward", text: "Forward Propect", section: "" },
  ]

  return (
    <div className="tab">
      {tabItems.map((item) => (
        <div
          key={item.id}
          className={`tab-block ${active === item.id ? "active" : ""}`}
          onClick={() => setActive(item.id)}
        >
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  )
}

export default Tabs


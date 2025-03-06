"use client"

import { useState, useRef } from "react"
import html2pdf from "html2pdf.js"
import { format, isAfter, isBefore, parseISO } from "date-fns"

function Commission() {
  const pdfRef = useRef(null)
  const today = new Date()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState(format(today, "yyyy-MM-dd"))
  const [data, setData] = useState([
    {
      id: 1,
      date: "2024-02-25",
      total: 5000.0,
      debt: 1500.0,
      commission: 350.0,
    }
  ])

  // Filter data based on date range
  const filteredData = data.filter((item) => {
    const itemDate = parseISO(item.date)
    return (
      (!startDate || !isBefore(itemDate, parseISO(startDate))) && (!endDate || !isAfter(itemDate, parseISO(endDate)))
    )
  })

  // Calculate totals
  const totals = filteredData.reduce(
    (acc, curr) => ({
      total: acc.total + curr.total,
      debt: acc.debt + curr.debt,
      commission: acc.commission + curr.commission,
    }),
    { total: 0, debt: 0, commission: 0 },
  )

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GHS",
    }).format(amount)
  }


  const handleDownloadPDF = async () => {
    const element = pdfRef.current
    const opt = {
      margin: [0.5, 0.5],
      filename: `financial-summary-${startDate || "start"}-to-${endDate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        logging: true,
        useCORS: true,
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "landscape",
      },
    }

    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="container commission">
      <div className="row mb-4 dates">
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="form-group group">
            <label className="form-label">From:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="form-group group">
            <label className="form-label">To:</label>
            <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th className="text-end">Total</th>
              <th className="text-end">Debt</th>
              <th className="text-end">Commission</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td>{format(parseISO(row.date), "PP")}</td>
                <td className="text-end">{formatCurrency(row.total)}</td>
                <td className="text-end">{formatCurrency(row.debt)}</td>
                <td className="text-end">{formatCurrency(row.commission)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="col-md-12 col-lg-3 mb-3 d-flex align-items-end">
          <button className="btn" onClick={handleDownloadPDF}>
          <i class="fa-solid fa-download"></i>
          </button>
        </div>
      </div>


      <div ref={pdfRef} 
      style={{
        margin: "250px 0"
      }}
      >
        <div
          style={{
            padding: "20px",
            marginBottom: "20px",
            borderBottom: "2px solid #dee2e6",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <img
                src="/your-company-logo.png" // Replace with your logo URL
                alt="Company Logo"
                style={{
                  height: "60px",
                  objectFit: "contain",
                }}
              />
              <div>
                <h2 style={{ margin: "0", fontSize: "24px" }}>Financial Summary</h2>
                <p style={{ margin: "5px 0 0 0", color: "#6c757d" }}>
                  Period: {startDate  - endDate}
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0", fontSize: "14px" }}>Generated on: { startDate }</p>
              <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>Your Company Name</p>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th className="text-end">Total</th>
                <th className="text-end">Debt</th>
                <th className="text-end">Commission</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id}>
                  <td>{endDate}</td>
                  <td className="text-end">{formatCurrency(row.total)}</td>
                  <td className="text-end">{formatCurrency(row.debt)}</td>
                  <td className="text-end">{formatCurrency(row.commission)}</td>
                </tr>
              ))}
              
            </tbody>
          </table>
        </div>

        {/* PDF Footer */}
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderTop: "2px solid #dee2e6",
            fontSize: "12px",
            color: "#6c757d",
          }}
        >
          <p style={{ margin: "0" }}>
            This is an automatically generated report. For questions, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Commission
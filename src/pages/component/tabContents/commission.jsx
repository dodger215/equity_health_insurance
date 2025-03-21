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
    <div 
    style={{
      width: "100%",
      margin: "20px auto",
    }}>Coming Soon</div>
  )

}

export default Commission
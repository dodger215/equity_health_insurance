import styles from "./MicroProductOptions.module.css"
import { useNavigate } from "react-router-dom"
import { Forms, Close } from "../ui/button"
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { useContext } from "react";
import { PopupContext } from "../../../App";


const MicroProductOptions = () => {
  const contentRef = useRef(null); 
  const { setPopupState } = useContext(PopupContext)

  const handleSharePDF = async () => {
    if (!contentRef.current) return;

    try {
      // Step 1: Capture the component content as an image
      const canvas = await html2canvas(contentRef.current);
      const imgData = canvas.toDataURL("image/png");

      // Step 2: Create a PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Step 3: Save the PDF as a file
      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], "Micro.pdf", {
        type: "application/pdf",
      });

      // Step 4: Share the PDF using the Web Share API
      if (navigator.share) {
        await navigator.share({
          title: "Micro",
          files: [pdfFile],
        });
        setPopupState({
          show: true,
          message: 'PDF Successfully Sent !', 
          page: 'login', 
        });
      } else {
        console.error("Web Share API not supported in this browser.");
      }
    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
    }
  };
  
  return (
    <div className={styles.container}>

      <Close title={"MICRO PRODUCT OPTIONS"} tab={'product'}/>
      <Forms />
      <h1 className={styles.title}>MICRO PRODUCT OPTIONS</h1>

      <section className={styles.summary}>
        <h2>Premium and Benefit Summary Schedule</h2>
        <table className={styles.summaryTable}>
          <thead>
            <tr>
              <th>PLAN</th>
              <th>MICRO 1</th>
              <th>MICRO 2</th>
              <th>MICRO 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monthly premium</td>
              <td>52.00</td>
              <td>88.00</td>
              <td>122.00</td>
            </tr>
            <tr>
              <td>Monthly outpatient limit</td>
              <td>150.00</td>
              <td>250.00</td>
              <td>350.00</td>
            </tr>
            <tr>
              <td>Monthly inpatient limit</td>
              <td>850.00</td>
              <td>1,000.00</td>
              <td>1,150.00</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.benefits}>
        <h2>BENEFITS</h2>
        <ul>
          <li>Primary care only</li>
          <li>Medical consultations</li>
          <li>Laboratory [primary care]</li>
          <li>Generic medications</li>
          <li>Telemedicine consultation</li>
          <li>Optical conditions</li>
          <li>Dental conditions</li>
          <li>Monthly benefits</li>
          <li>Benefits are not accrued</li>
        </ul>
      </section>

      <section className={styles.exclusions}>
        <h2>EXCLUSIONS</h2>
        <ul>
          <li>Maternity cover</li>
          <li>Chronic conditions</li>
          <li>Dental procedures</li>
          <li>Optical aids such as lens and frame</li>
        </ul>
      </section>

      <section className={styles.premiums}>
        <h2>PREMIUMS</h2>
        <ul>
          <li>Payable in advance</li>
          <li>Payment frequencies: monthly, quarterly, half-yearly, and annually.</li>
          <li>Mode of payment: mobile money, bank transfer, cheque</li>
        </ul>
      </section>

      <section className={styles.activation}>
        <h2>ACTIVATION</h2>
        <p>On receipt of 3 months' premium</p>
      </section>

      <section className={styles.eligibility}>
        <h2>ELIGIBILITY</h2>
        <p>Ages 0 to 59 years.</p>
      </section>
    

      <button onClick={handleSharePDF} style={{ marginTop: "20px" }}>
          <FontAwesomeIcon icon={ faShareAlt }/>
        </button>
    </div>
  )
}

export default MicroProductOptions


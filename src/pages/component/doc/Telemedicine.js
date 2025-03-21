import styles from "./Telemedicine.module.css"
import { useNavigate } from "react-router-dom"
import { Forms, Close } from "../ui/button"
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { useContext } from "react";
import { PopupContext } from "../../../App";

const Telemedicine = () => {
  const { setPopupState } = useContext(PopupContext)

  const contentRef = useRef(null); 

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
      const pdfFile = new File([pdfBlob], "EbusuaHealthPackage.pdf", {
        type: "application/pdf",
      });

      // Step 4: Share the PDF using the Web Share API
      if (navigator.share) {
        await navigator.share({
          title: "Telemedicine",
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
      <Close title={"TELEMEDICINE"} tab={'product'}/>
      <Forms />
      <h1 className={styles.title}>TELEMEDICINE</h1>

      <section className={styles.introduction}>
        <h2>INTRODUCTION</h2>
        <p>
          Telemedicine refers to a health insurance solution that provides customers with round-the-clock access to
          medical consultations, diagnoses, phlebotomy, and medicine delivery services through telephone calls, all at
          the customers' convenience. This service ensures that customers can access Equity Health Medical doctors
          whenever they need assistance.
        </p>
      </section>

      <section className={styles.benefits}>
        <h2>BENEFITS BREAKDOWN</h2>
        <table className={styles.premiumTable}>
          <tbody>
            <tr>
              <td>Monthly Premium per person</td>
              <td>GHC 5.00</td>
            </tr>
            <tr>
              <td>Yearly Premium per person</td>
              <td>GHC 60.00</td>
            </tr>
          </tbody>
        </table>

        <h3>Benefits</h3>
        <ul>
          <li>Telemedicine consultation</li>
          <li>
            Laboratory investigation facilitation – assisting subscribers with the nearest facilities to have various
            tests done.
          </li>
          <li>
            Free medication delivery service in an accessible specified location if it is being purchased from Medcare
            Plus
          </li>
          <li>Medical diagnosis report (upon request)</li>
          <li>Free referral (when necessary)</li>
        </ul>
      </section>

      <section className={styles.terms}>
        <h2>Terms and Conditions</h2>
        <ol>
          <li>Service shall be delivered to only active subscribers i.e. customers who have paid their premium.</li>
          <li>Premium shall be paid monthly and reviewed annually if economically needed.</li>
          <li>The service benefits are not transferable.</li>
          <li>Each subscriber has 30 sessions (number of consultations) per year, but only 3 sessions in a month</li>
          <li>There is no waiting period on this plan.</li>
          <li>There are no surrender benefits to this plan.</li>
          <li>There is no maximum entry age limit, however, the minimum entry age is 18 years.</li>
        </ol>
      </section>
     

      <button onClick={handleSharePDF} style={{ marginTop: "20px" }}>
          <FontAwesomeIcon icon={ faShareAlt }/>
        </button>
    </div>
  )
}

export default Telemedicine


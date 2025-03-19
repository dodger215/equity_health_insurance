import styles from "./DaakyeApomuden.module.css"
import { useNavigate } from "react-router-dom"
import { Forms, Close } from "../ui/button"
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { useContext } from "react";
import { PopupContext } from "../../../App";


export default function DaakyeApomuden() {
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
          title: "Ebusua Health Package",
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

      <Close title={'DAAKYE APOMUDEN'} />
      <Forms />
      <div className={styles.header}>
        <h1></h1>
        <div className={styles.website}>www.equityhealthinsurance.com</div>
      </div>

      <div className={styles.content}>
        <h2>PREMIUM</h2>
        <p>
          Selected based on the annual sum assured or
          <br />
          Monthly contribution
        </p>

        <h2>BENEFITS</h2>
        <ul>
          <li>Contribution period benefits</li>
          <li>Daily hospitalization benefit</li>
          <li>Medical check-up</li>
          <li>Critical illness</li>
          <li>Dietary supplement support – every 2 years</li>
          <li>Death benefit</li>
          <li>Benefits for life – Telemedicine</li>
          <li>Health insurance cover for life</li>
        </ul>

        <h2>TERMS AND CONDITIONS</h2>
        <ul>
          <li>Age at entry – 18 to 65 years old</li>
          <li>Contribution period – 5 years for people below 45 years; 10 years for those above 45 years</li>
          <li>Benefits for life – full premium payment; attainment of age 45; end of contribution period</li>
          <li>
            Daily hospitalization benefit – full premium payment; 90 days waiting period; 2 nights; 30 days within
            policy year
          </li>
          <li>Cover for life – starts at 45 years with full premium payment</li>
          <li>
            Paid up – kicks in when a policyholder cannot continue with the plan; &gt; 12-month contribution;
            &gt;GHS5,000 in total premiums
          </li>
          <li>Premium waiver – activated on the death of policyholder</li>
          <li>Benefits escalator – 10% annual increment in benefits with a 10% upward adjustment in annual premiums</li>
          <li>Surrender value – not applicable</li>
          <li>Termination – death of policyholder</li>
        </ul>
      </div>
      <button onClick={handleSharePDF} style={{ marginTop: "20px" }}>
          <FontAwesomeIcon icon={ faShareAlt }/>
        </button>
      <div className={styles.website}>www.equityhealthinsurance.com</div>
    </div>
  )
}


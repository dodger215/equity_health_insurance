import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import styles from "./EbusuaHealthPackage.module.css";
import { Forms, Close } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { PopupContext } from "../../../App";


export default function EbusuaHealthPackage() {
  const { setPopupState } = useContext(PopupContext)
  const contentRef = useRef(null); // Ref to capture the component content

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
    <div className={styles.container} ref={contentRef}>
      <Close title={"EQUITY HEALTH INSURANCE"} tab={'product'}/>
      <Forms />
      <div className={styles.header}>
        <h1 className={styles.mainTitle}></h1>
        <div className={styles.subtitle}>
          FAMILY AND INDIVIDUAL HEALTH INSURANCE PACKAGE
        </div>
        <div className={styles.subtitle}>(EBUSUA HEALTH PACKAGE)</div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>EBUSUA HEALTH PACKAGE GUIDELINES</h2>
        <ul className={styles.guidelinesList}>
          <li>4 plans with 4 levels each (Shea, Oak, Mahogany, Rosewood)</li>
          <li>Family Plans: M to M+5 members</li>
          <li>Age limit: 0-59 years</li>
          <li>Premium payment options: Quarterly, Semi-annually, Annually</li>
          <li>Risk loadings for chronic conditions/60+ years</li>
          <li>Max 2 adults per family</li>
          <li>One plan/level per family</li>
          <li>Premiums payable in Advance</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>SHEA PLAN - PREMIUMS & BENEFITS</h2>
        <table className={styles.planTable}>
          <thead>
            <tr>
              <th style={{ width: "25%" }}></th>
              <th>M</th>
              <th>M+1</th>
              <th>M+2</th>
              <th>M+3</th>
              <th>M+4</th>
              <th>M+5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700 }}>OPD BENEFITS</td>
              <td>4,000</td>
              <td>7,200</td>
              <td>10,800</td>
              <td>14,400</td>
              <td>18,000</td>
              <td>21,600</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>IPD BENEFITS</td>
              <td>16,000</td>
              <td>28,800</td>
              <td>43,200</td>
              <td>57,600</td>
              <td>72,000</td>
              <td>86,400</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>SUM ASSURED</td>
              <td>20,000</td>
              <td>36,000</td>
              <td>54,000</td>
              <td>72,000</td>
              <td>90,000</td>
              <td>108,000</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.cardFee}>
          <h3>CARD FEES</h3>
          <p>GHC 30 • GHC 60 • GHC 90 • GHC 120 • GHC 150 • GHC 180</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>OAK PLAN - PREMIUMS & BENEFITS</h2>
        <table className={styles.planTable}>
          <thead>
            <tr>
              <th style={{ width: "25%" }}></th>
              <th>M</th>
              <th>M+1</th>
              <th>M+2</th>
              <th>M+3</th>
              <th>M+4</th>
              <th>M+5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700 }}>OPD BENEFITS</td>
              <td>5,000</td>
              <td>9,000</td>
              <td>13,500</td>
              <td>18,000</td>
              <td>22,500</td>
              <td>27,000</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>IPD BENEFITS</td>
              <td>25,000</td>
              <td>45,000</td>
              <td>67,500</td>
              <td>90,000</td>
              <td>112,500</td>
              <td>135,000</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>SUM ASSURED</td>
              <td>30,000</td>
              <td>54,000</td>
              <td>81,000</td>
              <td>108,000</td>
              <td>135,000</td>
              <td>162,000</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.cardFee}>
          <h3>CARD FEES</h3>
          <p>GHC 30 • GHC 60 • GHC 90 • GHC 120 • GHC 150 • GHC 180</p>
        </div>
      </div>

      <div className={styles.footer}>
        <p>www.equityhealthinsurance.com</p>
        <button onClick={handleSharePDF} style={{ marginTop: "20px" }}>
          <FontAwesomeIcon icon={ faShareAlt }/>
        </button>
      </div>

      
      
    </div>
  );
}
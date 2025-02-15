import styles from "./EbusuaHealthPackage.module.css"
import { useNavigate } from "react-router-dom"

const EbusuaHealthPackage = () => {
  const router = useNavigate()

  const handleBack = () => {
    router('/agent/main')
  }
  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>
          &larr; Back to Main
        </button>
      <h1 className={styles.title}>FAMILY AND INDIVIDUAL HEALTH INSURANCE PACKAGE (EBUSUA HEALTH PACKAGE)</h1>

      <section className={styles.guidelines}>
        <h2>EBUSUA HEALTH PACKAGE GUIDELINES</h2>
        <ul>
          <li>
            There are 4 plans with 4 levels for each plan. [Shea (level 1 to 4), Oak (level 1 to 4), Mahogany (level 1
            to 4), Rosewood (level 1 to 4)]
          </li>
          <li>Level 1: base cover without dental, optical, and maternity</li>
          <li>Level 2: base cover with dental cover</li>
          <li>Level 3: base cover with dental and optical cover</li>
          <li>Level 4: base cover with dental, optical, and maternity cover</li>
          <li>Family Plans exist for families with one to six members (M; M+1; M+2; M+3; M+4; M+5).</li>
          <li>Age limit: 0 to 59 years.</li>
          <li>Risk loadings will be applied to family members with chronic conditions and members above 60 years.</li>
          <li>The number of Adults in a family shall not exceed two.</li>
          <li>A family may only subscribe to one plan and one level; multiple plans and levels are not allowed.</li>
          <li>Premiums are payable in Advance.</li>
        </ul>
      </section>

      <section className={styles.guidelinesCont}>
        <h2>EBUSUA HEALTH PACKAGE GUIDELINES CONT'D</h2>
        <ul>
          <li>Frequency of payment: Quarterly, Semiannually, or Annually.</li>
          <li>
            Payment modes: Cheque, Bank Transfer, Source Deductions including CAGD, Bank Standing Order, Mobile Money.
          </li>
          <li>For payments through CAGD, the policy will be activated after 3 successful deductions</li>
          <li>
            Limits and sub-limits for all benefits will be applicable as indicated in the benefits table according to
            plan and level.
          </li>
          <li>Benefits shall be prorated according to premiums paid.</li>
          <li>A one-month waiting period will apply to annual payment frequencies</li>
          <li>A nine-month waiting period is applicable for maternity cover</li>
          <li>A six-month waiting period is applicable for non-emergency surgeries</li>
        </ul>
      </section>

      {/* Note: The benefit tables for each plan (Shea, Oak, Mahogany, Rosewood) are quite extensive.
         For brevity, I'll include just the Shea plan here. You would create similar sections for the other plans. */}

      <section className={styles.sheaPlan}>
        <h2>EBUSUA HEALTH PACKAGE (SHEA PLAN) PREMIUMS & BENEFITS</h2>
        <table className={styles.benefitsTable}>
          <thead>
            <tr>
              <th></th>
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
              <td>OPD BENEFITS</td>
              <td>4,000</td>
              <td>7,200</td>
              <td>10,800</td>
              <td>14,400</td>
              <td>18,000</td>
              <td>21,600</td>
            </tr>
            <tr>
              <td>IPD BENEFITS</td>
              <td>16,000</td>
              <td>28,800</td>
              <td>43,200</td>
              <td>57,600</td>
              <td>72,000</td>
              <td>86,400</td>
            </tr>
            <tr>
              <td>SUM ASSURED</td>
              <td>20,000</td>
              <td>36,000</td>
              <td>54,000</td>
              <td>72,000</td>
              <td>90,000</td>
              <td>108,000</td>
            </tr>
            {/* Add more rows for yearly premiums per level */}
          </tbody>
        </table>
        <a href="/form" className="btn-a">Fill Fields</a>
      </section>

      {/* You would add similar sections for Oak, Mahogany, and Rosewood plans here */}
    </div>
  )
}

export default EbusuaHealthPackage


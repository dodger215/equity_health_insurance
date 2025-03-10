import styles from "./AyaresabeaBanboSika.module.css"
import { useNavigate } from "react-router-dom"
import { Close, Forms } from "../ui/button"


export default function ABSBrochure() {
  return (
    <div className={styles.container}>
      <Close title={'AYARESABEA BANBO SIKA (ABS)'} />
      <Forms />
      <h1></h1>
      <div className={styles.website}>
        <a href="http://www.equityhealthinsurance.com">www.equityhealthinsurance.com</a>
      </div>

      {/* Level 1 */}
      <div className={styles.level}>
        <h2>AYARISABEA BANBO SIKA (ABS) – Level 1</h2>
        <h3>ABS TERMS AND CONDITIONS – Level 1</h3>
        <ul className={styles.termsList}>
          <li>
            Hospitalization for at least <span className={styles.highlight}>2 nights</span>
          </li>
          <li>
            Maximum hospitalization of <span className={styles.highlight}>30 nights</span> within a policy year
          </li>
          <li>
            Hospitalization benefits – <span className={styles.highlight}>100% for adults</span> and{" "}
            <span className={styles.highlight}>50% for children</span>
          </li>
          <li>
            There is a <span className={styles.highlight}>three (3) month waiting period</span> before the plan can be
            activated
          </li>
          <li>
            Minimum of <span className={styles.highlight}>GHS 100</span> per hospitalization
          </li>
          <li>
            Total amount payable for hospitalization shall <strong>NOT</strong> exceed{" "}
            <span className={styles.highlight}>GH₵200</span> on each episode
          </li>
          <li>
            The plan shall pay out <strong>either</strong> cashback <strong>OR</strong> cost of prescribed medication{" "}
            <strong>OR</strong> free screening
          </li>
          <li>Health screening shall be conducted at the end of the policy calendar year</li>
          <li>Prescribed medication shall be delivered free if bought from a Medcare Plus facility</li>
          <li>
            Medication benefit is pro-rated for monthly and quarterly premium contributors, and shall{" "}
            <strong>NOT</strong> exceed <span className={styles.highlight}>GHS 25.0</span> per quarter
          </li>
          <li>The medication benefits accrues over time within the policy year</li>
        </ul>
      </div>

      {/* Level 2 */}
      <div className={styles.level}>
        <h2>AYARISABEA BANBO SIKA (ABS) – Level 2</h2>
        <h3>ABS TERMS AND CONDITIONS – Level 2</h3>
        <ul className={styles.termsList}>
          <li>
            Hospitalization for at least <span className={styles.highlight}>2 nights</span>
          </li>
          <li>
            Maximum hospitalization of <span className={styles.highlight}>30 nights</span> within a policy year
          </li>
          <li>
            Hospitalization benefits – <span className={styles.highlight}>100% for adults</span> and{" "}
            <span className={styles.highlight}>50% for children</span>
          </li>
          <li>
            There is a <span className={styles.highlight}>three (3) month waiting period</span> before the plan can be
            activated
          </li>
          <li>
            Minimum of <span className={styles.highlight}>GHS 150</span> per hospitalization
          </li>
          <li>
            Total amount payable for hospitalization shall <strong>NOT</strong> exceed{" "}
            <span className={styles.highlight}>GH₵300</span> on each episode
          </li>
          <li>
            The plan shall pay out <strong>either</strong> cashback <strong>OR</strong> cost of prescribed medication{" "}
            <strong>OR</strong> free screening
          </li>
          <li>Health screening shall be done at the end of the policy year</li>
          <li>Prescribed medication shall be delivered free if bought from a Medcare Plus facility</li>
          <li>
            Medication benefit is pro-rated for monthly and quarterly premium contributors, and shall{" "}
            <strong>NOT</strong> exceed <span className={styles.highlight}>GHS 37.50</span> per quarter
          </li>
          <li>The medication benefits accrues over time within the policy year</li>
        </ul>
      </div>

      {/* Level 3 */}
      <div className={styles.level}>
        <h2>AYARISABEA BANBO SIKA (ABS) – Level 3</h2>
        <h3>ABS TERMS AND CONDITIONS – Level 3</h3>
        <ul className={styles.termsList}>
          <li>
            Hospitalization for at least <span className={styles.highlight}>2 nights</span>
          </li>
          <li>
            Maximum hospitalization of <span className={styles.highlight}>30 nights</span> within a policy year
          </li>
          <li>
            Hospitalization benefits – <span className={styles.highlight}>100% for adults</span> and{" "}
            <span className={styles.highlight}>50% for children</span>
          </li>
          <li>
            There is a <span className={styles.highlight}>three (3) month waiting period</span> before the plan can be
            activated
          </li>
          <li>
            Minimum of <span className={styles.highlight}>GHS 200</span> per hospitalization
          </li>
          <li>
            Total amount payable for hospitalization shall <strong>NOT</strong> exceed{" "}
            <span className={styles.highlight}>GH₵400</span> on each episode
          </li>
          <li>
            The plan shall pay out <strong>either</strong> cashback <strong>OR</strong> cost of prescribed medication{" "}
            <strong>OR</strong> free screening
          </li>
          <li>Health screening shall be done at the end of the policy year</li>
          <li>Prescribed medication shall be delivered free if bought from a Medcare Plus facility</li>
          <li>
            Medication benefit is pro-rated for monthly and quarterly premium contributors, and shall{" "}
            <strong>NOT</strong> exceed <span className={styles.highlight}>GHS 50.0</span> per quarter
          </li>
          <li>The medication benefits accrues over time within the policy year</li>
        </ul>
      </div>

      <h1>AYARESABEA BANBO SIKA (ABS)</h1>
      <div className={styles.website}>www.equityhealthinsurance.com</div>

      <table className={styles.comparisonTable}>
        <thead>
          <tr>
            <th>Features</th>
            <th>Level 1</th>
            <th>Level 2</th>
            <th>Level 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hospitalization Minimum Nights</td>
            <td>
              <span className={styles.highlight}>2 nights</span>
            </td>
            <td>
              <span className={styles.highlight}>2 nights</span>
            </td>
            <td>
              <span className={styles.highlight}>2 nights</span>
            </td>
          </tr>
          <tr>
            <td>Maximum Hospitalization (nights/year)</td>
            <td>
              <span className={styles.highlight}>30</span>
            </td>
            <td>
              <span className={styles.highlight}>30</span>
            </td>
            <td>
              <span className={styles.highlight}>30</span>
            </td>
          </tr>
          <tr>
            <td>Hospitalization Coverage</td>
            <td>
              100% adults
              <br />
              50% children
            </td>
            <td>
              100% adults
              <br />
              50% children
            </td>
            <td>
              100% adults
              <br />
              50% children
            </td>
          </tr>
          <tr>
            <td>Waiting Period</td>
            <td colSpan="3">
              <span className={styles.highlight}>3 months</span> activation period
            </td>
          </tr>
          <tr>
            <td>Minimum per Hospitalization</td>
            <td>
              <span className={styles.highlight}>GHS 100</span>
            </td>
            <td>
              <span className={styles.highlight}>GHS 150</span>
            </td>
            <td>
              <span className={styles.highlight}>GHS 200</span>
            </td>
          </tr>
          <tr>
            <td>Maximum per Episode</td>
            <td>
              <span className={styles.highlight}>GH₵200</span>
            </td>
            <td>
              <span className={styles.highlight}>GH₵300</span>
            </td>
            <td>
              <span className={styles.highlight}>GH₵400</span>
            </td>
          </tr>
          <tr>
            <td>Medication Benefit (Quarterly)</td>
            <td>
              <span className={styles.highlight}>GHS 25.0</span>
            </td>
            <td>
              <span className={styles.highlight}>GHS 37.50</span>
            </td>
            <td>
              <span className={styles.highlight}>GHS 50.0</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className={styles.noteSection}>
        <h2>General Terms & Conditions</h2>
        <ul>
          <li>Plan payouts include either cashback, prescribed medication cost, or free screening</li>
          <li>Health screening conducted at policy year end</li>
          <li>Free medication delivery from Medcare Plus facilities</li>
          <li>Medication benefits accrue within policy year</li>
        </ul>
      </div>

      <div className={styles.website}>
        <a href="http://www.equityhealthinsurance.com">www.equityhealthinsurance.com</a>
      </div>
    </div>
  )
}


import styles from "./Telemedicine.module.css"
import { useNavigate } from "react-router-dom"

const Telemedicine = () => {
  const router = useNavigate()
  const handleBack = () => {
    router('/agent/main')
  }
  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>
          &larr; Back to Main
        </button>
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
      <a href="/form" className="btn-a">Fill Fields</a>
    </div>
  )
}

export default Telemedicine


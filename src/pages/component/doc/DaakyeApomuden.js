import styles from "./DaakyeApomuden.module.css"
import { useNavigate } from "react-router-dom"

const DaakyeApomuden = () => {
  const router = useNavigate()

  const handleBack = () => {
    router('/agent/main')
  }
  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>
          &larr; Back to Main
        </button>
      <h1 className={styles.title}>DAAKYE APOMUDEN</h1>

      <section className={styles.premium}>
        <h2>PREMIUM</h2>
        <p>Selected based on the annual sum assured or Monthly contribution</p>
      </section>

      <section className={styles.benefits}>
        <h2>BENEFITS</h2>
        <h3>Contribution period benefits</h3>
        <ul>
          <li>Daily hospitalization benefit</li>
          <li>Medical check-up</li>
          <li>Critical illness</li>
          <li>Dietary supplement support – every 2 years</li>
          <li>Death benefit</li>
        </ul>

        <h3>Benefits for life</h3>
        <ul>
          <li>Telemedicine</li>
          <li>Health insurance cover for life</li>
        </ul>
      </section>

      <section className={styles.terms}>
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
        <a href="/form" className="btn-a">Fill Fields</a>
      </section>
    </div>
  )
}

export default DaakyeApomuden


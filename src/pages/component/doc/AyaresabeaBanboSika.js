import styles from "./AyaresabeaBanboSika.module.css"
import { useNavigate } from "react-router-dom"

const AyaresabeaBanboSika = () => {
  const levels = [
    {
      level: 1,
      premium: { monthly: 23, annually: 276 },
      hospitalizationMin: 100,
      hospitalizationMax: 200,
      medicationQuarterly: 25,
    },
    {
      level: 2,
      premium: { monthly: 33, annually: 396 },
      hospitalizationMin: 150,
      hospitalizationMax: 300,
      medicationQuarterly: 37.5,
    },
    {
      level: 3,
      premium: { monthly: 41, annually: 492 },
      hospitalizationMin: 200,
      hospitalizationMax: 400,
      medicationQuarterly: 50,
    },
  ]

  const router = useNavigate()

  const renderLevel = (level) => (
    <div key={level.level} className={styles.level}>
      <h2>AYARESABEA BANBO SIKA (ABS) – Level {level.level}</h2>
      <section className={styles.premium}>
        <h3>PREMIUM</h3>
        <table>
          <thead>
            <tr>
              <th>Monthly</th>
              <th>Annually</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GHS {level.premium.monthly}</td>
              <td>GHS {level.premium.annually}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className={styles.benefits}>
        <h3>BENEFITS</h3>
        <ul>
          <li>Telemedicine consultation</li>
          <li>Medication</li>
          <li>Free medication delivery service</li>
          <li>Health screening</li>
        </ul>
      </section>
      <section className={styles.terms}>
        <h3>TERMS AND CONDITIONS</h3>
        <ol>
          <li>Hospitalization for at least 2 nights</li>
          <li>Maximum hospitalization of 30 nights within a policy year</li>
          <li>Hospitalization benefits – 100% for adults and 50% for children</li>
          <li>There is a three (3) month waiting period before the plan can be activated</li>
          <li>Minimum of GHS {level.hospitalizationMin} per hospitalization</li>
          <li>
            Total amount payable for hospitalization shall NOT exceed GHS {level.hospitalizationMax} on each episode
          </li>
          <li>The plan shall pay out either cashback OR cost of prescribed medication OR free screening.</li>
          <li>Health screening shall be conducted at the end of the policy calendar year</li>
          <li>Prescribed medication shall be delivered free if bought from a Medcare Plus facility</li>
          <li>
            Medication benefit is pro-rated for monthly, and quarterly premium contributors, and shall NOT exceed GHS{" "}
            {level.medicationQuarterly} per quarter
          </li>
          <li>The medication benefits accrues over time within the policy year.</li>
        </ol>
      </section>
      <a href="/form" className="btn-a">Fill Fields</a>
    </div>
  )
  const handleBack = () => {
    router('/agent/main')
  }

  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>
          &larr; Back to Main
        </button>
      <h1 className={styles.title}>AYARESABEA BANBO SIKA (ABS)</h1>
      {levels.map(renderLevel)}
    </div>
  )
}

export default AyaresabeaBanboSika


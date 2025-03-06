"use client"

import { useNavigate } from "react-router-dom"


const CalculatorPremium = () => {

    const navigate = useNavigate() 

    return (
        <div className="calculator-container">
            <div className="calc-list container bg-a" onClick={ () => navigate('/ABSCalc')}>
                <i className="fa-solid fa-bed-pulse"></i>
                <p className="lab">ABS Calculator</p>
            </div>

            <div className="calc-list container bg-b" onClick={ () => navigate('/MicroCalculator')}>
                <i className="fa-solid fa-house-medical"></i>
                <p className="lab">Micro Calculator</p>
            </div>

            <div className="calc-list container bg-b" onClick={ () => navigate('/DaakyeCalc')}>
                <i className="fas fa-user-doctor"></i>
                <p className="lab">Daakye Calculator</p>
            </div>

            <div className="calc-list container bg-a" onClick={ () => navigate('/EbusuaCalculator')}>
                <i className="fa-solid fa-people-roof"></i>
                <p className="lab">Ebusua Calculator</p>
            </div>

            <div className="calc-list bg-a" onClick={ () => navigate('/TeleCalc')}>
                <i className="fas fa-hospital-user"></i>
                <p className="lab">Telemedicine Calculator</p>
            </div>
        </div>
    )

  
}

export default CalculatorPremium
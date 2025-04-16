"use client"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AOS from 'aos';
import 'aos/dist/aos.css';


const CalculatorPremium = () => {

    const navigate = useNavigate() 

    useEffect(() => {
        AOS.init({
          duration: 1000, 
          easing: 'ease-in-out', 
          once: false 
        });
      })

    return (
        <div className="calculator-container">
            <div className="calc-list container bg-a" onClick={ () => navigate('/ABSCalc')} data-aos="zoom-in" data-aos-delay="100">
                <i className="fa-solid fa-bed-pulse"></i>
                <p className="lab">ABS Calculator</p>
            </div>

            <div className="calc-list container bg-b" onClick={ () => navigate('/MicroCalculator')} data-aos="zoom-in" data-aos-delay="150">
                <i className="fa-solid fa-house-medical"></i>
                <p className="lab">Micro Calculator</p>
            </div>

            <div className="calc-list container bg-b" onClick={ () => navigate('/DaakyeCalc')} data-aos="zoom-in" data-aos-delay="200">
                <i className="fas fa-user-doctor"></i>
                <p className="lab">Daakye Calculator</p>
            </div>

            <div className="calc-list container bg-a" onClick={ () => navigate('/EbusuaCalculator')} data-aos="zoom-in" data-aos-delay="250">
                <i className="fa-solid fa-people-roof"></i>
                <p className="lab">Ebusua Calculator</p>
            </div>

            <div className="calc-list bg-a" onClick={ () => navigate('/TeleCalc')} data-aos="zoom-in" data-aos-delay="300">
                <i className="fas fa-hospital-user"></i>
                <p className="lab">Telemedicine Calculator</p>
            </div>
        </div>
    )

  
}

export default CalculatorPremium
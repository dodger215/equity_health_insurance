import { useEffect } from 'react';
import style from './product.module.css';
import { useNavigate } from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css';

function Product() {
    const navigate = useNavigate()

    useEffect(() => {
        AOS.init({
          duration: 1000, // animation duration in milliseconds
          easing: 'ease-in-out', // default easing for AOS animations
          once: false // whether animation should happen only once
        });
      })
    const handleForm = () => {
        localStorage.removeItem("prospect_id")
        navigate('/form')
    }
    return (
        <div>
            <div className={style.intro}>
                <h1>Product</h1>
                {/* <div className={style.btn} onClick={() => handleForm()}>+</div> */}
            </div>

            <div className={style.container}>
                <a href='/edusua' className={style.one} data-aos="zoom-in" data-aos-delay="100">
                    <span>
                        <h2>EBUSUA</h2>
                    </span>
                    
                </a>
                <a href='/abs' className={style.two} data-aos="zoom-in" data-aos-delay="150">
                    <span>
                        <h2>ABS</h2>

                    </span>
                    
                </a>
                <a href='/micro' className={style.three} data-aos="zoom-in" data-aos-delay="200">
                    <span>
                        <h2>Micro</h2>
                    </span>
                    
                </a>
                <a href='/tele' className={style.four} data-aos="zoom-in" data-aos-delay="250">
                    <span>
                        <h2>TELEMEDICINE</h2>
                    </span>
                    
                </a>
                <a href='/daakye' className={style.five} data-aos="zoom-in" data-aos-delay="300">
                    <span>
                        <h2>Daakye</h2>
    
                    </span>
                    
                </a>

            </div>
        </div>
        
    );
}

export default Product;
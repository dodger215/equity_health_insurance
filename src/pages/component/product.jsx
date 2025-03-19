import style from './product.module.css';
import { useNavigate } from 'react-router-dom';

function Product() {
    const navigate = useNavigate()


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
                <a href='/edusua' className={style.one}>
                    <span>
                        <h2>EBUSUA</h2>
                    </span>
                    
                </a>
                <a href='/abs' className={style.two}>
                    <span>
                        <h2>ABS</h2>

                    </span>
                    
                </a>
                <a href='/micro' className={style.three}>
                    <span>
                        <h2>Micro</h2>
                    </span>
                    
                </a>
                <a href='/tele' className={style.four}>
                    <span>
                        <h2>TELEMEDICINE</h2>
                    </span>
                    
                </a>
                <a href='/daakye' className={style.five}>
                    <span>
                        <h2>Daakye</h2>
    
                    </span>
                    
                </a>

            </div>
        </div>
        
    );
}

export default Product;
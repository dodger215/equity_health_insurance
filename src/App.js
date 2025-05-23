import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/component/home';
import Login from './pages/agent_login';
import Main from './pages/agent_main';
import ABS from './pages/component/doc/AyaresabeaBanboSika';
import DaakyeApomuden from './pages/component/doc/DaakyeApomuden';
import Ebusua from './pages/component/doc/EbusuaHealthPackage';
import Micro from './pages/component/doc/MicroProductOptions';
import Tele from './pages/component/doc/Telemedicine';
import SubmitClient from './pages/component/SubmitClientView';
import ABSCalc from './pages/component/calculator/abs/calculator';
import DaakyeCalc from './pages/component/calculator/daakye/calculator';
import EbusuaCalculator from './pages/component/calculator/ebusua/page';
import MicroCalculator from './pages/component/calculator/micro/premium-calculator';
import PaymentGateway from './pages/component/payments/paycheck';
import ProspectForm from './pages/component/start/propects';
import TeleCalc from './pages/component/calculator/tele/premium-calculator';
import AppointmentList from './pages/component/start/appointment';
import ClientList from './pages/component/verification/ClientListComponent';
import InsuranceForm from './pages/component/forms/insurance-form';
import DraftClients from './pages/component/tabContents/client';
import ImageUploadForm from './pages/component/forms/form-image';
import Notifications from './pages/component/start/notification';
import CodeValidation from './pages/component/verification/CodeValidationComponent';
import ClientFormComponent from './pages/component/verification/ClientFormComponent';
import { useState, useEffect, createContext } from 'react';
import EditProspect from './pages/component/start/edit-prospect';
import AgentDetails from './pages/component/profile';
import PasswordChangeForm from './pages/component/settings/change_password';
import InsuranceFormShortcut from './pages/component/forms/shortcut';
import AOS from 'aos';
import 'aos/dist/aos.css';
import BankPayPoint from './pages/component/payments/bank';
import CheckOut from './pages/component/payments/checkOut';
import useBell from './pages/component/ui/bell';
import { NestedList } from './pages/component/ui/loading';
import MobilePayment from './pages/component/payments/momo';
// Create and export PopupContext
export const PopupContext = createContext();

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [popupState, setPopupState] = useState({
    show: false,
    message: '',
    page: '', // Add a page identifier
  });
  const ring = useBell;

  // Auto-hide popup after 3 seconds
  useEffect(() => {
    if (popupState.show) {
      const timer = setTimeout(() => {
        setPopupState((prev) => ({ ...prev, show: false }));
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [popupState.show]);
  

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      easing: 'ease-in-out', 
      once: false 
    });
  })
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth < 1026); 
  };

  useEffect(() => {
    checkScreenSize(); // Check on initial render
    window.addEventListener('resize', checkScreenSize); // Check on window resize
    return () => window.removeEventListener('resize', checkScreenSize); // Cleanup
  }, []);


  

  // useEffect(() => {
  //   const handleLoad = () => setLoading(false);
  //   window.addEventListener('load', handleLoad);

  //   return () => window.removeEventListener('load', handleLoad);
  // }, []);

  // if (loading) {
  //   return (
  //     <NestedList/>
  //   );
  // }

  return (
    <Router>
      <PopupContext.Provider value={{ setPopupState }}>
        {/* Success Popup */}
        {popupState.show && (
          <div className={`success-popup ${popupState.page}`} data-aos="zoom-out" data-aos-delay="100">
            {/* <i className="fa-solid fa-bell"></i>  */}
            {popupState.message || 'Action Successful! 🎉'}
          </div>
        )}

        {isMobile ? (
          <div className='fix' style={{
            width: "100%"
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ABSCalc" element={<ABSCalc />} />
              <Route path="/MicroCalculator" element={<MicroCalculator />} />
              <Route path="/DaakyeCalc" element={<DaakyeCalc />} />
              <Route path="/Payments" element={<PaymentGateway />} />
              <Route path="/EbusuaCalculator" element={<EbusuaCalculator />} />
              <Route path="/TeleCalc" element={<TeleCalc />} />
              <Route path="/login" element={<Login />} />
              <Route path="/agent/main" element={<Main />} />
              <Route path="/form" element={<InsuranceForm />} />
              <Route path="/abs" element={<ABS />} />
              <Route path="/daakye" element={<DaakyeApomuden />} />
              <Route path="/edusua" element={<Ebusua />} />
              <Route path="/micro" element={<Micro />} />
              <Route path="/tele" element={<Tele />} />
              <Route path="/prospect" element={<ProspectForm />} />
              <Route path="/client/submit" element={<SubmitClient />} />
              <Route path="/clients" element={<DraftClients />} />
              <Route path="/Appointment" element={<AppointmentList />} />
              <Route path="/ListClient" element={<ClientList />} />
              <Route path="/notify" element={<Notifications />} />
              <Route path="/validate-code/:clientId" element={<CodeValidation />} />
              <Route path="/client-form/:clientId" element={<ClientFormComponent />} />
              <Route path="/client/image/:clientId" element={<ImageUploadForm />} />
              <Route path="/edit/prospect/:prospectId" element={<EditProspect />} />
              <Route path="/agent/details" element={<AgentDetails />} />
              <Route path="/agent/change/password" element={<PasswordChangeForm />} />
              <Route path="/insurance/form/shortcut/:cli_id" element={<InsuranceFormShortcut />} />
              <Route path="/bank/check/" element={<BankPayPoint/>}/>
              <Route path="/momo/checkout/" element={<CheckOut/>}/>
              <Route path="/momo/payment/:price/:clientId/" element={<MobilePayment/>}/>
            </Routes>

          </div>
        ) : (
          <div>
            <h1></h1>
          </div>
        )}
      </PopupContext.Provider>
    </Router>
  );
}

export default App;
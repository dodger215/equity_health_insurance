import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/agent_login';
import Main from './pages/agent_main';
import ABS from './pages/component/doc/AyaresabeaBanboSika'
import DaakyeApomuden from './pages/component/doc/DaakyeApomuden';
import Ebusua from './pages/component/doc/EbusuaHealthPackage';
import Micro from './pages/component/doc/MicroProductOptions';
import Tele from './pages/component/doc/Telemedicine';
import SubmitClient from './pages/component/SubmitClientView';
import ABSCalc from './pages/component/calculator/abs/calculator'
import DaakyeCalc from './pages/component/calculator/daakye/calculator'
import EbusuaCalculator from './pages/component/calculator/ebusua/page'
import MicroCalculator from './pages/component/calculator/micro/premium-calculator';
import PaymentGateway from './pages/component/payments/payment1';
import ProspectForm from './pages/component/start/propects';

import TeleCalc from './pages/component/calculator/tele/premium-calculator'
import AppointmentList from './pages/component/start/appointment';


import InsuranceForm from './pages/component/forms/insurance-form';
import DraftClients from './pages/component/tabContents/client'

import Notifications from './pages/component/start/notification';




function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ABSCalc" element={<ABSCalc />}/>
          <Route path='/MicroCalculator' element={ <MicroCalculator /> }/>
          <Route path="/DaakyeCalc" element={<DaakyeCalc />}/>
          <Route path="/Payments" element={<PaymentGateway />}/>
          <Route path='/EbusuaCalculator' element={<EbusuaCalculator />} />
          <Route path='/TeleCalc' element={ <TeleCalc />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/agent/main" element={<Main />} />
          <Route path='/form' element={<InsuranceForm/>} />
          <Route path='/abs' element={<ABS/>} />
          <Route path='/daakye' element={<DaakyeApomuden/>} />
          <Route path='/edusua' element={<Ebusua/>} />
          <Route path='/micro' element={<Micro/>} />
          <Route path='/tele' element={<Tele/>} />
          <Route path='/prospect' element={<ProspectForm/>} />
          <Route path='/client/submit' element={<SubmitClient />}/>
          <Route path='/clients' element={<DraftClients />}/>
          <Route path='/Appointment' element={ <AppointmentList/> }/>
          <Route path='/notify' element={ <Notifications/> }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

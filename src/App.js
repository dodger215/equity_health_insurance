import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/agent_login';
import Main from './pages/agent_main';
import Form from './pages/component/KYCForm';
import ABS from './pages/component/doc/AyaresabeaBanboSika'
import DaakyeApomuden from './pages/component/doc/DaakyeApomuden';
import Ebusua from './pages/component/doc/EbusuaHealthPackage';
import Micro from './pages/component/doc/MicroProductOptions';
import Tele from './pages/component/doc/Telemedicine';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agent/main" element={<Main />} />
          <Route path='/form' element={<Form/>} />
          <Route path='/abs' element={<ABS/>} />
          <Route path='/daakye' element={<DaakyeApomuden/>} />
          <Route path='/edusua' element={<Ebusua/>} />
          <Route path='/micro' element={<Micro/>} />
          <Route path='/tele' element={<Tele/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

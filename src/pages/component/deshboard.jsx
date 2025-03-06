// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import React, { useState, useEffect } from "react";
import DashboardView from './view';
import Product from './product';
import InsuranceCalculator from './InsuranceCalculator';
import Settings from './logout'



function Dashboard() {

    const [activeTab, setActiveTab] = useState("home")

    useEffect(() => {
      const getNav = localStorage.getItem("nav") || "home"
      setActiveTab(getNav)
    }, []) 
    


    return (
        <div className='main'>
            <div className='content'>
                {activeTab === 'home' && <DashboardView/>}
                {activeTab === 'product' && <Product/>}
                {activeTab === 'calculator' && <InsuranceCalculator />}
                {activeTab === 'settings' && <Settings />}
            </div>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}

export default Dashboard;
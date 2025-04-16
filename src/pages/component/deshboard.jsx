import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import DashboardView from "./view";
import Product from "./product";
import InsuranceCalculator from "./InsuranceCalculator";
import Settings from "./logout";

function Dashboard() {
    const getNav = localStorage.getItem("nav");
    const activeTabDefault = getNav === null || getNav === undefined || getNav.trim() === "" ? "home" : getNav.trim();

    console.log("Final activeTabDefault:", activeTabDefault);

    
    const [activeTab, setActiveTab] = useState(activeTabDefault);

    useEffect(() => {
        localStorage.setItem("nav", activeTab);
    }, [activeTab]);

    return (
        <div className="main">
            <div className="content">
                {activeTab === "home" && <DashboardView />}
                {activeTab === "product" && <Product />}
                {activeTab === "calculator" && <InsuranceCalculator />}
                {activeTab === "settings" && <Settings />}
            </div>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}

export default Dashboard;

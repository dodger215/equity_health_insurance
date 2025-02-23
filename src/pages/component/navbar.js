import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBoxOpen, faCalculator, faCog } from '@fortawesome/free-solid-svg-icons';

function Navbar({ activeTab, setActiveTab }) {
    const navItems = [
        { id: 'home', icon: faHome, text: 'Home' },
        { id: 'product', icon: faBoxOpen, text: 'Product' },
        { id: 'calculator', icon: faCalculator, text: 'Calculator' },
        { id: 'settings', icon: faCog, text: 'Settings' },
    ];

    return (
        <nav className="flex justify-around bg-gray-800 p-4">
            {navItems.map((item) => (
                <div 
                    key={item.id}
                    className={`${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                >
                    <span className="left"></span>
                    <span className="right"></span>
                    <FontAwesomeIcon icon={item.icon} className="icon"/>
                </div>
            ))}
        </nav>
    );
}

export default Navbar;
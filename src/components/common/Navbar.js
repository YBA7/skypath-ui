import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/api/authService';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                SkyPath Portal
            </div>
            <div className="navbar-menu">
                <Link to="/routes" className="navbar-item">Rotalar</Link>
                <Link to="/locations" className="navbar-item">Lokasyonlar</Link>
                <Link to="/transportation" className="navbar-item">Ulaşım</Link>
            </div>
            <div className="navbar-end">
                <button onClick={handleLogout} className="logout-button">
                    Çıkış Yap
                </button>
            </div>
        </nav>
    );
};

export default Navbar; 
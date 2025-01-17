import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RoutesPage from './pages/routes/RoutesPage';
import LocationsPage from './pages/locations/LocationsPage';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TransportationPage from './pages/transportation/TransportationPage';

function App() {
    const AppContent = () => {
        const location = useLocation();
        const isLoginPage = location.pathname === '/login';
        
        return (
            <div className="app">
                {!isLoginPage && <Navbar />}
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route 
                        path="/routes" 
                        element={
                            <ProtectedRoute>
                                <RoutesPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="/locations" element={
                        <ProtectedRoute>
                            <LocationsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/transportation" element={
                        <ProtectedRoute>
                            <TransportationPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        );
    };
    
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;

import React, { useState } from 'react';
import routeService from '../../services/api/routeService';
import authService from '../../services/api/authService';
import './RoutesPage.css';

const RoutesPage = () => {
    const [fromLocationId, setFromLocationId] = useState('');
    const [toLocationId, setToLocationId] = useState('');
    const [routes, setRoutes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Token kontrolü
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
                return;
            }

            console.log('Using token:', token);
            
            const routeData = await routeService.getRoutes(
                parseInt(fromLocationId),
                parseInt(toLocationId)
            );
            console.log('Route data received:', routeData);
            setRoutes(routeData);
        } catch (err) {
            console.error('Search error:', err);
            setError(err.message || 'Rotalar yüklenirken bir hata oluştu.');
            setRoutes([]);
        } finally {
            setLoading(false);
        }
    };

    const getTransportationTypeText = (type) => {
        const types = {
            'BUS': 'Otobüs',
            'PLANE': 'Uçak',
            'TRAIN': 'Tren'
            // Diğer ulaşım tipleri eklenebilir
        };
        return types[type] || type;
    };

    return (
        <div className="routes-container">
            <div className="routes-search-box">
                <h2>Rota Arama</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <label>Kalkış Noktası ID:</label>
                        <input
                            type="number"
                            value={fromLocationId}
                            onChange={(e) => setFromLocationId(e.target.value)}
                            required
                            min="1"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Varış Noktası ID:</label>
                        <input
                            type="number"
                            value={toLocationId}
                            onChange={(e) => setToLocationId(e.target.value)}
                            required
                            min="1"
                        />
                    </div>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Aranıyor...' : 'Rota Ara'}
                    </button>
                </form>
            </div>

            {routes.length > 0 && (
                <div className="routes-results">
                    <h3>Bulunan Rotalar</h3>
                    <div className="routes-grid">
                        {routes.map((route, routeIndex) => (
                            <div key={routeIndex} className="route-card">
                                <h4>Rota {routeIndex + 1}</h4>
                                <div className="route-details">
                                    {route.steps.map((step, stepIndex) => (
                                        <div key={stepIndex} className="route-step">
                                            <p>Başlangıç: {step.origin}</p>
                                            <p>Varış: {step.destination}</p>
                                            <p>Ulaşım Tipi: {getTransportationTypeText(step.transportationType)}</p>
                                            <hr className="step-divider" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoutesPage; 
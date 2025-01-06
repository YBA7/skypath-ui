import React, { useState, useEffect } from 'react';
import routeService from '../../services/api/routeService';
import locationService from '../../services/api/locationService';
import './RoutesPage.css';

const RoutesPage = () => {
    const [fromLocationId, setFromLocationId] = useState('');
    const [toLocationId, setToLocationId] = useState('');
    const [locations, setLocations] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await locationService.getLocations();
                setLocations(response.locationDtoList || []);
            } catch (err) {
                console.error('Lokasyonlar yüklenirken hata:', err);
                setError('Lokasyonlar yüklenemedi.');
            }
        };

        fetchLocations();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setRoutes([]);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
                return;
            }

            const routeData = await routeService.getRoutes(
                parseInt(fromLocationId),
                parseInt(toLocationId)
            );

            if (!routeData || routeData.length === 0) {
                setError('Seçtiğiniz noktalar için uygun bir rota bulunamadı.');
                return;
            }

            setRoutes(routeData);
        } catch (err) {
            console.error('Search error:', err);
            setError(err.message || 'Rotalar yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const getTransportationTypeText = (type) => {
        const types = {
            'BUS': 'Other',
            'PLANE': 'Flight',
        };
        return types[type] || type;
    };

    return (
        <div className="routes-container">
            <div className="routes-search-box">
                <h2>Rota Arama</h2>
                {error && (
                    <div className="error-message" style={{ 
                        backgroundColor: error.includes('bulunamadı') ? '#fff3cd' : '#ffe6e6',
                        color: error.includes('bulunamadı') ? '#856404' : '#dc3545',
                        border: error.includes('bulunamadı') ? '1px solid #ffeeba' : 'none'
                    }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <label>Kalkış Noktası:</label>
                        <select
                            value={fromLocationId}
                            onChange={(e) => setFromLocationId(e.target.value)}
                            required
                        >
                            <option value="">Seçiniz</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Varış Noktası:</label>
                        <select
                            value={toLocationId}
                            onChange={(e) => setToLocationId(e.target.value)}
                            required
                        >
                            <option value="">Seçiniz</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))}
                        </select>
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
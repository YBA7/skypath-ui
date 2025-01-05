import React, { useState } from 'react';
import locationService from '../../services/api/locationService';
import './LocationsPage.css';

const LocationsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        type: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            await locationService.createLocation(formData);
            setSuccessMessage('Lokasyon başarıyla oluşturuldu.');
            setFormData({ name: '', type: '' });
        } catch (err) {
            setError(err.message || 'Lokasyon oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="locations-container">
            <h2>Lokasyon İşlemleri</h2>
            
            <div className="locations-form-container">
                <form onSubmit={handleSubmit} className="locations-form">
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="name">Lokasyon Adı:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            minLength={3}
                            maxLength={255}
                            placeholder="Örn: İstanbul Havalimanı"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Lokasyon Tipi:</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seçiniz</option>
                            <option value="1">Havalimanı</option>
                            <option value="2">Otobüs Terminali</option>
                            <option value="3">Tren İstasyonu</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>

                <div className="api-endpoints">
                    <h3>API Endpointleri</h3>
                    <div className="endpoint">
                        <h4>Lokasyon Oluştur</h4>
                        <code>POST /location/create</code>
                    </div>
                    <div className="endpoint">
                        <h4>Lokasyonları Listele</h4>
                        <code>GET /location/get?page=0&size=10</code>
                    </div>
                    <div className="endpoint">
                        <h4>Lokasyon Detayı</h4>
                        <code>GET /location/getById?id=1</code>
                    </div>
                    <div className="endpoint">
                        <h4>Lokasyon Güncelle</h4>
                        <code>PUT /location/updateLocation?id=1</code>
                    </div>
                    <div className="endpoint">
                        <h4>Lokasyon Sil</h4>
                        <code>DELETE /location/delete?id=1</code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationsPage; 
import React, { useState } from 'react';
import transportationService from '../../services/api/transportationService';
import './TransportationPage.css';

const TransportationPage = () => {
    const [formData, setFormData] = useState({
        originId: '',
        destinationId: '',
        transportationType: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const transportationTypes = {
        1: 'Uçak',
        2: 'Otobüs',
        3: 'Tren'
    };

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
            const requestData = {
                ...formData,
                originId: parseInt(formData.originId),
                destinationId: parseInt(formData.destinationId),
                transportationType: parseInt(formData.transportationType)
            };

            await transportationService.createTransportation(requestData);
            setSuccessMessage('Ulaşım bilgisi başarıyla oluşturuldu.');
            setFormData({
                originId: '',
                destinationId: '',
                transportationType: ''
            });
        } catch (err) {
            setError(err.message || 'Ulaşım bilgisi oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="transportation-container">
            <h2>Ulaşım İşlemleri</h2>
            
            <div className="transportation-form-container">
                <form onSubmit={handleSubmit} className="transportation-form">
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="originId">Kalkış Lokasyonu ID:</label>
                        <input
                            type="number"
                            id="originId"
                            name="originId"
                            value={formData.originId}
                            onChange={handleInputChange}
                            required
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="destinationId">Varış Lokasyonu ID:</label>
                        <input
                            type="number"
                            id="destinationId"
                            name="destinationId"
                            value={formData.destinationId}
                            onChange={handleInputChange}
                            required
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="transportationType">Ulaşım Tipi:</label>
                        <select
                            id="transportationType"
                            name="transportationType"
                            value={formData.transportationType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seçiniz</option>
                            {Object.entries(transportationTypes).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
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
                        <h4>Ulaşım Oluştur</h4>
                        <code>POST /transportation/create</code>
                        <pre>
                            {JSON.stringify({
                                originId: 1,
                                destinationId: 2,
                                transportationType: 1
                            }, null, 2)}
                        </pre>
                    </div>
                    <div className="endpoint">
                        <h4>Ulaşımları Listele</h4>
                        <code>GET /transportation/get?page=0&size=10</code>
                    </div>
                    <div className="endpoint">
                        <h4>Ulaşım Detayı</h4>
                        <code>GET /transportation/getById?id=1</code>
                    </div>
                    <div className="endpoint">
                        <h4>Ulaşım Güncelle</h4>
                        <code>PUT /transportation/updateTransportation?id=1</code>
                    </div>
                    <div className="endpoint">
                        <h4>Ulaşım Sil</h4>
                        <code>DELETE /transportation/delete?id=1</code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportationPage; 
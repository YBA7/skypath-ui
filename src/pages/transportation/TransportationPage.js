import React, { useState, useEffect } from 'react';
import transportationService from '../../services/api/transportationService';
import locationService from '../../services/api/locationService';
import ConfirmModal from '../../components/common/ConfirmModal';
import './TransportationPage.css';

const TransportationPage = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [formData, setFormData] = useState({
        originId: '',
        destinationId: '',
        transportationType: ''
    });
    const [transportations, setTransportations] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedTransportation, setSelectedTransportation] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        transportationId: null
    });

    const transportationTypes = {
        1: 'Flight',
        2: 'Other'
    };

    const fetchTransportations = async () => {
        try {
            setLoading(true);
            const response = await transportationService.getTransportations(currentPage);
            setTransportations(response.transportationDtoList);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError('Ulaşımlar yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await locationService.getLocations();
            setLocations(response.locationDtoList || []);
        } catch (err) {
            console.error('Lokasyonlar yüklenirken hata:', err);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        fetchTransportations();
    }, [currentPage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreate = async (e) => {
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
            fetchTransportations();
        } catch (err) {
            console.error('Create error:', err);
            if (err.response?.data?.errorMessage) {
                if (err.response.data.errorMessage.includes('already exists')) {
                    setError('Bu kalkış, varış ve ulaşım tipi kombinasyonu zaten mevcut.');
                } else {
                    setError(err.response.data.errorMessage);
                }
            } else {
                setError('Ulaşım bilgisi oluşturulurken bir hata oluştu.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedTransportation) return;

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

            await transportationService.updateTransportation(selectedTransportation.id, requestData);
            setSuccessMessage('Ulaşım bilgisi başarıyla güncellendi.');
            fetchTransportations();
            setActiveTab('list');
        } catch (err) {
            setError(err.message || 'Ulaşım bilgisi güncellenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            await transportationService.deleteTransportation(deleteModal.transportationId);
            setSuccessMessage('Ulaşım bilgisi başarıyla silindi.');
            fetchTransportations();
            setDeleteModal({ isOpen: false, transportationId: null });
        } catch (err) {
            setError(err.message || 'Ulaşım bilgisi silinirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const getLocationName = (id) => {
        const location = locations.find(l => l.id === id);
        return location ? location.name : 'Bilinmiyor';
    };

    return (
        <div className="locations-container">
            <h2>Ulaşım İşlemleri</h2>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    Ulaşımları Listele
                </button>
                <button 
                    className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => setActiveTab('create')}
                >
                    Yeni Ulaşım
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {activeTab === 'list' && (
                <div className="locations-list">
                    <div className="locations-grid">
                        {transportations.map(transportation => (
                            <div key={transportation.id} className="location-card">
                                <h4>Ulaşım #{transportation.id}</h4>
                                <div className="location-details">
                                    <p>Kalkış: {getLocationName(transportation.originId)}</p>
                                    <p>Varış: {getLocationName(transportation.destinationId)}</p>
                                    <p>Tip: {transportationTypes[transportation.transportationType]}</p>
                                    <p>Oluşturulma: {new Date(transportation.createDate).toLocaleDateString()}</p>
                                    <p>Oluşturan: {transportation.createdBy}</p>
                                </div>
                                <div className="location-actions">
                                    <button 
                                        onClick={() => {
                                            setSelectedTransportation(transportation);
                                            setFormData({
                                                originId: transportation.originId.toString(),
                                                destinationId: transportation.destinationId.toString(),
                                                transportationType: transportation.transportationType.toString()
                                            });
                                            setActiveTab('update');
                                        }}
                                        className="edit-button"
                                    >
                                        Düzenle
                                    </button>
                                    <button 
                                        onClick={() => setDeleteModal({ 
                                            isOpen: true, 
                                            transportationId: transportation.id 
                                        })}
                                        className="delete-button"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button 
                            onClick={() => setCurrentPage(p => p - 1)}
                            disabled={currentPage === 0 || loading}
                        >
                            Önceki
                        </button>
                        <span>Sayfa {currentPage + 1} / {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(p => p + 1)}
                            disabled={currentPage === totalPages - 1 || loading}
                        >
                            Sonraki
                        </button>
                    </div>
                </div>
            )}

            {(activeTab === 'create' || activeTab === 'update') && (
                <div className="locations-form">
                    <form onSubmit={activeTab === 'create' ? handleCreate : handleUpdate}>
                        <div className="form-group">
                            <label htmlFor="originId">Kalkış Lokasyonu:</label>
                            <select
                                id="originId"
                                name="originId"
                                value={formData.originId}
                                onChange={handleInputChange}
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
                            <label htmlFor="destinationId">Varış Lokasyonu:</label>
                            <select
                                id="destinationId"
                                name="destinationId"
                                value={formData.destinationId}
                                onChange={handleInputChange}
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
                                {loading ? (activeTab === 'create' ? 'Kaydediliyor...' : 'Güncelleniyor...') : 
                                         (activeTab === 'create' ? 'Kaydet' : 'Güncelle')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                message="Bu ulaşım bilgisini silmek istediğinizden emin misiniz?"
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ isOpen: false, transportationId: null })}
            />
        </div>
    );
};

export default TransportationPage; 
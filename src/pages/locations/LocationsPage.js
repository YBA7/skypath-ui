import React, { useState, useEffect } from 'react';
import locationService from '../../services/api/locationService';
import ConfirmModal from '../../components/common/ConfirmModal';
import './LocationsPage.css';

const LocationsPage = () => {
    const [activeTab, setActiveTab] = useState('list'); // list, create, update, delete
    const [formData, setFormData] = useState({
        name: '',
        type: ''
    });
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        locationId: null
    });

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const response = await locationService.getLocationsPaginated(currentPage);
            setLocations(response.locationDtoList);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError('Lokasyonlar yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
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
            await locationService.createLocation(formData);
            setSuccessMessage('Lokasyon başarıyla oluşturuldu.');
            setFormData({ name: '', type: '' });
            fetchLocations();
        } catch (err) {
            console.error('Create error:', err);
            if (err.response?.data?.error) {
                if (err.response.data.error.includes('already exists')) {
                    setError('Bu isim ve tipte bir lokasyon zaten mevcut.');
                } else {
                    setError(err.response.data.error);
                }
            } else {
                setError('Lokasyon oluşturulurken bir hata oluştu.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedLocation) return;

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            await locationService.updateLocation(selectedLocation.id, formData);
            setSuccessMessage('Lokasyon başarıyla güncellendi.');
            fetchLocations();
            setActiveTab('list');
        } catch (err) {
            console.error('Update error:', err);
            if (err.response?.data?.errorMessage) {
                if (err.response.data.errorMessage.includes('already exists')) {
                    setError('Bu isim ve tipte bir lokasyon zaten mevcut.');
                } else {
                    setError(err.response.data.errorMessage);
                }
            } else {
                setError('Lokasyon güncellenirken bir hata oluştu.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            await locationService.deleteLocation(deleteModal.locationId);
            setSuccessMessage('Lokasyon başarıyla silindi.');
            fetchLocations();
            setDeleteModal({ isOpen: false, locationId: null });
        } catch (err) {
            setError(err.message || 'Lokasyon silinirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const getLocationType = (type) => {
        const types = {
            1: 'FLIGHT',
            2: 'OTHER',
        };
        return types[type] || 'Bilinmiyor';
    };

    return (
        <div className="locations-container">
            <h2>Lokasyon İşlemleri</h2>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    Lokasyonları Listele
                </button>
                <button 
                    className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => setActiveTab('create')}
                >
                    Yeni Lokasyon
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {activeTab === 'list' && (
                <div className="locations-list">
                    <div className="locations-grid">
                        {locations.map(location => (
                            <div key={location.id} className="location-card">
                                <h4>{location.name}</h4>
                                <div className="location-details">
                                    <p>Tip: {getLocationType(location.type)}</p>
                                    <p>ID: {location.id}</p>
                                    <p>Oluşturulma: {new Date(location.createDate).toLocaleDateString()}</p>
                                    <p>Oluşturan: {location.createdBy}</p>
                                </div>
                                <div className="location-actions">
                                    <button 
                                        onClick={() => {
                                            setSelectedLocation(location);
                                            setFormData({
                                                name: location.name,
                                                type: location.type.toString()
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
                                            locationId: location.id 
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

            {activeTab === 'create' && (
                <div className="locations-form">
                    <form onSubmit={handleCreate}>
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
                                <option value="1">FLIGHT</option>
                                <option value="2">OTHER</option>
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
                </div>
            )}

            {activeTab === 'update' && (
                <div className="locations-form">
                    <div className="form-group">
                        <label htmlFor="locationSelect">Güncellenecek Lokasyon:</label>
                        <select
                            id="locationSelect"
                            value={selectedLocation?.id || ''}
                            onChange={(e) => {
                                const location = locations.find(l => l.id === parseInt(e.target.value));
                                if (location) {
                                    setSelectedLocation(location);
                                    setFormData({
                                        name: location.name,
                                        type: location.type.toString()
                                    });
                                }
                            }}
                            required
                        >
                            <option value="">Seçiniz</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>
                                    {location.name} ({getLocationType(location.type)})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedLocation && (
                        <form onSubmit={handleUpdate}>
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
                                    <option value="1">FLIGHT</option>
                                    <option value="2">OTHER</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="submit-button"
                                >
                                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                message="Bu lokasyonu silmek istediğinizden emin misiniz?"
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ isOpen: false, locationId: null })}
            />
        </div>
    );
};

export default LocationsPage; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/api/authService';
import userService from '../../services/api/userService';
import './LoginPage.css';

const LoginPage = () => {
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'ADMIN'
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginSuccess = await authService.login(formData.username, formData.password);
            if (loginSuccess) {
                navigate('/routes');
            } else {
                setError('Giriş başarısız. Token alınamadı.');
            }
        } catch (err) {
            setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await userService.createUser(formData);
            setSuccessMessage('Kayıt başarıyla tamamlandı. Şimdi giriş yapabilirsiniz.');
            setIsLoginForm(true);
            setFormData(prev => ({
                ...prev,
                password: ''
            }));
        } catch (err) {
            console.error('Register error:', err);
            if (err.response?.data?.errorMessage) {
                if (err.response.data.errorType === 'RuntimeException' && 
                    err.response.data.errorMessage.includes('already exists')) {
                    setError('Bu kullanıcı adı zaten kullanılıyor. Lütfen farklı bir kullanıcı adı seçin.');
                } else {
                    setError(err.response.data.errorMessage);
                }
            } else {
                setError('Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isLoginForm ? 'SkyPath Portal Girişi' : 'Kayıt Ol'}</h2>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                
                <form onSubmit={isLoginForm ? handleLogin : handleRegister}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Kullanıcı Adı"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Şifre"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit">
                        {isLoginForm ? 'Giriş Yap' : 'Kayıt Ol'}
                    </button>
                </form>

                <div className="form-switch">
                    <button 
                        onClick={() => {
                            setIsLoginForm(!isLoginForm);
                            setError('');
                            setSuccessMessage('');
                            setFormData({
                                username: '',
                                password: '',
                                role: 'ADMIN'
                            });
                        }}
                        className="switch-button"
                    >
                        {isLoginForm ? 'Kayıt Ol' : 'Giriş Yap'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 
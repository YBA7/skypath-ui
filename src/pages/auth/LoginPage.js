import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/api/authService';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginSuccess = await authService.login(username, password);
            if (loginSuccess) {
                navigate('/routes');
            } else {
                setError('Giriş başarısız. Token alınamadı.');
            }
        } catch (err) {
            setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>SkyPath Portal Girişi</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Giriş Yap</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage; 
import React, { useState } from 'react';
import { setCookie } from './cookieUtils';
import { useNavigate } from 'react-router-dom';

function Register({ onRegister }) {
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'https://storyup-backend.onrender.com/api';
    const [realName, setRealName] = useState('');
    const [nick, setNick] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Usuario');
    const [centroTipo, setCentroTipo] = useState('CEIP');
    const [centroNombre, setCentroNombre] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (!realName || !nick || !email || !password || !userType || !centroTipo || !centroNombre) {
            setError('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/register-or-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ realName, username: nick, email, password, userType, centroTipo, centroNombre })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error de registro');
            if (data.token) setCookie('token', data.token, 7);
            onRegister({ ...data.user, token: data.token });
            navigate('/perfil');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="register-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nombre real"
                value={realName}
                onChange={e => setRealName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Nick"
                value={nick}
                onChange={e => setNick(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <select value={userType} onChange={e => setUserType(e.target.value)} required>
                <option value="Usuario">Usuario</option>
                <option value="Docente">Docente</option>
            </select>
            <select value={centroTipo} onChange={e => setCentroTipo(e.target.value)} required>
                <option value="CEIP">CEIP</option>
                <option value="IES">IES</option>
            </select>
            <input
                type="text"
                placeholder="Nombre del centro escolar"
                value={centroNombre}
                onChange={e => setCentroNombre(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
            </button>
            {error && <div className="error">{error}</div>}
        </form>
    );

}

export default Register;


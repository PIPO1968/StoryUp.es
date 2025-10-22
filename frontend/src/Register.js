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
    const [course, setCourse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (!realName || !nick || !email || !password || !userType || !centroTipo || !centroNombre || !course) {
            setError('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/register-or-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ realName, username: nick, email, password, userType, centroTipo, centroNombre, course })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error de registro');
            if (data.token) setCookie('token', data.token, 7);
            onRegister({ ...data.user, token: data.token });
            // Esperar un momento antes de navegar para asegurar que el usuario se cuenta
            setTimeout(() => navigate('/perfil'), 500);
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
            <select value={course} onChange={e => setCourse(e.target.value)} required>
                <option value="">Selecciona tu curso</option>
                <option value="3º ESO">3º ESO</option>
                <option value="4º ESO">4º ESO</option>
                <option value="5º ESO">5º ESO</option>
                <option value="6º ESO">6º ESO</option>
                <option value="7º ESO">7º ESO</option>
                <option value="8º ESO">8º ESO</option>
                <option value="1º INS">1º INS</option>
                <option value="2º INS">2º INS</option>
            </select>
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


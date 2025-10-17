import React, { useState } from 'react';

const API_URL = '/api';

function Register({ onRegister }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Usuario');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username, userType })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error de registro');
            // Guardar el token solo en memoria (en el estado superior)
            onRegister({ ...data.user, token: data.token });
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
                placeholder="Nombre de usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
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
                <option value="Padre/Docente">Padre/Docente</option>
            </select>
            <button type="submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
            </button>
            {error && <div className="error">{error}</div>}
        </form>
    );

}

export default Register;



import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://www.storyup.es/api';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error de login');
            // Guardar el token solo en memoria (en el estado superior)
            onLogin({ ...data.user, token: data.token });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
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
            <button type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
            </button>
            {error && <div className="error">{error}</div>}
        </form>
    );
}

export default Login;

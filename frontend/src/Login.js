
import React, { useState } from 'react';

function Login({ onLogin }) {
    const [nick, setNick] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const API_URL = process.env.REACT_APP_API_URL;
            const res = await fetch(`${API_URL}/register-or-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nick, password })
            });
            const data = await res.json();
            if (res.ok) {
                onLogin(data.usuario);
            } else {
                setError(data.error || 'Error de login');
            }
        } catch (err) {
            setError('Error de conexión');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input type="text" placeholder="Nick" value={nick} onChange={e => setNick(e.target.value)} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Entrar</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default Login;

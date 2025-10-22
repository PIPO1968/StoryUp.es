import React, { useState } from 'react';
import { setCookie } from './cookieUtils';

const API_URL = import.meta.env.VITE_API_URL || 'https://storyup-backend.onrender.com/api';

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
            if (data.token) setCookie('token', data.token, 7);
            onLogin({ ...data.user, token: data.token });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            {/* ...campos del formulario... */}
        </form>
    );
}

export default Login;

import React, { useState } from 'react';
import { setCookie } from './cookieUtils';
import { useNavigate } from 'react-router-dom';

function Register({ onRegister }) {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'https://storyup-backend.onrender.com/api';
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
            setTimeout(() => navigate('/perfil'), 500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="register-form" onSubmit={handleSubmit}>
            {/* ...campos del formulario... */}
        </form>
    );
}

export default Register;

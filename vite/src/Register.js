import React, { useState } from 'react';
import { setCookie } from './cookieUtils';
import { useNavigate } from 'react-router-dom';

function Register({ onRegister }) {
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'https://storyup-backend.onrender.com/api';
    // ...resto del código original copiado fielmente del frontend
}

export default Register;

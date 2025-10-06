
// Autenticación real contra backend Vercel/Neon
const API_URL = '/api/auth';

export const loginUser = async (credentials: { email: string; password: string }) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error de login');
    return data.user;
};

export const registerUser = async (userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    role?: 'admin' | 'teacher' | 'student';
}) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error de registro');
    return data.user;
};

export const logoutUser = () => {
    // El backend debe borrar la cookie/token
    window.location.href = '/login';
};

// Obtener usuario actual (requiere endpoint backend)
export const getCurrentUser = async () => {
    const res = await fetch(API_URL, { method: 'GET', credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
};
// Mock: obtener estadísticas de usuario
export const getUserStats = () => {
    return {
        teacher: 1,
        user: 1,
        newUsersThisMonth: 0,
        totalUsers: 2
    };
};

// Mock: obtener usuarios almacenados
export const getStoredUsers = () => {
    return [
        {
            id: '4',
            nombre: 'PIPO68',
            email: 'pipocanarias@hotmail.com',
            username: 'PIPO68',
            role: 'user',
            createdAt: '2025-10-01T10:00:00Z',
            name: 'PIPO68',
            isOnline: true
        },
        {
            id: '7',
            nombre: 'StoryUp',
            email: 'piporgz68@gmail.com',
            username: 'StoryUp',
            role: 'teacher',
            createdAt: '2025-09-15T12:00:00Z',
            name: 'StoryUp',
            isOnline: false
        }
    ];
};

// Mock: actualizar usuario
export const updateUser = async (userData: any) => {
    // Aquí iría la lógica real de actualización vía backend
    return { success: true, user: userData };
};

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
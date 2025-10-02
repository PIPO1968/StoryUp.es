// Sistema de autenticación integrado con APIs

const API_BASE = '/api';

// Obtener el usuario actual desde el token almacenado
export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;

        const response = await fetch(`${API_BASE}/auth`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            localStorage.removeItem('auth_token');
            return null;
        }

        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Error obteniendo usuario actual:', error);
        localStorage.removeItem('auth_token');
        return null;
    }
};

// Login de usuario
export const loginUser = async (credentials: { email: string; password: string }) => {
    try {
        const response = await fetch(`${API_BASE}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en el login');
        }

        localStorage.setItem('auth_token', data.token);
        return data.user;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
};

// Registro de usuario
export const registerUser = async (userData: {
    email: string;
    password: string;
    username: string;
    name?: string;
}) => {
    try {
        const response = await fetch(`${API_BASE}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en el registro');
        }

        localStorage.setItem('auth_token', data.token);
        return data.user;
    } catch (error) {
        console.error('Error en registro:', error);
        throw error;
    }
};

// Logout
export const logoutUser = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
};

// Actualizar datos del usuario
export const updateUser = async (updates: Partial<any>) => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('No autorizado');

        const response = await fetch(`${API_BASE}/users/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error actualizando usuario');
        }

        return data.user;
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        throw error;
    }
};

// Obtener token para requests autenticados
export const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};
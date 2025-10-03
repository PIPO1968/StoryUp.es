// Sistema de autenticación simulado (sin APIs externas)

// Obtener el usuario actual desde el token almacenado
export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;

        // Simular usuario basado en token
        const userData = localStorage.getItem('user_data');
        if (userData) {
            return JSON.parse(userData);
        }

        // Usuario por defecto si hay token pero no datos
        const defaultUser = {
            id: '1',
            name: 'Usuario StoryUp',
            username: 'storyup_user',
            email: 'usuario@storyup.es',
            avatar: '/assets/logo-grande.png.png'
        };
        
        localStorage.setItem('user_data', JSON.stringify(defaultUser));
        return defaultUser;
    } catch (error) {
        console.error('Error obteniendo usuario actual:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        return null;
    }
};

// Login de usuario (simulado)
export const loginUser = async (credentials: { email: string; password: string }) => {
    try {
        // Simular autenticación
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de red

        // Validaciones básicas
        if (!credentials.email || !credentials.password) {
            throw new Error('Email y contraseña son requeridos');
        }

        // Crear usuario simulado
        const user = {
            id: '1',
            name: 'Usuario StoryUp',
            username: credentials.email.split('@')[0],
            email: credentials.email,
            avatar: '/assets/logo-grande.png.png'
        };

        // Guardar token y datos de usuario
        const token = 'simulated_token_' + Date.now();
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        return user;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
};

// Registro de usuario (simulado)
export const registerUser = async (userData: {
    email: string;
    password: string;
    username: string;
    name?: string;
}) => {
    try {
        // Simular proceso de registro
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de red

        // Validaciones básicas
        if (!userData.email || !userData.password || !userData.username) {
            throw new Error('Todos los campos son requeridos');
        }

        // Crear usuario simulado
        const user = {
            id: Date.now().toString(),
            name: userData.name || userData.username,
            username: userData.username,
            email: userData.email,
            avatar: '/assets/logo-grande.png.png'
        };

        // Guardar token y datos de usuario
        const token = 'simulated_token_' + Date.now();
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        return user;
    } catch (error) {
        console.error('Error en registro:', error);
        throw error;
    }
};

// Logout
export const logoutUser = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/';
};

// Actualizar datos del usuario (simulado)
export const updateUser = async (updates: Partial<any>) => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('No autorizado');

        // Simular actualización
        await new Promise(resolve => setTimeout(resolve, 500));

        // Obtener datos actuales del usuario
        const currentUserData = localStorage.getItem('user_data');
        if (!currentUserData) throw new Error('Usuario no encontrado');

        const currentUser = JSON.parse(currentUserData);
        const updatedUser = { ...currentUser, ...updates };

        // Guardar datos actualizados
        localStorage.setItem('user_data', JSON.stringify(updatedUser));

        return updatedUser;
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        throw error;
    }
};

// Obtener token para requests autenticados
export const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};
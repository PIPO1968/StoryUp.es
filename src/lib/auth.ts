// Sistema de autenticación StoryUp - Registro público abierto

// Eliminado: toda la gestión de usuarios en localStorage. Usar API/DB.

// Obtener el usuario actual desde el token almacenado
// Eliminado: obtención de usuario actual desde localStorage. Usar API/DB.

// Login de usuario StoryUp
export const loginUser = async (credentials: { email: string; password: string }) => {
    // Implementar llamada a API/DB
    throw new Error('loginUser debe implementarse con API/DB');

    if (!credentials.email || !credentials.password) {
        throw new Error('Email y contraseña son requeridos');
    }

    const users = getStoredUsers();

    // Buscar usuario por email o username
    const user = users.find(u =>
        (u.email === credentials.email || u.username === credentials.email) &&
        u.password === credentials.password
    );

    if (!user) {
        throw new Error('Credenciales incorrectas');
    }

    // Marcar usuario como online
    user.isOnline = true;
    saveUsers(users);

    const token = 'storyup_token_' + user.id + '_' + Date.now();
    // Eliminar referencia a localStorage. Usar API/DB.

    return user;
} catch (error) {
    console.error('Error en login:', error);
    throw error;
}
};

// Registro de usuario StoryUp (público y abierto)
export const registerUser = async (userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    role?: string;
}) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!userData.username || !userData.email || !userData.password || !userData.name) {
            throw new Error('Todos los campos son requeridos');
        }

        const users = getStoredUsers();

        // Verificar si ya existe el usuario
        const existingUserByEmail = users.find(u => u.email === userData.email);
        const existingUserByUsername = users.find(u => u.username === userData.username);

        if (existingUserByEmail) {
            console.log('Email ya registrado:', userData.email);
            throw new Error(`El email ${userData.email} ya está registrado`);
        }

        if (existingUserByUsername) {
            console.log('Username ya registrado:', userData.username);
            throw new Error(`El usuario ${userData.username} ya está registrado`);
        }

        // Crear nuevo usuario
        const newUser = {
            id: (users.length + 1).toString(),
            username: userData.username,
            email: userData.email,
            name: userData.name,
            password: userData.password,
            role: userData.role || 'user', // Usar el rol seleccionado o 'user' por defecto
            avatar: '/favicon.ico',
            likes: 0,
            trophies: [],
            friends: [],
            isOnline: true,
            createdAt: new Date().toISOString()
        };

        // Agregar usuario a la lista
        users.push(newUser);
        saveUsers(users);

        // Marcar como logueado
        const token = 'storyup_token_' + newUser.id + '_' + Date.now();
        // Eliminar referencia a localStorage. Usar API/DB.

        return newUser;
    } catch (error) {
        console.error('Error en registro:', error);
        throw error;
    }
};

// Logout
export const logoutUser = () => {
    // Eliminar referencia a localStorage. Usar API/DB.
    window.location.href = '/';
};

// Actualizar datos del usuario (simulado)
export const updateUser = async (updates: Partial<any>) => {
    try {
        // Eliminar referencia a localStorage. Usar API/DB.
        if (!token) throw new Error('No autorizado');

        // Simular actualización
        await new Promise(resolve => setTimeout(resolve, 500));

        // Obtener datos actuales del usuario
        // Eliminar referencia a localStorage. Usar API/DB.
        if (!currentUserData) throw new Error('Usuario no encontrado');

        const currentUser = JSON.parse(currentUserData);
        const updatedUser = { ...currentUser, ...updates };

        // Guardar datos actualizados
        // Eliminar referencia a localStorage. Usar API/DB.

        return updatedUser;
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        throw error;
    }
};

// Obtener token para requests autenticados
export const getAuthToken = () => {
    // Eliminar referencia a localStorage. Usar API/DB.
};

// Obtener estadísticas de usuarios StoryUp
export const getUserStats = () => {
    const users = getStoredUsers();
    const totalUsers = users.length;
    const onlineUsers = users.filter(u => u.isOnline).length;

    return {
        totalUsers,
        onlineUsers,
        users
    };
};

// Obtener todos los usuarios (para administración)
export const getAllUsers = () => {
    return getStoredUsers();
};
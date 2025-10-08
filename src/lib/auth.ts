// Stub temporal para evitar errores de importación
// Lee el JWT de la cookie y consulta el usuario actual vía API
export const getCurrentUser = async () => {
    const token = getCookie('storyup_jwt');
    if (!token) return null;
    try {
        const response = await fetch('/api/auth', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.user || null;
    } catch (error) {
        return null;
    }
};

export const getStoredUsers = async () => {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('No se pudo obtener la lista de usuarios');
        const data = await response.json();
        return data.users || [];
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
};
// Sistema de autenticación StoryUp - Registro público abierto



// Obtener el usuario actual desde el token almacenado


// Login de usuario StoryUp
// Login: guarda el JWT en cookie tras autenticación
export const loginUser = async (credentials: { email: string; password: string }) => {
    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Credenciales incorrectas');
    }
    const data = await response.json();
    setCookie('storyup_jwt', data.token, 7);
    // Normalizar el rol para el frontend
    let role = 'user';
    if (data.user.userType === 'Padre/Docente') role = 'teacher';
    if (data.user.userType === 'Usuario') role = 'user';
    return { ...data.user, role };
}

// Registro de usuario StoryUp (público y abierto)
// Registro: guarda el JWT en cookie tras registro
export const registerUser = async (userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    role?: string;
}) => {
    // Mapear el valor del select a los valores esperados por el backend
    let userType = 'Usuario';
    if (userData.role === 'teacher') userType = 'Padre/Docente';
    if (userData.role === 'user') userType = 'Usuario';
    const payload = { ...userData, userType };
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrarse');
    }
    const data = await response.json();
    setCookie('storyup_jwt', data.token, 7);
    return data.user;
}

// Logout
// Logout: elimina la cookie JWT y recarga
export const logoutUser = () => {
    deleteCookie('storyup_jwt');
    window.location.href = '/';
};

// Actualizar datos del usuario (simulado)
export const updateUser = async (updates: Partial<any>) => {
    try {
        // Implementar actualización vía API/DB
        // Ejemplo:
        // const response = await fetch('/api/auth/update', { method: 'POST', body: JSON.stringify(updates) });
        // if (!response.ok) throw new Error('Actualización fallida');
        // return await response.json();
        throw new Error('updateUser debe implementarse con API/DB');
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        throw error;
    }
};


// Helpers para cookies
function setCookie(name: string, value: string, days: number) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name: string) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name: string) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Obtener estadísticas de usuarios StoryUp
export const getUserStats = () => {
    // Implementar obtención de estadísticas vía API/DB
    throw new Error('getUserStats debe implementarse con API/DB');
};

// Obtener todos los usuarios (para administración)
export const getAllUsers = () => {
    // Implementar obtención de usuarios vía API/DB
    throw new Error('getAllUsers debe implementarse con API/DB');
};
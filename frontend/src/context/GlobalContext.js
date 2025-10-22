import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCookie, deleteCookie } from '../cookieUtils';

const API_URL = process.env.REACT_APP_API_URL || 'https://storyup-backend.onrender.com/api';

const GlobalContext = createContext();

export function useGlobal() {
    return useContext(GlobalContext);
}

export function GlobalProvider({ children }) {
    // Estado global para todos los datos (puedes añadir más claves según crezca el backend)
    const [data, setData] = useState({
        usuario: null,
        usuarios: [],
        noticias: [],
        historias: [],
        concursos: [],
        estadisticas: {},
        // ...aquí se pueden añadir más entidades automáticamente
    });
    const [loading, setLoading] = useState(true);

    // Cargar todos los datos principales al iniciar, restaurando sesión con token si existe
    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const token = getCookie('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const [me, usuarios, news, stories, contests, stats] = await Promise.all([
                fetch(`${API_URL}/me`, { headers, credentials: 'include' }).then(r => r.ok ? r.json() : null),
                fetch(`${API_URL}/usuarios`).then(r => r.ok ? r.json() : []),
                fetch(`${API_URL}/news`).then(r => r.ok ? r.json() : []),
                fetch(`${API_URL}/stories`).then(r => r.ok ? r.json() : []),
                fetch(`${API_URL}/concursos`).then(r => r.ok ? r.json() : []),
                fetch(`${API_URL}/estadisticas`).then(r => r.ok ? r.json() : {})
            ]);
            setData(prev => ({
                ...prev,
                usuario: me?.user || null,
                usuarios: usuarios,
                noticias: news,
                historias: stories,
                concursos: contests,
                estadisticas: stats,
                // Si el backend añade más entidades, solo hay que añadirlas aquí
            }));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Refrescar todo tras cambios
    const refreshAll = fetchAll;

    // Función genérica para actualizar cualquier entidad (por clave)
    const setEntity = (key, value) => setData(prev => ({ ...prev, [key]: value }));

    // Logout global: borra token, limpia usuario y refresca datos
    const logout = () => {
        deleteCookie('token');
        setData(prev => ({ ...prev, usuario: null }));
        fetchAll();
    };

    return (
        <GlobalContext.Provider value={{
            ...data,
            setEntity, // Para actualizar cualquier entidad por clave
            refreshAll,
            logout,
            loading
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

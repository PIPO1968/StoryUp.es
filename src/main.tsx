import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthContext } from './App';
import './output.css';
import './App.css';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthContext.Provider value={{ user: null, setUser: () => { } }}>
            <App />
        </AuthContext.Provider>
    </React.StrictMode>
);
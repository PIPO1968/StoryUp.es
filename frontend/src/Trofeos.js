import React, { useEffect, useState } from 'react';
import './Trofeos.css';

// Lista de trofeos (puedes ajustar los nombres y descripciones)
const TROFEOS = Array.from({ length: 22 }, (_, i) => ({
    id: i + 1,
    nombre: `Premio${i + 1}`,
    imagen: `/assets/Premio${i + 1}.png`,
    descripcion: `Descripción del trofeo ${i + 1}` // Reemplaza por descripciones reales
}));

// Simulación: trofeos conseguidos por el usuario (esto debería venir de props o backend)
const TROFEOS_CONSEGUIDOS = [1, 3, 5, 7, 10]; // Ejemplo

const Trofeos = () => {
    const [conseguidos, setConseguidos] = useState([]);

    useEffect(() => {
        // Aquí deberías cargar los trofeos conseguidos del usuario (API/backend)
        setConseguidos(TROFEOS_CONSEGUIDOS);
    }, []);

    return (
        <div className="trofeos-container">
            <h2>Mis Trofeos</h2>
            <div className="trofeos-grid">
                {TROFEOS.map(trofeo => {
                    const conseguido = conseguidos.includes(trofeo.id);
                    return (
                        <div
                            key={trofeo.id}
                            className={`trofeo ${conseguido ? 'conseguido' : 'no-conseguido'}`}
                            title={trofeo.descripcion}
                        >
                            <img
                                src={trofeo.imagen}
                                alt={trofeo.nombre}
                                className="trofeo-img"
                                style={{ filter: conseguido ? 'none' : 'grayscale(100%)', opacity: conseguido ? 1 : 0.5 }}
                            />
                            <div className="trofeo-nombre">{trofeo.nombre}</div>
                        </div>
                    );
                })}
            </div>
            <div className="trofeos-ayuda">
                <p>Pasa el ratón por encima de cada trofeo para ver cómo conseguirlo.</p>
            </div>
        </div>
    );
};

export default Trofeos;

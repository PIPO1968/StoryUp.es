// Componente de trofeos (placeholder)
import React from 'react';

export default function Trofeos({ trophies }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {trophies.map((trophy) => (
                <div key={trophy.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                    <img src={trophy.image} alt={trophy.name} style={{ width: '50px', height: '50px' }} />
                    <h4>{trophy.name}</h4>
                    <p>{trophy.description}</p>
                </div>
            ))}
        </div>
    );
}

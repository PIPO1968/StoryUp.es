import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminPanel() {
    const [schools, setSchools] = useState([]);
    const [newSchool, setNewSchool] = useState('');

    const handleAddSchool = () => {
        if (newSchool.trim()) {
            setSchools([...schools, newSchool]);
            setNewSchool('');
        }
    };

    const handleDeleteSchool = (school) => {
        setSchools(schools.filter((s) => s !== school));
    };

    return (
        <div className="p-6 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Añadir Colegio/Instituto</h2>
                <div className="flex gap-2">
                    <Input
                        value={newSchool}
                        onChange={(e) => setNewSchool(e.target.value)}
                        placeholder="Nombre del colegio/instituto"
                    />
                    <Button onClick={handleAddSchool}>Añadir</Button>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Lista de Colegios/Institutos</h2>
                <ul>
                    {schools.map((school, index) => (
                        <li key={index} className="flex justify-between items-center border-b py-2">
                            <span>{school}</span>
                            <Button variant="destructive" onClick={() => handleDeleteSchool(school)}>
                                Eliminar
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

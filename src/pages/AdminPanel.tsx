import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminPanel: React.FC = () => {
    const [schools, setSchools] = useState<string[]>([]);
    const [newSchool, setNewSchool] = useState('');

    useEffect(() => {
        // Simulación de carga inicial de colegios desde una API o base de datos
        const fetchSchools = async () => {
            try {
                const response = await fetch('/api/schools'); // Reemplazar con la URL real de la API
                const data = await response.json();
                setSchools(data.schools);
            } catch (error) {
                console.error('Error al cargar los colegios:', error);
            }
        };

        fetchSchools();
    }, []);

    const handleAddSchool = async () => {
        if (!newSchool.trim()) return;

        try {
            // Simulación de añadir un colegio a través de una API
            const response = await fetch('/api/schools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSchool }),
            });

            if (response.ok) {
                setSchools([...schools, newSchool]);
                setNewSchool('');
            } else {
                console.error('Error al añadir el colegio');
            }
        } catch (error) {
            console.error('Error al añadir el colegio:', error);
        }
    };

    const handleDeleteSchool = async (school: string) => {
        try {
            // Simulación de eliminar un colegio a través de una API
            const response = await fetch(`/api/schools/${school}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSchools(schools.filter((s) => s !== school));
            } else {
                console.error('Error al eliminar el colegio');
            }
        } catch (error) {
            console.error('Error al eliminar el colegio:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
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
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Colegio/Instituto</th>
                                <th className="border border-gray-300 px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schools.map((school, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-2">{school}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Button variant="destructive" onClick={() => handleDeleteSchool(school)}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
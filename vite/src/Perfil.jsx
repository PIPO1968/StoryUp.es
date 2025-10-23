import React, { useState, useEffect } from 'react';
// Puedes adaptar los imports de UI según tu librería instalada
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import { useAuth } from './AuthContext';

function Perfil() {
    const { user } = useAuth();
    const [schoolCenter, setSchoolCenter] = useState('');
    const [schoolCenterSaved, setSchoolCenterSaved] = useState(false);
    const [likes, setLikes] = useState(0);
    const [likesBreakdown, setLikesBreakdown] = useState({ storyLikes: 0, panelLikes: 0, contestLikes: 0 });
    const [trophies, setTrophies] = useState([]);

    useEffect(() => {
        if (user?.id) {
            fetch(`/api/user?id=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.centro_escolar) {
                        setSchoolCenter(data.centro_escolar);
                        setSchoolCenterSaved(true);
                    } else {
                        setSchoolCenter('');
                        setSchoolCenterSaved(false);
                    }
                });
            fetch(`/api/user/likes?id=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setLikes(data.totalLikes || 0);
                    setLikesBreakdown({
                        storyLikes: data.storyLikes || 0,
                        panelLikes: data.panelLikes || 0,
                        contestLikes: data.contestLikes || 0
                    });
                });
            fetch(`/api/user/trophies?id=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setTrophies(data.trophies || []);
                });
        }
    }, [user?.id]);

    const handleSaveSchoolCenter = async () => {
        if (!schoolCenter.trim() || !user?.id) return;
        await fetch(`/api/user?id=${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ centro_escolar: schoolCenter.trim() })
        });
        setSchoolCenterSaved(true);
    };

    const profileData = {
        name: user?.name || 'Usuario',
        email: user?.email || '',
        username: user?.username || '',
        role: user?.role || 'user',
        likes,
        trophies,
        friends: user?.friends || []
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                    <User className="mr-3 text-blue-600" />
                    Mi Perfil
                </h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Datos Personales */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl text-blue-700 flex items-center mb-4">
                        <User className="mr-2 w-5 h-5" />
                        Datos Personales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de usuario
                            </label>
                            <input value={profileData.username} readOnly className="w-full border rounded px-2 py-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre real
                            </label>
                            <input value={profileData.name} readOnly className="w-full border rounded px-2 py-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input value={profileData.email} readOnly className="w-full border rounded px-2 py-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rol
                            </label>
                            <input value={profileData.role} readOnly className="w-full border rounded px-2 py-1" />
                        </div>
                    </div>
                </div>
                {/* Likes y Trofeos */}
                <div className="lg:col-span-2 bg-blue-50 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2">Likes y Trofeos</h2>
                    <div className="mb-2">Total Likes: <span className="font-bold">{likes}</span></div>
                    <div className="mb-2">Likes en historias: {likesBreakdown.storyLikes}</div>
                    <div className="mb-2">Likes en panel: {likesBreakdown.panelLikes}</div>
                    <div className="mb-2">Likes en concursos: {likesBreakdown.contestLikes}</div>
                    <div className="mb-2">Trofeos: {trophies.length}</div>
                    <ul className="list-disc ml-6">
                        {trophies.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                </div>
            </div>
            {/* Centro escolar editable */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-blue-700 mb-2">Centro escolar</h2>
                <input
                    type="text"
                    value={schoolCenter}
                    onChange={e => { setSchoolCenter(e.target.value); setSchoolCenterSaved(false); }}
                    className="w-full border rounded px-2 py-1 mb-2"
                    placeholder="Introduce tu centro escolar"
                />
                <button
                    onClick={handleSaveSchoolCenter}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={schoolCenterSaved}
                >{schoolCenterSaved ? 'Guardado' : 'Guardar'}</button>
            </div>
        </div>
    );
}

export default Perfil;

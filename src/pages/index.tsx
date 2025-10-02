import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '../lib/auth';

const supabase = createClient(
    'https://kvvsbomvoxvvunxkkjyf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dnNib212b3h2dnVueGtranlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzI4NjIsImV4cCI6MjA3NDY0ODg2Mn0.DSriZyytXiCDbutr6XJyV-0DAQh87G5EEVUOR2IvZ8k'
);

export default function WelcomePage() {
    const [announcements, setAnnouncements] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir automáticamente basado en el estado de autenticación
        const user = getCurrentUser();
        if (user) {
            navigate('/feed');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        async function fetchAnnouncements() {
            const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
            if (data) {
                setAnnouncements(data);
            } else {
                console.error('Error fetching announcements:', error);
            }
        }
        fetchAnnouncements();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center">
            <div className="space-y-8 max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-center space-x-3 mb-8">
                    <img
                        src="/assets/logo-grande.png.png"
                        alt="StoryUp Logo"
                        className="h-16 w-16 object-contain"
                    />
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        StoryUp
                    </h1>
                </div>

                <p className="text-lg text-muted-foreground animate-in fade-in delay-300 duration-700">
                    Conectando comunidades educativas a través de historias
                </p>

                <div className="animate-in fade-in delay-500 duration-700">
                    <div className="inline-flex items-center justify-center w-8 h-8 border-2 border-blue-600 rounded-full animate-spin">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Cargando...</p>
                </div>
            </div>

            {/* Panel de anuncios públicos */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">📢 Panel de Anuncios</h2>
                <div className="bg-white shadow-md rounded-lg p-4">
                    {announcements.length > 0 ? (
                        announcements.map((announcement) => (
                            <div key={announcement.id} className="mb-4">
                                <h3 className="font-bold text-lg">{announcement.title}</h3>
                                <p className="text-gray-600">{announcement.content}</p>
                                <p className="text-sm text-gray-400">{new Date(announcement.created_at).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No hay anuncios disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
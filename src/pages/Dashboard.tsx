import React from 'react';
import { useLanguage } from '../lib/LanguageContext';

const Dashboard: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div>
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {t.welcome}
                            </h1>
                            <p className="text-xl text-gray-600 mb-6">
                                {t.welcomeSubtitle}
                            </p>
                        </div>
                        {/* Sección de patrocinadores */}
                        <div className="sponsors-section" style={{ marginTop: '2.5rem', textAlign: 'center', background: '#f8f8f8', padding: '1.5rem 0', borderRadius: '12px' }}>
                            <h2 style={{ fontWeight: 'bold', fontSize: '1.7rem', marginBottom: '1rem', color: '#2c3e50' }}>PATROCINADORES:</h2>
                            <div className="sponsors-list">
                                {/* Ejemplo de patrocinador, puedes añadir más logos y nombres */}
                                <div className="sponsor-item" style={{ display: 'inline-block', margin: '0 2rem' }}>
                                    <img src="/assets/logo-grande.png.png" alt="Logo Patrocinador" style={{ width: '90px', height: '90px', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 2px 8px #ccc' }} />
                                    <div style={{ fontWeight: 'bold', marginTop: '0.7rem', fontSize: '1.1rem' }}>Nombre del Patrocinador</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <img
                                src="/assets/logo-grande.png.png"
                                alt="StoryUp.es Logo"
                                className="w-48 h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Bloques explicativos de la red social */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-blue-600 mb-3">📚 {t.createStories}</h2>
                        <p className="text-gray-600">
                            {t.createStoriesDesc}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-green-600 mb-3">👥 {t.community}</h2>
                        <p className="text-gray-600">
                            {t.communityDesc}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-purple-600 mb-3">🏆 {t.achievements}</h2>
                        <p className="text-gray-600">
                            {t.achievementsDesc}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-orange-600 mb-3">📊 {t.statistics}</h2>
                        <p className="text-gray-600">
                            {t.statisticsDesc}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-red-600 mb-3">💬 {t.chat}</h2>
                        <p className="text-gray-600">
                            {t.chatDesc}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-teal-600 mb-3">📰 {t.news}</h2>
                        <p className="text-gray-600">
                            {t.newsDesc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


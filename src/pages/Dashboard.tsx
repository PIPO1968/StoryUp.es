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


// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const HomePage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="logo-container flex justify-center mb-0">
                <img src={logo} alt="WhisperHub Logo" className="logo w-32 h-32 animate-pulse-slow" />
            </div>
            
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-blue-900">
                    Bienvenue sur <span className="text-red-500">WhisperHub</span>
                </h1>
                <p className="text-lg text-gray-600 mt-4">
                    L’espace d’expression anonyme des étudiants, exclusivement réservé à la vie étudiante ! 🎓
                </p>
            </header>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Exprimez-vous librement et sans crainte ! 😆</h2>
                <p className="text-gray-700">
                    WhisperHub est un espace sécurisé et anonyme, où vous pouvez partager librement vos pensées et expériences en toute bienveillance. Ici, tout tourne autour de la vie étudiante : anecdotes, conseils, et confessions légères sont au rendez-vous ! 💬
                </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Ce que vous pouvez partager 👇</h2>
                <p className="text-gray-700">
                    Parlez de vos expériences d’étudiants, partagez des conseils ou des blagues, et n’oubliez pas que le respect mutuel est essentiel. Notez bien : les discussions sur les enseignants ou l’administration ne sont pas permises.
                </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Règles strictes pour un espace bienveillant 🌱</h2>
                <p className="text-gray-700">
                    WhisperHub repose sur des règles de respect mutuel pour assurer un espace agréable. Toute infraction entraînera des sanctions pour garantir que l’atmosphère reste positive. L’anonymat est préservé, mais le respect est impératif. 
                </p>
            </section>

            {!localStorage.getItem('token') && (
                <section className="text-center mt-10">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">Rejoignez WhisperHub et faites partie de la communauté étudiante ! 🚀</h2>
                    <p className="text-gray-700 mb-6">
                        Prêt(e) à partager et explorer ? Créez votre compte ou connectez-vous pour rejoindre une communauté unique où chaque étudiant peut s’exprimer librement, sans filtre ni jugement !
                    </p>
                    <div className="space-x-4">
                        <Link to="/register" className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-red-500 transition-colors">
                            Inscription
                        </Link>
                        <Link to="/login" className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-blue-900 transition-colors">
                            Connexion
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default HomePage;

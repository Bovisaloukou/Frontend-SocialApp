// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const HomePage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Logo animé en haut de la page */}
            <div className="logo-container flex justify-center mb-0">
                <img src={logo} alt="WhisperHub Logo" className="logo w-32 h-32 animate-pulse-slow" />
            </div>
            
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-blue-900">
                    Bienvenue sur <span className="text-red-500">WhisperHub</span>
                </h1>
                <p className="text-lg text-gray-600 mt-4">
                    L’espace d’expression 100% anonyme des étudiants de l'ESGIS ! 🎓
                </p>
            </header>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Libérez vos pensées, sans crainte et sans filtre ! 😆</h2>
                <p className="text-gray-700">
                    WhisperHub est votre espace pour partager les pensées les plus secrètes, les anecdotes honteuses (ou héroïques), et même les pires blagues de cours ! Ici, pas de jugements, que des éclats de rire 😜 et des discussions entre étudiants. Alors, que ce soit une histoire embarrassante ou un cri de victoire, lâchez-vous ! 💥 C’est 100% anonyme, donc pas de stress ! 😌
                </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Pourquoi WhisperHub ? 🤔</h2>
                <p className="text-gray-700">
                    Marre des cours ? 🥱 Quelque chose à dire sur tes camarades ? 🕵️‍♀️ Ici, tu peux tout dire, et même plus ! Partage un coup de gueule, une blague, une confession secrète (mais marrante, on espère ! 😅), et profite de cet espace où ton seul devoir est de te lâcher et de t’amuser. 🥳
                </p>
                <p className="text-gray-700 mt-4">
                    <strong>Exprime-toi librement !</strong> Que ce soit pour rire, râler, ou juste partager un moment de vie – tout le monde ici est prêt à écouter sans juger (et peut-être à rire avec toi 🤭).
                </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Fonctionnalités principales :</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Poste une confession ou une photo</strong> pour donner vie à tes messages. Partage des histoires, des moments mémorables, ou des photos qui résument tout (ou qui créent le mystère ! 🕵️).</li>
                    <li><strong>Réponds aux confessions des autres</strong> et rejoins la conversation ! Avec les réponses en cascade, chaque discussion prend vie, comme une pause café entre potes. ☕</li>
                    <li><strong>Photos et illustrations</strong> : Ajoute une touche visuelle à tes confessions pour leur donner plus de piquant ! 🌶️ Que ce soit pour expliquer ton point de vue ou juste pour la beauté de l’art, les images sont les bienvenues.</li>
                </ul>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Une communauté fun, secrète et respectueuse 🕶️</h2>
                <p className="text-gray-700">
                    WhisperHub, c’est l’endroit où l’humour et la liberté sont rois. Tous les sujets sont les bienvenus, même les plus inattendus 😜, tant que le respect est maintenu. Anonymat, liberté, et fun : c’est ça l’esprit de WhisperHub !
                </p>
            </section>

            {!localStorage.getItem('token') && (
                <section className="text-center mt-10">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">Rejoins WhisperHub et fais partie de l’aventure ! 🚀</h2>
                    <p className="text-gray-700 mb-6">
                        Prêt(e) à tout révéler ? 🤫 Crée ton compte ou connecte-toi pour explorer, partager et réagir aux confessions de tes camarades. C’est ici que tu trouveras une communauté unique où chaque étudiant peut enfin s’exprimer librement, sans filtre ni masque ! 😎
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

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
                    L’espace d’expression 100% anonyme des étudiants de l'ESGIS !
                </p>
            </header>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Libérez vos pensées, sans crainte et sans filtre !</h2>
                <p className="text-gray-700">
                    WhisperHub est votre espace personnel pour partager, sans jugement, les réflexions les plus sincères et osées. Ici, vous pouvez dire tout ce qui vous passe par la tête, sans tabou ni restriction. Que ce soit une anecdote amusante, une critique, un moment embarrassant ou un message qui mérite d'être vu – c’est l’endroit idéal pour tout lâcher en toute sécurité. Et surtout, pas de stress, vos confessions resteront totalement anonymes !
                </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Pourquoi WhisperHub ?</h2>
                <p className="text-gray-700">
                    Sur WhisperHub, tout devient possible. Vous en avez marre de vos cours ? Vous avez quelque chose à dire sur vos camarades ou vos professeurs ? Ou peut-être une histoire inédite à partager ? Ici, vous pouvez tout révéler, avec la garantie d’être entendu sans crainte de jugement.
                </p>
                <p className="text-gray-700 mt-4">
                    <strong>Exprimez-vous librement !</strong> Que ce soit pour parler de vos amis, de vos cours, ou de ce qui vous amuse ou vous agace – vous avez carte blanche pour partager tout ce que vous voulez, sans risque et sans retenue.
                </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Fonctionnalités principales :</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Postez une confession ou une photo</strong> pour donner vie à vos messages. Partagez des histoires, des moments marquants de votre vie d’étudiant, ou illustrez vos propos avec des images parlantes.</li>
                    <li><strong>Répondez aux confessions des autres</strong> et participez aux conversations ! Avec les réponses en cascade, chaque discussion prend vie, tout comme une conversation animée entre amis.</li>
                    <li><strong>Photos et illustrations</strong> : Ajoutez une touche visuelle à vos confessions pour les rendre plus intenses et engageantes. Que ce soit pour contextualiser ou renforcer votre message, les photos sont là pour ça.</li>
                </ul>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Une communauté fun, secrète et respectueuse</h2>
                <p className="text-gray-700">
                    WhisperHub est un espace authentique où règne l'humour et l’ouverture d’esprit. Tous les sujets sont les bienvenus, même les plus inattendus, tant que le respect est maintenu. Anonymat, liberté et respect : ce sont les valeurs fondamentales de cette communauté secrète et bienveillante.
                </p>
            </section>

            <section className="text-center mt-10">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Rejoignez WhisperHub et faites partie de l’aventure !</h2>
                <p className="text-gray-700 mb-6">
                    Prêt à tout révéler ? Créez votre compte ou connectez-vous pour explorer, partager et réagir aux confessions de vos camarades. Découvrez une communauté unique où chaque étudiant peut s’exprimer librement, sans filtre ni masque.
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
        </div>
    );
};

export default HomePage;

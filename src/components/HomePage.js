import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg'; // Assurez-vous d'avoir le logo dans ce dossier

const HomePage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Logo animé en haut de la page */}
            <div className="logo-container">
                <img src={logo} alt="ESGIS Confessions Logo" className="logo" />
            </div>
            
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-blue-900">
                    Bienvenue sur <span className="text-red-500">ESGIS Confessions</span>
                </h1>
                <p className="text-lg text-gray-600 mt-4">
                    L’espace d’expression 100% anonyme des étudiants de l'ESGIS !
                </p>
            </header>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Libérez vos pensées, sans crainte et sans filtre !</h2>
                <p className="text-gray-700">
                    ESGIS Confessions est votre coin secret pour partager, sans jugement, vos réflexions les plus sincères. Ici, vous pouvez enfin dire ce que vous pensez, sans tabou et en toute sécurité. Que ce soit une anecdote drôle, un coup de gueule ou une réflexion sur la vie d’étudiant – c’est un espace dédié pour vous libérer et vous sentir compris. Et surtout, pas de stress, vos confessions resteront totalement anonymes !
                </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Pourquoi ESGIS Confessions ?</h2>
                <p className="text-gray-700">
                    Ce site est là pour vous offrir une plateforme où tout devient possible. Vous en avez marre de vos cours ? Un prof vous a marqué, en bien ou en mal ? Ou vous avez juste une histoire à partager ? Ici, vous pouvez tout raconter, avec la garantie d’être entendu et sans crainte de jugement.
                </p>
                <p className="text-gray-700 mt-4">
                    <strong>Exprimez-vous librement !</strong> Parlez de vos amis, de vos cours, de ce qui vous passionne ou vous irrite – sans risque et sans retenue.
                </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Fonctionnalités principales :</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Poster une confession ou une photo</strong> pour donner vie à votre message. Vous pouvez choisir de raconter une histoire ou d’illustrer un moment marquant de la vie d'étudiant avec des images.</li>
                    <li><strong>Répondez aux confessions des autres étudiants</strong>, réagissez, et participez aux conversations ! Grâce aux réponses en cascade, chaque discussion peut se développer naturellement, comme une conversation vivante.</li>
                    <li><strong>Photos et illustrations</strong> : Rendez vos confessions encore plus intenses et engageantes en ajoutant des photos – parfait pour faire passer un message visuel ou donner un contexte.</li>
                </ul>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Une communauté fun, secrète et respectueuse</h2>
                <p className="text-gray-700">
                    Le site ESGIS Confessions, c’est une ambiance décalée et authentique où l'humour et l'ouverture d’esprit règnent. Vous pouvez aborder tous les sujets, même les plus inédits, tout en respectant les autres et en maintenant une atmosphère bienveillante. Anonymat, liberté, respect : telles sont les valeurs fondamentales de votre nouvelle communauté en ligne.
                </p>
            </section>

            <section className="text-center mt-10">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Rejoignez ESGIS Confessions et faites partie de l’aventure !</h2>
                <p className="text-gray-700 mb-6">
                    Prêt à tout lâcher ? Créez votre compte ou connectez-vous dès maintenant pour lire, partager et réagir aux confessions de vos camarades. Explorez cette communauté unique où chaque étudiant peut être lui-même, sans filtre ni masque.
                </p>
                <div className="space-x-4">
                    <Link to="/signup" className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-red-500 transition-colors">
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
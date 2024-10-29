import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fonction pour déconnecter l'utilisateur
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
      <nav className="bg-blue-600 p-4 shadow-md">
        <div className="flex justify-between items-center">
          {/* Nom du site qui renvoie à la page principale */}
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-lg hover:text-gray-300">
              WhisperHub
            </Link>
          </div>

          {/* Icône du menu hamburger pour mobile */}
          <div className="sm:hidden w-full flex justify-end">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none ml-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
          </div>

          {/* Liens de la navbar (affichés sur grand écran) */}
          <ul className="hidden sm:flex space-x-4 ml-auto list-none">
            {!token ? (
              <>
                <li>
                  <Link to="/login" className="text-white hover:text-gray-300 transition-colors">Connexion</Link>
                </li>
                <li>
                  <Link to="/register" className="text-white hover:text-gray-300 transition-colors">Inscription</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/events" className="text-white hover:text-gray-300 transition-colors">Événements</Link>
                </li>
                <li>
                  <Link to="/create-event" className="text-white hover:text-gray-300 transition-colors">Créer un événement</Link>
                </li>
                <li>
                  <Link to="/confessions" className="text-white hover:text-gray-300 transition-colors">Confessions</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-white hover:text-gray-300 transition-colors">Se déconnecter</button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <ul className="flex flex-col space-y-4 mt-4 sm:hidden">
            {!token ? (
              <>
                <li>
                  <Link to="/login" className="text-white hover:text-gray-300 transition-colors">Connexion</Link>
                </li>
                <li>
                  <Link to="/register" className="text-white hover:text-gray-300 transition-colors">Inscription</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/events" className="text-white hover:text-gray-300 transition-colors">Événements</Link>
                </li>
                <li>
                  <Link to="/create-event" className="text-white hover:text-gray-300 transition-colors">Créer un événement</Link>
                </li>
                <li>
                  <Link to="/confessions" className="text-white hover:text-gray-300 transition-colors">Confessions</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-white hover:text-gray-300 transition-colors">Se déconnecter</button>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>
  );
};

export default Navbar;

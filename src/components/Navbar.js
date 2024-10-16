// /src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fonction pour déconnecter l'utilisateur
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token du localStorage
    navigate('/login'); // Rediriger vers la page de connexion
  };

  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex space-x-4 justify-end">
        {!token ? (
          <>
            <li>
              <Link to="/login" className="text-white hover:text-gray-300">Connexion</Link>
            </li>
            <li>
              <Link to="/register" className="text-white hover:text-gray-300">Inscription</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/events" className="text-white hover:text-gray-300">Événements</Link>
            </li>
            <li>
              <Link to="/create-event" className="text-white hover:text-gray-300">Créer un événement</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-white hover:text-gray-300">Se déconnecter</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

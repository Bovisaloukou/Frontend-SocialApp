// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matricule, setMatricule] = useState('');  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');  // Message de confirmation
  const [isLoading, setIsLoading] = useState(false);  // État de chargement
  const [readyToRedirect, setReadyToRedirect] = useState(false); // Pour la redirection
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');  // Réinitialisation des messages
    setIsLoading(true);  // Activation de l'état de chargement

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;  // URL du backend depuis les variables d'environnement
      const response = await fetch(`${backendUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, matricule })  // Données envoyées au backend
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentification échouée. Veuillez vérifier vos informations.');
        }
        throw new Error(data.error || 'Erreur lors de la requête');
      }

      // Si l'inscription est réussie, afficher un message de confirmation
      setMessage('Inscription réussie. Un email de vérification a été envoyé.');
      setIsLoading(false);
      setReadyToRedirect(true);  // Redirection activée

    } catch (error) {
      setError('Échec de la requête : ' + error.message);
      setIsLoading(false);  // Désactivation du chargement en cas d'erreur
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Matricule"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button 
          type="submit" 
          className={`w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Inscription en cours...' : "S'inscrire"}
        </button>
      </form>
      
      {/* Message de confirmation ou d'erreur */}
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Redirection vers la page de connexion après succès */}
      {readyToRedirect && (
        <button
          className="mt-4 p-2 bg-green-600 text-white rounded"
          onClick={() => navigate('/login')}
        >
          Aller à la page de connexion
        </button>
      )}
    </div>
  );
};

export default Register;
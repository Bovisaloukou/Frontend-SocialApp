// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matricule, setMatricule] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [readyToRedirect, setReadyToRedirect] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, matricule })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentification échouée. Veuillez vérifier vos informations.');
        }
        throw new Error(data.error || 'Erreur lors de la requête');
      }

      setMessage('Inscription réussie. Un email de vérification a été envoyé.');
      setIsLoading(false);
      setReadyToRedirect(true);

    } catch (error) {
      setError('Échec de la requête : ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Inscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
        />
        <input
          type="text"
          placeholder="Matricule"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          required
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
        />
        <button
            type="submit"
            className={`w-full p-3 rounded bg-[#4A90E2] text-white hover:bg-[#357ABD] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
        >
            {isLoading ? 'Inscription en cours...' : "S'inscrire"}
        </button>

      </form>

      {/* Message de confirmation ou d'erreur */}
      {message && <p className="text-center mt-4 text-[#B3CBB9]">{message}</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}

      {/* Redirection vers la page de connexion après succès */}
      {readyToRedirect && (
        <button
          className="mt-4 w-full p-3 bg-[#B3CBB9] text-white rounded hover:bg-green-500 transition-colors"
          onClick={() => navigate('/login')}
        >
          Aller à la page de connexion
        </button>
      )}
    </div>
  );
};

export default Register;
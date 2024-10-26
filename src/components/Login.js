import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error before making the request
  
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();  // S'assurer que la réponse est au format JSON
  
      if (response.ok) {
        if (data.token) {
          // Stocker le token JWT dans localStorage et rediriger si tout est correct
          localStorage.setItem('token', data.token);
          navigate('/confessions');
        } else {
          // Si pas de token mais la réponse est OK, afficher un message d'erreur
          setError(data.error || 'Erreur lors de la connexion');
        }
      } else {
        // Capturer l'erreur si l'email n'est pas vérifié ou autre
        setError(data.error || 'Erreur lors de la connexion');
      }
    } catch (err) {
      // Capture les erreurs réseau et affiche un message spécifique
      setError('Une erreur réseau s\'est produite, veuillez réessayer.');
    }
  };  
  
  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Se connecter
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Login;
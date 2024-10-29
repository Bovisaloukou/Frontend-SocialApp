import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Nouvel état pour gérer le chargement
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);  // Active le mode chargement

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/confessions');
        } else {
          setError(data.error || 'Erreur lors de la connexion');
        }
      } else {
        setError(data.error || 'Erreur lors de la connexion');
      }
    } catch (err) {
      setError('Une erreur réseau s\'est produite, veuillez réessayer.');
    } finally {
      setIsLoading(false);  // Désactive le mode chargement
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
        <button 
          type="submit" 
          className={`w-full p-2 text-white rounded transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
          disabled={isLoading}  // Désactive le bouton si isLoading est vrai
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Login;
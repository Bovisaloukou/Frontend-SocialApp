// /src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error before making the request
  
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Utilise le message d'erreur du backend si disponible
        throw new Error(data.error || 'Erreur lors de la requête');
      }
  
      if (data.message === 'Utilisateur créé avec succès') {
        navigate('/login'); // Redirect to login on successful registration
      }
    } catch (error) {
      // Capture et affiche les messages d'erreur renvoyés par le backend
      setError('Échec de la requête : ' + error.message);
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
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          S'inscrire
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Register;

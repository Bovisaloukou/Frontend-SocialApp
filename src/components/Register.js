import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matricule, setMatricule] = useState('');  // Ajout du champ matricule
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // État pour gérer le chargement
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Démarre le chargement
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, matricule })  // Inclure le matricule
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la requête');
      }
  
      if (data.message === 'Utilisateur créé avec succès') {
        navigate('/login'); // Redirige vers la page de connexion en cas de succès
      }
    } catch (error) {
      setError('Échec de la requête : ' + error.message);
    } finally {
      setIsLoading(false); // Arrête le chargement
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
          onChange={(e) => setMatricule(e.target.value)}  // Gestion du champ matricule
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
          disabled={isLoading}  // Désactive le bouton pendant le chargement
        >
          {isLoading ? 'Inscription en cours...' : "S'inscrire"}  {/* Change le texte pendant le chargement */}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Register;
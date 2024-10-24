// /components/EmailVerification.js

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EmailVerification = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = new URLSearchParams(location.search).get('token');
      if (!token) {
        setError('Token manquant');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })  // Envoie le token au backend
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la vérification');
        }

        setMessage('Email vérifié avec succès. Vous allez être redirigé vers la page de connexion.');
        setTimeout(() => navigate('/login'), 3000);  // Redirige après 3 secondes
      } catch (err) {
        setError('Échec de la vérification de l\'email : ' + err.message);
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Vérification de l'email</h2>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default EmailVerification;
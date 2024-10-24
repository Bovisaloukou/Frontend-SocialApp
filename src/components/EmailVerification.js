import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const EmailVerification = () => {
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = new URLSearchParams(location.search).get('token');
      if (!token) {
        setError('Token manquant');
        return;
      }

      try {
        // Appel à la route backend qui redirige automatiquement
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/verify-email?token=${token}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erreur lors de la vérification');
        }

      } catch (err) {
        setError('Échec de la vérification de l\'email : ' + err.message);
      }
    };

    verifyEmail();
  }, [location]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Vérification de l'email</h2>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default EmailVerification;
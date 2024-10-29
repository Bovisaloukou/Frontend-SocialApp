import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = new URLSearchParams(location.search).get('token');
      if (!token) {
        setError('Token manquant');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/verify-email?token=${token}`);
        
        if (response.ok) {
          setIsVerified(true);
          setTimeout(() => navigate('/login'), 3000); // Redirection après 3 secondes
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Erreur lors de la vérification');
        }
      } catch (err) {
        setError(`Échec de la vérification de l'email : ${err.message}`);
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Vérification de l'email</h2>
      {isVerified ? (
        <p className="text-green-600 text-center">
          Email vérifié avec succès ! Vous serez redirigé vers la page de connexion...
        </p>
      ) : (
        <p className="text-red-600 text-center mt-4">{error}</p>
      )}
    </div>
  );
};

export default EmailVerification;
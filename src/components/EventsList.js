// /src/components/EventsList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCodeIcon } from '@heroicons/react/24/outline';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState(''); // Pour stocker l'email de l'utilisateur
    const navigate = useNavigate();

    // Vérifie si le token JWT existe et redirige vers la page de login si ce n'est pas le cas
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    // Récupérer l'email de l'utilisateur (ou d'autres infos) depuis le token JWT
    useEffect(() => {
        const getUserDataFromToken = () => {
            const token = localStorage.getItem('token');
            //console.log(token)
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1])); // Décoder le token JWT
                    //console.log(payload)
                    setUserEmail(payload.email); // Extraire l'email du token
                    //console.log('Email utilisateur extrait du token:', payload.email); // Log de vérification
                } catch (error) {
                    console.error('Erreur lors du décodage du token JWT:', error);
                }
            }
        };

        getUserDataFromToken();
    }, []);

    // Appel API pour récupérer les événements publics et privés
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Aucun token trouvé, redirection vers la page de connexion.');
                navigate('/login');
                return;
            }

            try {
                const backendUrl = process.env.REACT_APP_BACKEND_URL;
                const response = await fetch(`${backendUrl}/events/events`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log('Requête envoyée, réponse:', response);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Données des événements récupérées:', data);
                    const { publicEvents = [], privateEvents = [] } = data;

                    const privateEventsForUser = privateEvents.filter(event =>
                        event.invitations && event.invitations.includes(userEmail)
                    );
                    console.log(privateEventsForUser)

                    setEvents([...publicEvents, ...privateEventsForUser]); // Mise à jour des événements dans le state
                } else {
                    console.error('Erreur lors de la récupération des événements:', response.status);
                }
            } catch (error) {
                console.error('Erreur lors de la requête de récupération des événements:', error);
            }

            setLoading(false);
        };

        if (userEmail) {
            console.log('Lancement de la récupération des événements pour:', userEmail); // Log de vérification
            fetchEvents();
        }
    }, [userEmail, navigate]);        

    return (
        <div className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center">Liste des événements</h2>
            {loading ? (
                <p className="text-gray-500 text-center">Chargement des événements...</p>
            ) : events.length === 0 ? (
                <p className="text-gray-500 text-center">Aucun événement disponible pour le moment.</p>
            ) : (
                <ul className="space-y-4">
                    {events.map(event => (
                        <li key={event._id} className="p-4 bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow">
                            <h3 className="text-2xl font-semibold text-blue-600">{event.title}</h3>
                            <p className="text-gray-700 mt-2">{event.description}</p>
                            <p className="text-gray-500 mt-2 italic">{new Date(event.date).toLocaleString()}</p>
                            <div className="flex space-x-4 mt-2">
                                <button
                                    className="text-sm text-blue-500 hover:underline"
                                    onClick={() => navigate(`/events/${event._id}`)}
                                >
                                    Voir les détails
                                </button>
                                {/* QR code visible uniquement pour les événements privés */}
                                {event.isPrivate && (
                                    <button
                                        className="text-sm text-blue-500 hover:underline flex items-center"
                                        onClick={() => navigate(`/events/${event._id}/qrcode`)}
                                    >
                                        <QrCodeIcon className="w-5 h-5 mr-1" />
                                        Voir le code QR
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EventsList;

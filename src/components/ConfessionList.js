import React, { useState, useEffect } from 'react';

const ConfessionList = () => {
    const [confessions, setConfessions] = useState([]);
    const [newConfession, setNewConfession] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [replyInputs, setReplyInputs] = useState({}); // Gère l'affichage des champs de réponse
    const [showReplies, setShowReplies] = useState({}); // Gère l'affichage des réponses
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    // Récupère toutes les confessions au chargement du composant
    useEffect(() => {
        const fetchConfessions = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/confessions`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des confessions.');
                }
                const data = await response.json();
                setConfessions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchConfessions();
    }, [BACKEND_URL]);

    // Crée une nouvelle confession
    const handlePostConfession = async () => {
        if (newConfession.trim() === '') return;

        try {
            const response = await fetch(`${BACKEND_URL}/api/confessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newConfession })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création de la confession.');
            }

            const data = await response.json();
            setConfessions([data, ...confessions]);
            setNewConfession('');
        } catch (err) {
            setError(err.message);
        }
    };

    // Ajoute une réponse à une confession ou à une sous-réponse
    const handleAddReply = async (confessionId, replyContent, parentReplyId = null) => {
        if (replyContent.trim() === '') return;
    
        try {
            const endpoint = parentReplyId
                ? `${BACKEND_URL}/api/confessions/${confessionId}/replies/${parentReplyId}`  // Sous-réponse
                : `${BACKEND_URL}/api/confessions/${confessionId}/replies`;  // Réponse principale
    
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: replyContent })
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors de la création de la réponse.');
            }
    
            const updatedConfession = await response.json();
            setConfessions(confessions.map(confession =>
                confession._id === confessionId ? updatedConfession : confession
            ));
        } catch (error) {
            console.error('Erreur lors de la création de la sous-réponse :', error);
        }
    };    

    // Active le champ de réponse pour une confession ou une réponse spécifique
    const toggleReplyInput = (confessionId) => {
        setReplyInputs(prev => ({
            ...prev,
            [confessionId]: !prev[confessionId] // Toggle l'affichage du champ de réponse
        }));
    };

    // Active l'affichage des réponses pour une confession
    const toggleShowReplies = (confessionId) => {
        setShowReplies(prev => ({
            ...prev,
            [confessionId]: !prev[confessionId] // Toggle l'affichage des réponses
        }));
    };

    // Gère l'affichage des réponses et sous-réponses
const renderReplies = (replies = [], confessionId) => {
    return (
        <ul className="space-y-2 mt-2">
            {replies.map((reply, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded-lg">
                    <p className="text-gray-700">{reply.content}</p>
                    <p className="text-sm text-gray-500">
                        <em>{new Date(reply.createdAt).toLocaleString()}</em>
                    </p>
                    {/* Sous-réponses */}
                    {reply.replies?.length > 0 && (
                        <div className="ml-4">
                            {renderReplies(reply.replies, confessionId)}
                        </div>
                    )}
                    <a
                        href="#!"
                        onClick={() => toggleReplyInput(reply._id)}
                        className="text-sm text-blue-500 hover:underline mt-2 block"
                    >
                        Répondre
                    </a>
                    {replyInputs[reply._id] && (
                        <textarea
                        placeholder="Répondre à cette réponse..."
                        rows="2"
                        onKeyDown={(e) => {
                            if (e.target && e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddReply(confessionId, e.target.value, reply._id);  // Ajout d'une sous-réponse
                                e.target.value = '';  // Réinitialiser après avoir ajouté la réponse
                            }
                        }}
                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                    />
                    )}
                </li>
            ))}
        </ul>
    );
};

    if (loading) return <p className="text-center text-gray-500">Chargement des confessions...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="container mx-auto mt-8 p-4">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Confessions Anonymes</h2>

            <div className="mb-6">
                <textarea
                    value={newConfession}
                    onChange={(e) => setNewConfession(e.target.value)}
                    placeholder="Partagez votre confession..."
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
                <button
                    onClick={handlePostConfession}
                    className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Poster
                </button>
            </div>

            <ul className="space-y-6">
                {confessions.map(confession => (
                    <li key={confession._id} className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
                        <p className="text-gray-800 mb-4" style={{ wordWrap: 'break-word' }}>{confession.content}</p>

                        {/* Lien pour afficher les réponses */}
                        <a
                            href="#!"
                            onClick={() => toggleShowReplies(confession._id)}
                            className="text-sm text-blue-500 hover:underline mt-4 block"
                        >
                            {showReplies[confession._id] ? 'Masquer les réponses' : 'Voir les réponses'}
                        </a>

                        {/* Affichage des réponses */}
                        {showReplies[confession._id] && (
                            <div className="mt-4 border-t pt-4">
                                <h4 className="text-lg font-semibold text-gray-600">Réponses :</h4>
                                {(!confession.replies || confession.replies.length === 0) ? (
                                    <>
                                        <p className="text-gray-500">Aucune réponse pour le moment, soyez le premier à commenter.</p>
                                        <a
                                            href="#!"
                                            onClick={() => toggleReplyInput(confession._id)}
                                            className="text-sm text-blue-500 hover:underline mt-2 block"
                                        >
                                            Répondre
                                        </a>
                                        {replyInputs[confession._id] && (
                                            <textarea
                                                placeholder="Répondre à cette confession..."
                                                rows="2"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleAddReply(confession._id, e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                                            />
                                        )}
                                    </>
                                ) : (
                                    renderReplies(confession.replies, confession._id)
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConfessionList;
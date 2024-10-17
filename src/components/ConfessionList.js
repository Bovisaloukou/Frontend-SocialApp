import React, { useState, useEffect } from 'react';

const ConfessionList = () => {
    const [confessions, setConfessions] = useState([]);
    const [newConfession, setNewConfession] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [replyInputs, setReplyInputs] = useState({}); // Pour stocker l'état d'affichage des réponses
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

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

    const handleAddReply = async (confessionId, replyContent, parentReplyId = null) => {
        if (replyContent.trim() === '') return;

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const endpoint = parentReplyId
                ? `${backendUrl}/api/confessions/${confessionId}/replies/${parentReplyId}` // Sous-réponse
                : `${backendUrl}/api/confessions/${confessionId}/replies`; // Réponse normale

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
        } catch (err) {
            setError(err.message);
        }
    };

    // Nouvelle fonction pour incrémenter les émojis
    const handleReaction = async (confessionId, emoji) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/confessions/${confessionId}/reactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emoji })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de la réaction.');
            }

            const updatedConfession = await response.json();
            setConfessions(confessions.map(confession =>
                confession._id === confessionId ? updatedConfession : confession
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    // Gérer l'affichage/masquage de l'input de réponse
    const toggleReplyInput = (confessionId) => {
        setReplyInputs(prev => ({
            ...prev,
            [confessionId]: !prev[confessionId] // Toggle l'affichage de l'input
        }));
    };

    const renderReplies = (replies, confessionId, parentReplyId = null) => {
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
                                {renderReplies(reply.replies, confessionId, reply._id)}
                            </div>
                        )}

                        {/* Lien pour répondre à cette réponse */}
                        <a
                            href="#!"
                            onClick={() => toggleReplyInput(reply._id)}
                            className="text-sm text-blue-500 hover:underline mt-2 block"
                        >
                            Répondre
                        </a>

                        {/* Formulaire pour répondre à cette réponse */}
                        {replyInputs[reply._id] && (
                            <textarea
                                placeholder="Répondre à cette réponse..."
                                rows="2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddReply(confessionId, e.target.value, reply._id);
                                        e.target.value = ''; // Réinitialiser après l'envoi
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
                        <p className="text-gray-800 mb-4">{confession.content}</p>

                        {/* Section des réactions avec plus d'émojis */}
                        <div className="flex space-x-4 text-gray-500">
                            <button onClick={() => handleReaction(confession._id, '😂')}>😂 {confession.reactions?.['😂'] || 0}</button>
                            <button onClick={() => handleReaction(confession._id, '❤️')}>❤️ {confession.reactions?.['❤️'] || 0}</button>
                            <button onClick={() => handleReaction(confession._id, '👍')}>👍 {confession.reactions?.['👍'] || 0}</button>
                            <button onClick={() => handleReaction(confession._id, '😮')}>😮 {confession.reactions?.['😮'] || 0}</button>
                        </div>

                        {/* Lien pour afficher l'input de réponse */}
                        <a
                            href="#!"
                            onClick={() => toggleReplyInput(confession._id)}
                            className="text-sm text-blue-500 hover:underline mt-4 block"
                        >
                            Répondre
                        </a>

                        {/* Input pour répondre à la confession */}
                        {replyInputs[confession._id] && (
                            <textarea
                                placeholder="Répondre à cette confession..."
                                rows="2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddReply(confession._id, e.target.value); // Pas de parentReplyId ici
                                        e.target.value = ''; // Réinitialiser après l'envoi
                                    }
                                }}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                            />
                        )}

                        {/* Affichage des réponses */}
                        <div className="mt-4 border-t pt-4">
                            <h4 className="text-lg font-semibold text-gray-600">Réponses :</h4>
                            {renderReplies(confession.replies, confession._id)}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConfessionList;

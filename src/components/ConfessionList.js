import React, { useState, useEffect } from 'react';

const ConfessionList = () => {
    const [confessions, setConfessions] = useState([]);
    const [newConfession, setNewConfession] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [replyInputs, setReplyInputs] = useState({}); // Gérer les champs de réponse
    const [showReplies, setShowReplies] = useState({}); // Gérer l'état de l'affichage des réponses
    const [replyToConfession, setReplyToConfession] = useState(null); // Gérer les réponses aux confessions
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

    const handleAddReply = async (confessionId, replyContent) => {
        if (replyContent.trim() === '') return;

        try {
            const response = await fetch(`${BACKEND_URL}/api/confessions/${confessionId}/replies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: replyContent })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création de la réponse.');
            }

            const updatedConfession = await response.json();

            // Mettre à jour la confession avec la nouvelle réponse
            setConfessions(confessions.map(confession =>
                confession._id === confessionId ? updatedConfession : confession
            ));
            setReplyToConfession(null); // Réinitialiser après l'envoi de la réponse
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleShowReplies = (confessionId) => {
        setShowReplies(prev => ({
            ...prev,
            [confessionId]: !prev[confessionId] // Toggle affichage des réponses
        }));
    };

    const toggleReplyInput = (confessionId) => {
        setReplyToConfession(confessionId); // Définir l'ID de la confession à laquelle on répond
    };

    const renderReplies = (replies = []) => {
        return (
            <ul className="space-y-2 mt-2">
                {replies.map((reply, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded-lg">
                        <p className="text-gray-700">{reply.content}</p>
                        <p className="text-sm text-gray-500">
                            <em>{new Date(reply.createdAt).toLocaleString()}</em>
                        </p>
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
                    style={{ wordWrap: 'break-word' }} // Fixe le débordement du texte
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

                        {/* Section des réactions */}
                        <div className="flex space-x-4 text-gray-500">
                            <button onClick={() => handleReaction(confession._id, '😂')} className="focus:outline-none">
                                😂 {confession.reactions?.['😂'] || 0}
                            </button>
                            <button onClick={() => handleReaction(confession._id, '❤️')} className="focus:outline-none">
                                ❤️ {confession.reactions?.['❤️'] || 0}
                            </button>
                            <button onClick={() => handleReaction(confession._id, '👍')} className="focus:outline-none">
                                👍 {confession.reactions?.['👍'] || 0}
                            </button>
                            <button onClick={() => handleReaction(confession._id, '😮')} className="focus:outline-none">
                                😮 {confession.reactions?.['😮'] || 0}
                            </button>
                        </div>

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
                                    <p className="text-gray-500">Aucune réponse pour le moment.</p>
                                ) : (
                                    renderReplies(confession.replies)
                                )}

                                {/* Lien "Répondre" pour chaque confession */}
                                <a
                                    href="#!"
                                    onClick={() => toggleReplyInput(confession._id)}
                                    className="text-sm text-blue-500 hover:underline mt-4 block"
                                >
                                    Répondre
                                </a>

                                {/* Afficher la zone de texte pour répondre à la confession */}
                                {replyToConfession === confession._id && (
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
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConfessionList;
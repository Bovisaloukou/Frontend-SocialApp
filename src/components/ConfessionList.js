import React, { useState, useEffect } from 'react';

const ConfessionList = () => {
    const [confessions, setConfessions] = useState([]);
    const [newConfession, setNewConfession] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [replyInputs, setReplyInputs] = useState({}); // Tracks input content per reply
    const [showReplies, setShowReplies] = useState({}); // Tracks visibility of replies
    const [inputVisibility, setInputVisibility] = useState({}); // Tracks input visibility for each confession or reply
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchConfessions = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/confessions`);
                if (!response.ok) throw new Error('Erreur lors de la récupération des confessions.');
                const data = await response.json();
                setConfessions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchConfessions();
    }, []);

    const handlePostConfession = async () => {
        if (!newConfession || newConfession.trim() === '') return;
    
        try {
            const response = await fetch(`${BACKEND_URL}/api/confessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newConfession })
            });
    
            if (!response.ok) throw new Error('Erreur lors de la création de la confession.');
    
            const data = await response.json();
            setConfessions([data, ...confessions]);  // Mettre à jour l'état immédiatement
            setNewConfession('');  // Réinitialiser le champ de saisie
        } catch (err) {
            setError(err.message);
        }
    };    

    const handleAddReply = async (confessionId, replyContent, parentReplyId = null) => {
        if (!replyContent || replyContent.trim() === '') return;
    
        try {
            const endpoint = parentReplyId
                ? `${BACKEND_URL}/api/confessions/${confessionId}/replies/${parentReplyId}`
                : `${BACKEND_URL}/api/confessions/${confessionId}/replies`;
    
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: replyContent })
            });
    
            if (!response.ok) throw new Error('Erreur lors de la création de la réponse.');
    
            const newReply = await response.json();
            
            // Mettre à jour l'état local des confessions avec la nouvelle réponse
            const updatedConfessions = confessions.map(confession => {
                if (confession._id === confessionId) {
                    return updateReplies(confession, parentReplyId, newReply);
                }
                return confession;
            });
    
            setConfessions(updatedConfessions);  // Mise à jour locale des confessions
    
            // Forcer l'affichage des réponses et du lien "Voir les réponses" après l'ajout
            setShowReplies(prev => ({
                ...prev,
                [confessionId]: true  // Assurer que la section des réponses est visible
            }));
    
            // Masquer l'input de réponse après l'envoi
            setInputVisibility(prev => ({
                ...prev,
                [parentReplyId || confessionId]: false
            }));
    
            // Réinitialiser le champ de réponse
            setReplyInputs(prev => ({
                ...prev,
                [parentReplyId || confessionId]: ''
            }));
    
        } catch (error) {
            setError(error.message);
        }
    };              

    const updateReplies = (confession, parentReplyId, newReply) => {
        const updatedReplies = confession.replies.map(reply => {
            if (reply._id === parentReplyId) {
                return {
                    ...reply,
                    replies: [...reply.replies, newReply]
                };
            } else if (reply.replies.length > 0) {
                return {
                    ...reply,
                    replies: updateReplies({ replies: reply.replies }, parentReplyId, newReply).replies
                };
            }
            return reply;
        });
        return { ...confession, replies: updatedReplies };
    };

    const toggleReplyInput = (replyId) => {
        setInputVisibility(prev => ({
            ...prev,
            [replyId]: !prev[replyId] // Toggle visibility of the input
        }));
    };

    const toggleShowReplies = (confessionId) => {
        setShowReplies(prev => ({
            ...prev,
            [confessionId]: !prev[confessionId] // Toggle visibility of replies
        }));
    };

    const renderReplies = (replies = [], confessionId) => (
        <ul className="space-y-2 mt-2">
            {replies.map((reply, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded-lg">
                    <p className="text-gray-700">{reply.content}</p>
                    <p className="text-sm text-gray-500"><em>{new Date(reply.createdAt).toLocaleString()}</em></p>
                    {reply.replies?.length > 0 && (
                        <div className="ml-4">
                            <a
                                href="#!"
                                onClick={() => toggleShowReplies(reply._id)}
                                className="text-sm text-blue-500 hover:underline mt-2 block"
                            >
                                {showReplies[reply._id] ? 'Masquer les réponses' : 'Voir les réponses'}
                            </a>
                            {showReplies[reply._id] && renderReplies(reply.replies, confessionId)}
                        </div>
                    )}
                    <a
                        href="#!"
                        onClick={() => toggleReplyInput(reply._id)}
                        className="text-sm text-blue-500 hover:underline mt-2 block"
                    >
                        Répondre
                    </a>
                    {inputVisibility[reply._id] && (
                        <div>
                            <textarea
                                placeholder="Répondre à cette réponse..."
                                rows="2"
                                value={replyInputs[reply._id] || ''} // Empty by default
                                onChange={(e) => setReplyInputs(prev => ({ ...prev, [reply._id]: e.target.value }))}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                            />
                            <button
                                onClick={() => handleAddReply(confessionId, replyInputs[reply._id], reply._id)}
                                className="mt-2 bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Envoyer
                            </button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    const renderConfessionRepliesOrMessage = (confession) => {
        return (
            <>
                {/* Le lien "Voir les réponses" doit toujours apparaître si la confession a au moins une réponse */}
                {confession.replies.length > 0 && (
                    <a
                        href="#!"
                        onClick={() => toggleShowReplies(confession._id)}
                        className="text-sm text-blue-500 hover:underline mt-2 block"
                    >
                        {showReplies[confession._id] ? 'Masquer les réponses' : 'Voir les réponses'}
                    </a>
                )}
    
                {/* Affiche les réponses si elles sont visibles */}
                {showReplies[confession._id] && renderReplies(confession.replies, confession._id)}
    
                {/* Toujours afficher le lien "Répondre" pour répondre directement à la confession */}
                <a
                    href="#!"
                    onClick={() => toggleReplyInput(confession._id)}
                    className="text-sm text-blue-500 hover:underline mt-2 block"
                >
                    Répondre
                </a>
    
                {/* Affiche l'input de réponse pour la confession */}
                {inputVisibility[confession._id] && (
                    <div>
                        <textarea
                            placeholder="Répondre à cette confession..."
                            rows="2"
                            value={replyInputs[confession._id] || ''}  // Empty by default
                            onChange={(e) => setReplyInputs(prev => ({ ...prev, [confession._id]: e.target.value }))}
                            className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                        />
                        <button
                            onClick={() => handleAddReply(confession._id, replyInputs[confession._id])}
                            className="mt-2 bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Envoyer
                        </button>
                    </div>
                )}
            </>
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
                        {renderConfessionRepliesOrMessage(confession)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConfessionList;
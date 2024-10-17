import React, { useState, useEffect } from 'react';

const ConfessionList = () => {
    const [confessions, setConfessions] = useState([]);
    const [newConfession, setNewConfession] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            setConfessions([data, ...confessions]);  // Ajouter la nouvelle confession au début
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
            setConfessions(confessions.map(confession => 
                confession._id === confessionId ? updatedConfession : confession
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Chargement des confessions...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Confessions Anonymes</h2>
            <textarea
                value={newConfession}
                onChange={(e) => setNewConfession(e.target.value)}
                placeholder="Partagez votre confession..."
                rows="3"
                style={{ width: '100%', padding: '10px' }}
            />
            <button onClick={handlePostConfession}>Poster</button>

            <ul>
                {confessions.map(confession => (
                    <li key={confession._id} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
                        <p>{confession.content}</p>
                        <div>
                            <span>😂 {confession.reactions?.get('😂') || 0}</span>
                            <span>❤️ {confession.reactions?.get('❤️') || 0}</span>
                        </div>

                        <div style={{ marginTop: '10px' }}>
                            <h4>Réponses :</h4>
                            <ul>
                                {confession.replies?.length > 0 ? (
                                    confession.replies.map((reply, index) => (
                                        <li key={index} style={{ marginBottom: '5px' }}>
                                            <p>{reply.content} - <em>{new Date(reply.createdAt).toLocaleString()}</em></p>
                                        </li>
                                    ))
                                ) : (
                                    <p>Aucune réponse pour cette confession.</p>
                                )}
                            </ul>
                        </div>

                        <textarea
                            placeholder="Répondre anonymement..."
                            rows="2"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddReply(confession._id, e.target.value);
                                    e.target.value = '';  // Réinitialiser après l'envoi
                                }
                            }}
                            style={{ width: '100%', padding: '10px', marginTop: '10px' }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConfessionList;

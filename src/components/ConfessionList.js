import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfessionList = () => {
    const [confessions, setConfessions] = useState([]);
    const [newConfession, setNewConfession] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState(null);
    const [replyInputs, setReplyInputs] = useState({});
    const [showReplies, setShowReplies] = useState({});
    const [inputVisibility, setInputVisibility] = useState({});
    const [posting, setPosting] = useState(false);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const limit = 10;
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);
 
    const fetchConfessions = async () => {
        if (!hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/confessions?page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des confessions.');
            const data = await response.json();
            setConfessions(prev => [...prev, ...data]);
            if (data.length < limit) setHasMore(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };    

    useEffect(() => {
        fetchConfessions();
    }, [page]);

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50 && !loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    const handlePostConfession = async () => {
        if (!newConfession || newConfession.trim() === '') return;
    
        setPosting(true);
        const formData = new FormData();
        formData.append('content', newConfession);
        if (selectedImage && selectedImage.file) {
            formData.append('image', selectedImage.file);
        }
    
        try {
            const response = await fetch(`${BACKEND_URL}/api/confessions`, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) throw new Error('Erreur lors de la création de la confession.');
    
            const newConfessionData = await response.json();
            const confessionWithReplies = { ...newConfessionData, replies: [] };
    
            setConfessions([confessionWithReplies, ...confessions]);  // Ajouter la confession
            setInputVisibility((prev) => ({ ...prev, [newConfessionData._id]: false }));  // Initialiser visibility
            setNewConfession('');
            setSelectedImage(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setPosting(false);
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
    
            await fetchConfessions();
            setInputVisibility(prev => ({ ...prev, [parentReplyId || confessionId]: false }));
            setReplyInputs(prev => ({ ...prev, [parentReplyId || confessionId]: '' }));
            setShowReplies(prev => ({ ...prev, [confessionId]: true }));
    
        } catch (error) {
            setError(error.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage({
                file: file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const toggleReplyInput = (confessionId) => {
        setInputVisibility((prev) => ({
            ...prev,
            [confessionId]: !prev[confessionId]  // Basculer l'état de visibilité
        }));
    };    

    const toggleShowReplies = (confessionId) => {
        setShowReplies(prev => ({ ...prev, [confessionId]: !prev[confessionId] }));
    };

    const renderReplies = (replies = [], confessionId) => (
        <ul className="space-y-2 mt-2">
            {replies.map((reply, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded-lg shadow-md">
                    <p className="text-gray-700">{reply.content}</p>
                    <p className="text-sm text-gray-500"><em>{new Date(reply.createdAt).toLocaleString()}</em></p>
                    {reply.replies?.length > 0 && (
                        <div className="ml-4">
                            <a href="#!" onClick={() => toggleShowReplies(reply._id)} className="text-sm text-blue-500 hover:underline mt-2 block">
                                {showReplies[reply._id] ? 'Masquer les réponses' : 'Voir les réponses'}
                            </a>
                            {showReplies[reply._id] && renderReplies(reply.replies, confessionId)}
                        </div>
                    )}
                    <a href="#!" onClick={() => toggleReplyInput(reply._id)} className="text-sm text-blue-500 hover:underline mt-2 block">
                        Répondre
                    </a>
                    {inputVisibility[reply._id] && (  // Afficher l'input si inputVisibility[reply._id] est vrai
                        <div>
                            <textarea
                                placeholder="Répondre à cette réponse..."
                                rows="2"
                                value={replyInputs[reply._id] || ''}
                                onChange={(e) => setReplyInputs(prev => ({ ...prev, [reply._id]: e.target.value }))}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                            />
                            <button onClick={() => handleAddReply(confessionId, replyInputs[reply._id], reply._id)} className="mt-2 bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                Envoyer
                            </button>
                        </div>
                    )}
                </li>
            ))}
            {replies.length === 0 && (
                <>
                    <a href="#!" onClick={() => toggleReplyInput(confessionId)} className="text-sm text-blue-500 hover:underline mt-2 block">
                        Répondre
                    </a>
                    {inputVisibility[confessionId] && (
                        <div>
                            <textarea
                                placeholder="Répondre à cette confession..."
                                rows="2"
                                value={replyInputs[confessionId] || ''}
                                onChange={(e) => setReplyInputs(prev => ({ ...prev, [confessionId]: e.target.value }))}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                            />
                            <button onClick={() => handleAddReply(confessionId, replyInputs[confessionId])} className="mt-2 bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                Envoyer
                            </button>
                        </div>
                    )}
                </>
            )}
        </ul>
    );        

    return (
        <div className="container mx-auto mt-8 p-4">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Confessions Anonymes</h2>

            <div className="mb-6 max-w-2xl mx-auto">
                <textarea
                    value={newConfession}
                    onChange={(e) => setNewConfession(e.target.value)}
                    placeholder="Partagez votre confession..."
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
                <div className="flex flex-col items-center">
                    <label htmlFor="image-upload" className="cursor-pointer mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Choisir une image
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    {selectedImage && (
                        <div className="mt-4">
                            <img src={selectedImage.preview} alt="Aperçu de la confession" className="max-h-64 w-auto rounded-lg shadow-lg" />
                        </div>
                    )}
                </div>
                <button onClick={handlePostConfession} className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" disabled={posting}>
                    {posting ? 'Envoi...' : 'Poster'}
                </button>
            </div>

            <ul className="space-y-6">
                {confessions.map(confession => (
                    <li key={confession._id} className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 max-w-2xl mx-auto">
                        <p className="text-gray-800 mb-4" style={{ wordWrap: 'break-word' }}>{confession.content}</p>
                        {confession.imageUrl && (
                            <img src={confession.imageUrl} alt="Confession" className="mb-4 max-h-64 w-auto mx-auto rounded-lg" />
                        )}
                        {renderReplies(confession.replies, confession._id)}
                    </li>
                ))}
                {loading && <p className="text-center text-gray-500">Chargement des confessions...</p>}
                {!hasMore && !loading && <p className="text-center text-gray-500">Toutes les confessions sont chargées.</p>}
            </ul>
        </div>
    );
};

export default ConfessionList;
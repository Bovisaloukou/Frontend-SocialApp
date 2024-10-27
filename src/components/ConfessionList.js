import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfessionList = () => {
    const [confessions, setConfessions] = useState([]);
    const [newConfession, setNewConfession] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState(null);
    const [replyInputs, setReplyInputs] = useState({}); // Tracks input content per reply
    const [showReplies, setShowReplies] = useState({}); // Tracks visibility of replies
    const [inputVisibility, setInputVisibility] = useState({}); // Tracks input visibility for each confession or reply
    const [posting, setPosting] = useState(false);  // Nouvel état pour le loader pendant l'envoi
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const limit = 10; // Nombre de confessions à charger par page
    const [hasMore, setHasMore] = useState(true); // Indique s'il reste plus de confessions à charger


    // useEffect pour vérifier l'authentification
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token)
        if (!token) {
            navigate('/login');  // Redirection vers la page de connexion si aucun token n'est trouvé
        }
    }, [navigate]);
 
    const fetchConfessions = async () => {
        if (!hasMore) return; // Arrête de charger s'il n'y a plus de confessions

        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/confessions?page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des confessions.');
            const data = await response.json();
    
            // Met à jour les confessions avec les nouvelles données
            setConfessions(prev => [...prev, ...data]);
            
            // Vérifie s'il reste des confessions à charger
            if (data.length < limit) {
                setHasMore(false); // Plus de données à charger
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };    
    

    useEffect(() => {
        fetchConfessions();
    }, [page]);

    // Fonction de gestion du scroll pour détecter le bas de la page
    const handleScroll = () => {
        if (
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50 &&
            !loading &&
            hasMore
        ) {
            setPage(prevPage => prevPage + 1);
        }
    };

    // Attache et détache l'événement scroll
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    const handlePostConfession = async () => {
        if (!newConfession || newConfession.trim() === '') return;
    
        setPosting(true);  // Activer le loader

        // Préparer FormData pour inclure le contenu de la confession et l'image
        const formData = new FormData();
        formData.append('content', newConfession);
        if (selectedImage && selectedImage.file) {
            formData.append('image', selectedImage.file); // Envoie le fichier réel
        }
    
        try {
            const response = await fetch(`${BACKEND_URL}/api/confessions`, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) throw new Error('Erreur lors de la création de la confession.');
    
            await fetchConfessions();  // Rafraîchir les confessions après l'ajout
            setNewConfession('');  // Réinitialiser l'input
            setSelectedImage(null); // Réinitialiser l'image après le post
        } catch (err) {
            setError(err.message);
        } finally {
            setPosting(false);  // Désactiver le loader après l'envoi
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
    
            await fetchConfessions();  // Rafraîchir les confessions après l'ajout
    
            // Masquer l'input et réinitialiser après envoi
            setInputVisibility(prev => ({
                ...prev,
                [parentReplyId || confessionId]: false
            }));
            setReplyInputs(prev => ({
                ...prev,
                [parentReplyId || confessionId]: ''
            }));
    
            // Forcer l'affichage des réponses après l'ajout
            setShowReplies(prev => ({
                ...prev,
                [confessionId]: true  // Ouvre les réponses pour voir la nouvelle réponse
            }));
    
        } catch (error) {
            setError(error.message);
        }
    };
    
    // Ajouter une fonction pour gérer l'aperçu de l'image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage({
                file: file, // Fichier réel pour l'envoi
                preview: URL.createObjectURL(file) // URL d’aperçu pour l'affichage
            });
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
                {/* Le lien "Voir les réponses" doit apparaître si une réponse existe */}
                {(confession.replies.length > 0 || showReplies[confession._id]) && (
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
    
                {/* Toujours afficher le lien "Répondre" */}
                <a
                    href="#!"
                    onClick={() => toggleReplyInput(confession._id)}
                    className="text-sm text-blue-500 hover:underline mt-2 block"
                >
                    Répondre
                </a>
    
                {/* Affiche l'input de réponse */}
                {inputVisibility[confession._id] && (
                    <div>
                        <textarea
                            placeholder="Répondre à cette confession..."
                            rows="2"
                            value={replyInputs[confession._id] || ''} 
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

            <div className="mb-6 max-w-2xl mx-auto">
                <textarea
                    value={newConfession}
                    onChange={(e) => setNewConfession(e.target.value)}
                    placeholder="Partagez votre confession..."
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
                <div className="flex flex-col items-center">
                    <label 
                        htmlFor="image-upload" 
                        className="cursor-pointer mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Choisir une image
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden" // Cache l'input de type file
                    />
                    
                    {/* Afficher un aperçu si une image est sélectionnée */}
                    {selectedImage && (
                        <div className="mt-4">
                            <img src={selectedImage.preview} alt="Aperçu de la confession" className="max-h-64 w-auto rounded-lg shadow-lg" />
                        </div>
                    )}
                </div>
                <button
                    onClick={handlePostConfession}
                    className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={posting}  // Désactiver le bouton pendant l'envoi
                    >
                    {posting ? 'Envoi...' : 'Poster'}
                </button>
            </div>

            <ul className="space-y-6">
                {confessions.map(confession => (
                    <li key={confession._id} className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 max-w-2xl mx-auto">
                        <p className="text-gray-800 mb-4" style={{ wordWrap: 'break-word' }}>{confession.content}</p>
                        {/* Affiche l'image si elle est présente */}
                        {confession.imageUrl && (
                            <img src={confession.imageUrl} alt="Confession" className="mb-4 max-h-64 w-auto mx-auto rounded-lg" />
                        )}
                        {renderConfessionRepliesOrMessage(confession)}
                    </li>
                ))}

            {loading && <p className="text-center text-gray-500">Chargement des confessions...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!hasMore && !loading && <p className="text-center text-gray-500">Toutes les confessions sont chargées.</p>}

            </ul>
        </div>
    );
};

export default ConfessionList;
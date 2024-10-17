// /src/components/CreateEvent.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Rediriger vers la page de connexion si non connecté
    }
  }, [navigate]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState([]); // Liste des utilisateurs invités
  const [users, setUsers] = useState([]); // Liste des utilisateurs disponibles

  // Fetch de la liste des utilisateurs
useEffect(() => {
    const fetchUsers = async () => {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/users/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Utilisateurs récupérés :', data); // Ajouter un log pour vérifier
        setUsers(data); // Assurez-vous que le backend retourne une liste d'utilisateurs
      } else {
        console.log('Erreur lors de la récupération des utilisateurs');
      }
    };
  
    fetchUsers();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      title, description, date, location, isPrivate, invitedUsers
  });  // Log pour vérifier les données avant l'envoi

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}/events/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ title, description, date, location, isPrivate, invitedUsers })
    });

    if (response.ok) {
      alert('Événement créé avec succès');
    } else {
      const errorData = await response.json();
      console.error('Erreur lors de la création de l\'événement:', errorData);
      alert('Erreur lors de la création de l\'événement');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Créer un événement</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre de l'événement"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        ></textarea>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Lieu"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="mr-2"
          />
          Événement privé ?
        </label>
        {/* Sélection des invités */}
        {isPrivate && (
          <div className="mb-4">
            <label className="block mb-2">Inviter des utilisateurs :</label>
            <select
              multiple
              value={invitedUsers}
              onChange={(e) => setInvitedUsers([...e.target.selectedOptions].map(option => option.value))}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700">
          Créer
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;

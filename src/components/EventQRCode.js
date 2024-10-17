// /src/components/EventQRCode.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EventQRCode = () => {
    const { id } = useParams();
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        const fetchQRCode = async () => {
            const token = localStorage.getItem('token');
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const response = await fetch(`${backendUrl}/events/${id}/qrcode`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setQrCodeUrl(data.qrcode);
            }
        };

        fetchQRCode();
    }, [id]);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-6">QR Code de l'événement</h2>
            <div className="flex justify-center items-center">
                {qrCodeUrl ? (
                    <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="w-64 h-64 object-contain shadow-lg"
                    />
                ) : (
                    <p className="text-lg text-gray-500">Chargement...</p>
                )}
            </div>
        </div>
    );
};

export default EventQRCode;

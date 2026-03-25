import { io } from 'socket.io-client';
import L from 'leaflet';

const HOST = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const socket = io(HOST);

export const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');

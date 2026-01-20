import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import AuthContext from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            // Setup socket connection
            // Note: In production, URL should be env variable or relative
            const newSocket = io('http://localhost:5000');

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log("Socket connected:", newSocket.id);
            });

            newSocket.on('notification', (notification) => {
                console.log("New notification:", notification);
                setNotifications(prev => [notification, ...prev]);
            });

            return () => newSocket.close();
        }
    }, [user]);

    const markAsRead = () => {
        setNotifications([]); // Clear for now
    };

    return (
        <SocketContext.Provider value={{ socket, notifications, markAsRead }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './auth.context';

const SocketContext = createContext();

export function useSocket() {
    return useContext(SocketContext);
}

/**
 * SocketProvider: tự động kết nối/ngắt kết nối socket dựa trên auth status
 * - serverUrl: optional, default to current origin
 */
export function SocketProvider({ children, serverUrl }) {
    // State
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const listenersRef = useRef(new Map());

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // Lấy token từ localStorage mỗi khi effect chạy
        const token = localStorage.getItem('actk');

        // Ngắt kết nối socket cũ nếu có
        if (socket) {
            // console.log('Disconnecting old socket...');
            socket.disconnect();
            setSocket(null);
            setIsConnected(false);
        }

        // Chỉ kết nối khi có token và user đã authenticated
        if (!token || !auth.isAuthenticated) {
            // console.log('No token or not authenticated, socket will not connect');
            return;
        }

        // console.log('Creating new socket connection with token:', token);

        const s = io(serverUrl || '/', {
            auth: { token: `Bearer ${token}` },
            autoConnect: true,
            extraHeaders: {
                authorization: `Bearer ${token}`,
            },
            transports: ['websocket', 'polling'], // Fallback transport
        });

        // Set State socket
        setSocket(s);

        // Lắng nghe socket event 'connect'
        s.on('connect', () => {
            // console.log('Socket connected:', s.id);
            setIsConnected(true);
        });

        // Lắng nghe socket event 'disconnect'
        s.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
        });

        // Lắng nghe socket event 'connect_error'
        s.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        // Handle socket event "message_created" với callback đã đăng ký
        // Forward important server events to registered listeners
        const handleMessageCreated = (payload) => {
            // console.log('handleMessageCreated, payload: ', payload);
            const cb = listenersRef.current.get('message_created');
            if (cb) cb(payload);
        };

        // Handle socket event "message_status_update" với callback đã đăng ký
        const handleMessageStatus = (payload) => {
            const cb = listenersRef.current.get('message_status_update');
            if (cb) cb(payload);
        };

        // Handle socket event "conversation_new_message" với callback đã đăng ký
        const handleConversationNew = (payload) => {
            const cb = listenersRef.current.get('conversation_new_message');
            if (cb) cb(payload);
        };

        // Handle socket event "presence" với callback đã đăng ký
        const handlePresence = (payload) => {
            const cb = listenersRef.current.get('presence');
            if (cb) cb(payload);
        };

        // Handle socket event "typing" với callback đã đăng ký
        const handleTyping = (payload) => {
            const cb = listenersRef.current.get('typing');
            if (cb) cb(payload);
        };

        s.on('message_created', handleMessageCreated);
        s.on('message_status_update', handleMessageStatus);
        s.on('conversation_new_message', handleConversationNew);
        s.on('presence', handlePresence);
        s.on('typing', handleTyping);

        return () => {
            console.log('Cleaning up socket...');
            s.off('message_created', handleMessageCreated);
            s.off('message_status_update', handleMessageStatus);
            s.off('conversation_new_message', handleConversationNew);
            s.off('presence', handlePresence);
            s.off('typing', handleTyping);
            s.disconnect();
            setSocket(null);
            setIsConnected(false);
        };
    }, [serverUrl, auth.isAuthenticated, auth.user?.userId]); // Depend on auth state

    // API exposed to children
    // Handle Join Conversation
    const joinConversation = async (conversationId) => {
        if (!socket || !isConnected) {
            // throw new Error('Socket not ready');
            console.log('Join Conversation Error: Socket not ready');
        }
        return new Promise((resolve, reject) => {
            socket.timeout(5000).emit('join_conversation', { conversationId }, (response) => {
                if (response?.error) {
                    reject(new Error(response.error));
                } else {
                    resolve(response);
                }
            });
        });
    };

    // Handle Leave Conversation
    const leaveConversation = async (conversationId) => {
        if (!socket || !isConnected) return;
        socket.emit('leave_conversation', { conversationId });
    };

    // Handle Send Message (Use Socket)
    /**
     * sendMessage via socket with ack callback
     * payload: { conversationId, content, type = "text", metadata = {} }
     */
    const sendMessage = (payload, ack) => {
        // return new Promise((resolve, reject) => {
        //     if (!socket || !isConnected) {
        //         return reject(new Error('Socket not connected'));
        //     }

        //     // socket.timeout(10000).emit('send_message', payload, (resp) => {
        //     //     if (!resp) return reject(new Error('No response from server'));
        //     //     if (resp.status === 'ok') return resolve(resp.message);
        //     //     return reject(new Error(resp.message || 'Send message error'));
        //     // });
        //     socket.emit('send_message', payload, ack);
        // });
        if (!socket || !isConnected) return;
        socket.emit('send_message', payload, ack);
    };

    // Handle emit socket event "message_ack"
    const acknowledgeMessage = (messageId, status) => {
        if (!socket || !isConnected) return;
        socket.emit('message_ack', { messageId, status });
    };

    // Handle emit socket event "typing"
    const sendTyping = (conversationId, isTyping) => {
        if (!socket || !isConnected) return;
        socket.emit('typing', { conversationId, isTyping });
    };

    // Handle đăng ký callback cho socket event
    const on = (eventName, cb) => {
        listenersRef.current.set(eventName, cb);
        return () => listenersRef.current.delete(eventName);
    };

    const value = {
        socket,
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage,
        acknowledgeMessage,
        sendTyping,
        on,
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

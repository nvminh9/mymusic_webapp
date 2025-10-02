import { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '~/context/auth.context';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3700';

export default function useSocket() {
    // State
    const [connected, setConnected] = useState(false);
    const [presence, setPresence] = useState({}); // { userId: onlineBool }

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const socketRef = useRef(null);
    const listenersRef = useRef(new Map());

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // Nếu chưa Auth thì return
        if (!auth?.user?.userId) return;

        const token = localStorage?.getItem('actk');
        const socket = io(SOCKET_URL, { auth: { token: `Bearer ${token}` }, transports: ['websocket', 'polling'] });

        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            console.log('socket connected', socket.id);
        });

        socket.on('disconnect', (reason) => {
            setConnected(false);
            console.log('socket disconnected', reason);
        });

        socket.on('presence', ({ userId, online }) => {
            setPresence((p) => ({ ...p, [userId]: online }));
        });

        // Các event liên quan đến nhắn tin
        socket.on('message_created', (payload) => {
            console.log('message_created', payload);
            // Khi có event message_created sẽ thực hiện gọi callback (handler) đã được đăng ký với payload truyền vào
            // const handlers = listenersRef.current.get('message_created') || [];
            const handler = listenersRef.current.get('message_created');
            console.log('handler: ', handler);
            if (handler) handler(payload);
            // handlers.forEach((h) => h(payload));
        });

        socket.on('message_status_update', (payload) => {
            // Khi có event message_status_update sẽ thực hiện gọi callback (handler) đã được đăng ký với payload truyền vào
            const handlers = listenersRef.current.get('message_status_update') || [];
            handlers.forEach((h) => h(payload));
        });

        socket.on('conversation_new_message', (payload) => {
            // Khi có event conversation_new_message sẽ thực hiện gọi callback (handler) đã được đăng ký với payload truyền vào
            const handlers = listenersRef.current.get('conversation_new_message') || [];
            handlers.forEach((h) => h(payload));
        });

        socket.on('typing', (payload) => {
            // Khi có event typing sẽ thực hiện gọi callback (handler) đã được đăng ký với payload truyền vào
            const handlers = listenersRef.current.get('typing') || [];
            handlers.forEach((h) => h(payload));
        });

        // Cleanup
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [auth?.user?.userId]);

    const emit = useCallback((event, payload, cb) => {
        socketRef.current?.emit(event, payload, cb);
    }, []);

    // Hàm đăng ký callback (handler)
    // const on = useCallback((event, handler) => {
    //     console.log('Đăng ký handler cho event: ', event);
    //     const arr = listenersRef.current.get(event) || [];
    //     arr.push(handler);
    //     listenersRef.current.set(event, arr);
    //     // return unsubscribe
    //     return () => {
    //         const updated = (listenersRef.current.get(event) || []).filter((h) => h !== handler);
    //         listenersRef.current.set(event, updated);
    //     };
    // }, []);
    const on = (event, handler) => {
        console.log('Đăng ký handler cho event: ', event);
        // const arr = listenersRef.current.get(event) || [];
        // arr.push(handler);
        // listenersRef.current.set(event, arr);
        listenersRef.current.set(event, handler);
        // return unsubscribe
        return () => {
            // const updated = (listenersRef.current.get(event) || []).filter((h) => h !== handler);
            // listenersRef.current.set(event, updated);
            listenersRef.current.delete(event);
        };
    };

    const joinConversation = useCallback((conversationId) => {
        socketRef.current?.emit('join_conversation', { conversationId });
    }, []);

    const leaveConversation = useCallback((conversationId) => {
        socketRef.current?.emit('leave_conversation', { conversationId });
    }, []);

    const sendMessageSocket = useCallback((payload, ack) => {
        // Add clientMessageId if not present
        if (!payload.metadata) payload.metadata = {};
        if (!payload.metadata.clientMessageId) payload.metadata.clientMessageId = uuidv4();
        socketRef.current?.emit('send_message', payload, ack);
        return payload.metadata.clientMessageId;
    }, []);

    const sendAck = useCallback((payload) => {
        socketRef.current?.emit('message_ack', payload);
    }, []);

    const sendTyping = useCallback((payload) => {
        socketRef.current?.emit('typing', payload);
    }, []);

    return {
        socket: socketRef.current,
        connected,
        presence,
        emit,
        on,
        joinConversation,
        leaveConversation,
        sendMessageSocket,
        sendAck,
        sendTyping,
    };
}

import { Outlet } from 'react-router-dom';
import ConversationsList from '../components/ConversationsList';
import { useContext, useEffect } from 'react';
import { AuthContext } from '~/context/auth.context';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '~/context/socket.context';
import { addNewMessage } from '~/helper/messagesCacheModify';

function MessagePage() {
    // State

    // Context
    const { auth } = useContext(AuthContext);

    // React Query
    const queryClient = useQueryClient();

    // useSocket
    const { socket, isConnected, on } = useSocket();

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        if (!socket || !isConnected) return;

        // Handle conversation new message
        const handleConversationNewMessage = (payload) => {
            const { conversationId, message } = payload;
            // console.log(conversationId, message);
            // Thêm tin nhắn mới vào cache messages của conversation đó
            // addNewMessage(queryClient, auth, conversationId, message);
        };

        // Đăng ký callback xử lý cho socket event
        const unsubConvNewMsg = on('conversation_new_message', handleConversationNewMessage); // Nhận tin nhắn mới của conversation

        return () => {
            unsubConvNewMsg?.();
        };
    }, [socket, on, queryClient]);

    return (
        <div className="messagePage">
            <h1 style={{ color: 'white', margin: '0' }}>MessagePage</h1>
            {/* Conversations List */}
            <ConversationsList />
            {/* Outlet */}
            <Outlet />
        </div>
    );
}

export default MessagePage;

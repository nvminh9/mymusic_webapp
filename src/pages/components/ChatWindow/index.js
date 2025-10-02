import React, { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '~/context/socket.context';

import { AuthContext } from '~/context/auth.context';
import MessageBubble from '../MessageBubble';
import MessageInput from '../MessageInput';
import { useChat } from '~/hooks/useChat';

export default function ChatWindow() {
    // State

    // Context
    const { auth } = useContext(AuthContext);

    // React Router
    const { conversationId } = useParams();

    // useSocket
    // const { socket, isConnected, joinConversation, leaveConversation, on, sendMessageSocket, sendAck, sendTyping } = useSocket();
    const { socket, isConnected, joinConversation, leaveConversation } = useSocket();

    // Custom Hooks
    // useChat
    const { messages, fetchNextPage, hasNextPage, isFetchingNextPage, send, sendTypingMessage, sendAckMessage } =
        useChat(conversationId);

    // Ref
    const endRef = useRef();

    // --- HANDLE FUNCTION ---
    // Handle joinConversation khi mới vào Chat Window
    useEffect(() => {
        if (!socket && !isConnected) {
            console.log('Socket chưa connect');
            return;
        }

        console.log('Join conversation: ', conversationId);
        joinConversation(conversationId);

        // cleanup
        return () => {
            console.log('Leave conversation: ', conversationId);
            leaveConversation(conversationId);
        };
    }, [conversationId, socket, joinConversation, leaveConversation]);
    // Handle khi có message mới
    useEffect(() => {
        // Auto-scroll to bottom on new messages
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages?.length]);
    // Handle gửi tin nhắn
    const handleSend = async ({ content, metadata }) => {
        //
        await send({ content, type: 'text', metadata });
    };
    // Handle khi người dùng nhập tin nhắn
    const handleTyping = ({ conversationId, isTyping }) => {
        //
        sendTypingMessage({ conversationId, isTyping });
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                <strong>Chat: {conversationId}</strong>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column' }}>
                {messages?.map((m) => (
                    <MessageBubble key={m.messageId} message={m} isOwn={m.senderId === auth?.user?.userId} />
                ))}
                <div ref={endRef} />
            </div>

            <MessageInput onSend={handleSend} onTyping={handleTyping} conversationId={conversationId} />
        </div>
    );
}

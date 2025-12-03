import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '~/context/socket.context';
import { AuthContext } from '~/context/auth.context';
import MessageBubble from '../MessageBubble';
import MessageInput from '../MessageInput';
import { useChat } from '~/hooks/useChat';
import { message } from 'antd';
import { CgChevronDown } from 'react-icons/cg';
import { VscChevronLeft } from 'react-icons/vsc';
import { IoChatbubbles, IoSyncSharp } from 'react-icons/io5';
import { useQueryClient } from '@tanstack/react-query';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import MessageList from '../MessageList';
import { EnvContext } from '~/context/env.context';
import { getTimeAgo } from '~/utils/dateFormatter';

export default function ChatWindow() {
    // State
    const [isActiveBtnScrollToBottom, setIsActiveBtnScrollToBottom] = useState(false);
    // const [lastMessageAuthUserSend, setLastMessageAuthUserSend] = useState();
    const [presenceText, setPresenceText] = useState();

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // React Router
    const { conversationId } = useParams();

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // useSocket
    const { socket, isConnected, joinConversation, leaveConversation, presence } = useSocket();

    // React Query
    // const queryClient = useQueryClient();

    // Custom Hooks
    // useChat
    const {
        messages,
        lastReadMessagesEachParticipant,
        conversationInfo,
        isLoading,
        // isFetched,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
        isRefetchError,
        send,
        sendTypingMessage,
        sendAckMessage,
        handleSendConversationRead,
        isTyping,
    } = useChat(conversationId);

    // Ref
    // const messagesListRef = useRef(null);
    // const loadMoreMessagesRef = useRef(null);
    // const endRef = useRef(null);

    // --- HANDLE FUNCTION ---
    // Handle khi mới vào ChatWindow (hoặc conversationId thay đổi)
    useEffect(() => {
        // Đổi title trang
        document.title = 'Chat | mymusic: Music from everyone';
        // Refetch
        // refetch();
    }, []);
    // Handle joinConversation khi mới vào Chat Window
    useEffect(() => {
        if (!socket && !isConnected) {
            console.log('Socket chưa connect');
            return;
        }
        joinConversation(conversationId);
        // cleanup
        return () => {
            // console.log('Leave conversation: ', conversationId);
            leaveConversation(conversationId);
        };
    }, [conversationId, socket, joinConversation, leaveConversation]);
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
    // Handle Presence
    useEffect(() => {
        // Check if user is online
        const isUserOnline = presence?.get(
            lastReadMessagesEachParticipant?.find((lastReadMessage) => lastReadMessage?.userId !== auth?.user?.userId)
                ?.userId,
        )?.online;
        setPresenceText(
            isUserOnline
                ? 'Đang hoạt động'
                : `${getTimeAgo(
                      presence?.get(
                          lastReadMessagesEachParticipant?.find(
                              (lastReadMessage) => lastReadMessage?.userId !== auth?.user?.userId,
                          )?.userId,
                      )?.offlineAt,
                  )}`,
        );
    }, [presence]);

    // Initial Loading...
    if (isLoading) {
        return (
            <>
                {/* Chat Window Header */}
                <div className="tabSwitchProfile">
                    <div
                        className="profileUserName"
                        style={{
                            gap: '10px',
                            background: 'transparent',
                            width: 'max-content',
                            height: '100%',
                            padding: '10px',
                        }}
                    >
                        {/* User Avatar */}
                        <img
                            style={{
                                height: '36px',
                                width: '36px',
                                outline: 'rgba(135, 135, 135, 0.15) solid 1px',
                                outlineOffset: '-1px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                cursor: 'pointer',
                            }}
                            src={conversationInfo?.avatar ? env?.backend_url + conversationInfo?.avatar : defaultAvatar}
                            onClick={() => {
                                if (!conversationInfo?.title) return;
                                navigate(`/profile/${conversationInfo?.title}`);
                            }}
                        />
                        {/* User Name */}
                        <span
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={(e) => {
                                e.target.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.textDecoration = 'unset';
                            }}
                            onClick={() => {
                                if (!conversationInfo?.title) return;
                                navigate(`/profile/${conversationInfo?.title}`);
                            }}
                        >
                            {conversationInfo?.title}
                        </span>
                    </div>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div>
                <div
                    style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // padding: '30px 0px',
                    }}
                >
                    <IoSyncSharp
                        className="loadingAnimation"
                        style={{ color: 'white', width: '20px', height: '20px' }}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            {/* Chat Window Header */}
            <div className="tabSwitchProfile">
                <div
                    className="profileUserName"
                    style={{
                        gap: '10px',
                        background: 'transparent',
                        width: 'max-content',
                        height: '100%',
                        padding: '10px',
                    }}
                >
                    {/* User Avatar */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                        }}
                    >
                        <img
                            style={{
                                height: '36px',
                                width: '36px',
                                outline: 'rgba(135, 135, 135, 0.15) solid 1px',
                                outlineOffset: '-1px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                cursor: 'pointer',
                            }}
                            src={conversationInfo?.avatar ? env?.backend_url + conversationInfo?.avatar : defaultAvatar}
                            onClick={() => {
                                if (!conversationInfo?.title) return;
                                navigate(`/profile/${conversationInfo?.title}`);
                            }}
                        />
                        {/* Presence Sign */}
                        <div
                            style={{
                                width: '13px',
                                height: '13px',
                                backgroundColor: presenceText === 'Đang hoạt động' ? '#2ecc71' : '#7f8c8d',
                                borderRadius: '50%',
                                border: '2px solid #121212',
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
                            }}
                        ></div>
                    </div>
                    {/* User Name and Presence */}
                    <div
                        className=""
                        style={{
                            display: 'grid',
                            justifyContent: 'left',
                        }}
                    >
                        {/* User Name */}
                        <span
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={(e) => {
                                e.target.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.textDecoration = 'unset';
                            }}
                            onClick={() => {
                                if (!conversationInfo?.title) return;
                                navigate(`/profile/${conversationInfo?.title}`);
                            }}
                        >
                            {conversationInfo?.title}
                        </span>
                        {/* Presence */}
                        {messages && lastReadMessagesEachParticipant && (
                            <span
                                style={{
                                    fontFamily: 'system-ui',
                                    fontSize: '12px',
                                    fontWeight: '400',
                                    color: '#777777',
                                }}
                            >
                                {presenceText}
                            </span>
                        )}
                    </div>
                </div>
                <div className="btnComeBackBox">
                    <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                        <VscChevronLeft />
                        <span class="tooltiptext">Quay lại</span>
                    </button>
                </div>
            </div>
            {/* Chat Window Main */}
            <div className="chatWindow">
                {/* Message List */}
                {messages && lastReadMessagesEachParticipant ? (
                    <MessageList
                        messages={messages}
                        lastReadMessagesEachParticipant={lastReadMessagesEachParticipant}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        isTyping={isTyping}
                        conversationId={conversationId}
                        handleSendConversationRead={handleSendConversationRead}
                    />
                ) : (
                    <>
                        <div
                            className=""
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: 'system-ui',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: '#ffffff',
                                }}
                            >
                                Không tìm thấy cuộc trò chuyện
                            </span>
                        </div>
                    </>
                )}
            </div>
            {/* Message Input */}
            {messages && lastReadMessagesEachParticipant && (
                <MessageInput onSend={handleSend} onTyping={handleTyping} conversationId={conversationId} />
            )}
        </>
    );
}

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

export default function ChatWindow() {
    // State
    const [isActiveBtnScrollToBottom, setIsActiveBtnScrollToBottom] = useState(false);
    // const [lastMessageAuthUserSend, setLastMessageAuthUserSend] = useState();

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // React Router
    const { conversationId } = useParams();

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // useSocket
    const { socket, isConnected, joinConversation, leaveConversation } = useSocket();

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
    // Handle Auto Load More Message (Intersection Observer loadMoreMessagesRef)
    // useEffect(() => {
    //     //
    //     if (!hasNextPage || isFetchingNextPage) return;

    //     // Messages List
    //     const messagesListElement = messagesListRef.current;
    //     let messagesListElementScrollTimeout;

    //     // Observer Load More Ref
    //     const observer = new IntersectionObserver(([entry]) => {
    //         if (entry.isIntersecting) {
    //             fetchNextPage();
    //             messagesListElement.scrollTop += 40;
    //             // messagesListElementScrollTimeout = setTimeout(() => {
    //             //     messagesListElement.scrollTop += 70;
    //             // }, 50);
    //         }
    //     });
    //     if (loadMoreMessagesRef.current) observer.observe(loadMoreMessagesRef.current);
    //     return () => {
    //         if (loadMoreMessagesRef.current) observer.disconnect();
    //         // clearTimeout(messagesListElementScrollTimeout);
    //     };
    // }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
    // Handle when reach bottom of messages list (newest message, Intersection Observer endRef)
    // useEffect(() => {
    //     // Observer endRef
    //     const endRefObserver = new IntersectionObserver(([entry]) => {
    //         if (entry.isIntersecting) {
    //             // endRef is intersected
    //             setIsActiveBtnScrollToBottom(false);
    //         }
    //     });
    //     if (endRef.current) endRefObserver.observe(endRef.current);
    //     return () => {
    //         if (endRef.current) endRefObserver.disconnect();
    //     };
    // }, []);
    // Handle khi lần đầu load data
    // useEffect(() => {
    //     // // Check messagesListRef
    //     const messagesListElement = messagesListRef.current;
    //     if (!messagesListElement) {
    //         return;
    //     }
    //     // Scroll xuống tin nhắn mới nhất khi lần đầu load messages (when initial load done)
    //     // let scrollToEndRefTimeout;
    //     // if (messagesListElement.scrollTop === 0 || messages.length <= 20) {
    //     //     // Small delay to ensure DOM updated
    //     //     requestAnimationFrame(() => {
    //     //         messagesListElement.scrollTop = messagesListElement.scrollHeight;
    //     //         scrollToEndRefTimeout = setTimeout(() => {
    //     //             endRef.current?.scrollIntoView({ behavior: 'smooth' });
    //     //         }, 80);
    //     //     });
    //     // }
    //     // //
    //     // return () => {
    //     //     clearTimeout(scrollToEndRefTimeout);
    //     // };
    // }, [isLoading]);
    // Handle khi có message mới (Khi messages đã được cập nhật và đã hiển thị ra UI, sau đó cần xử lý để scroll xuống cho hợp lý)
    // useEffect(() => {
    //     // Auto-scroll to bottom on new messages
    //     // endRef.current?.scrollIntoView({ behavior: 'smooth' });

    //     // Check messagesListRef
    //     const messagesListElement = messagesListRef.current;
    //     if (!messagesListElement) {
    //         return;
    //     }

    //     // Ở các lần sau khi có message mới thì có 2 trường hợp
    //     // Nếu người dùng đang đọc các tin nhắn cũ thì không tự scroll xuống...
    //     // ...mà có thể thông báo new message và có nút bấm để scroll xuống
    //     if (
    //         Math.floor(messagesListElement.scrollHeight - messagesListElement.offsetHeight) -
    //             Math.floor(messagesListElement.scrollTop) >
    //         100
    //     ) {
    //         // console.log('New message!');
    //         if (!(messagesListElement.scrollTop === 0) && messages.length > 20) {
    //             setIsActiveBtnScrollToBottom(true);
    //         }
    //     } else {
    //         // Nếu người dùng đang ở dưới cùng của Chat Window (đang chat) thì scroll xuống để hiện new message
    //         endRef.current?.scrollIntoView({ behavior: 'smooth' });
    //     }

    //     // Handle ACK Message: Gửi cập nhật trạng thái đã xem tin nhắn
    //     // (Tạm thời xử lý nếu người dùng đang joined conversation, thì khi có tin nhắn mới nó sẽ được tính là đã được xem)
    //     // (NÂNG CAO: Chỉ tính là đã xem khi người dùng ở dưới cùng của ChatWindow,...
    //     // ...còn đang scroll lên để đọc tin nhắn cũ sẽ không tính là đã xem)
    //     handleSendConversationRead(conversationId); // Hàm được gọi khi người dùng đang trong conversation và có tin nhắn mới đến làm thay đổi messages

    //     // Scroll xuống tin nhắn mới nhất khi lần đầu load messages (when initial load)
    //     // if (messagesListElement.scrollTop === 0 && messages.length <= 20) {
    //     //     // Small delay to ensure DOM updated
    //     //     requestAnimationFrame(() => {
    //     //         messagesListElement.scrollTop = messagesListElement.scrollHeight;
    //     //     });
    //     // }
    //     let scrollToEndRefTimeout;
    //     if (messagesListElement.scrollTop === 0) {
    //         // Small delay to ensure DOM updated
    //         requestAnimationFrame(() => {
    //             messagesListElement.scrollTop = messagesListElement.scrollHeight;
    //             scrollToEndRefTimeout = setTimeout(() => {
    //                 endRef.current?.scrollIntoView({ behavior: 'smooth' });
    //             }, 80);
    //         });
    //     }
    //     //
    //     return () => {
    //         clearTimeout(scrollToEndRefTimeout);
    //     };
    // }, [messages?.length]);
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
                {/* Message Input */}
                {messages && lastReadMessagesEachParticipant && (
                    <MessageInput onSend={handleSend} onTyping={handleTyping} conversationId={conversationId} />
                )}
            </div>
        </>
    );
}

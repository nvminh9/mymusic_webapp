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

export default function ChatWindow() {
    // State
    const [isActiveBtnScrollToBottom, setIsActiveBtnScrollToBottom] = useState(false);

    // Context
    const { auth } = useContext(AuthContext);

    // React Router
    const { conversationId } = useParams();

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // useSocket
    const { socket, isConnected, joinConversation, leaveConversation } = useSocket();

    // Custom Hooks
    // useChat
    const {
        messages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        send,
        sendTypingMessage,
        sendAckMessage,
        isTyping,
    } = useChat(conversationId);

    // Ref
    const messagesListRef = useRef(null);
    const endRef = useRef(null);
    const loadMoreMessagesRef = useRef(null);

    // --- HANDLE FUNCTION ---
    //
    useEffect(() => {
        // Đổi title trang
        document.title = 'Chat | mymusic: Music from everyone';
        // Scroll xuống cuối trang
        // endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);
    // Handle joinConversation khi mới vào Chat Window
    useEffect(() => {
        if (!socket && !isConnected) {
            console.log('Socket chưa connect');
            return;
        }

        // console.log('Join conversation: ', conversationId);
        joinConversation(conversationId);

        // cleanup
        return () => {
            // console.log('Leave conversation: ', conversationId);
            leaveConversation(conversationId);
        };
    }, [conversationId, socket, joinConversation, leaveConversation]);
    // Handle Auto Load More Message (Intersection Observer loadMoreMessagesRef)
    useEffect(() => {
        //
        if (!hasNextPage || isFetchingNextPage) return;

        // Messages List
        const messagesListElement = messagesListRef.current;
        let messagesListElementScrollTimeout;

        // Observer Load More Ref
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                fetchNextPage();
                messagesListElement.scrollTop += 30;
                messagesListElementScrollTimeout = setTimeout(() => {
                    messagesListElement.scrollTop += 70;
                }, 50);
            }
        });
        if (loadMoreMessagesRef.current) observer.observe(loadMoreMessagesRef.current);
        return () => {
            if (loadMoreMessagesRef.current) observer.disconnect();
            // clearTimeout(messagesListElementScrollTimeout);
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
    // Handle when reach bottom of messages list (newest message, Intersection Observer endRef)
    useEffect(() => {
        // Observer endRef
        const endRefObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                // endRef is intersected
                setIsActiveBtnScrollToBottom(false);
            }
        });
        if (endRef.current) endRefObserver.observe(endRef.current);
        return () => {
            if (endRef.current) endRefObserver.disconnect();
        };
    }, []);
    // Handle khi có message mới (Khi messages đã được cập nhật và đã hiển thị ra UI, sau đó cần xử lý để scroll xuống cho hợp lý)
    useEffect(() => {
        // Auto-scroll to bottom on new messages
        // endRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Check messagesListRef
        const messagesListElement = messagesListRef.current;
        if (!messagesListElement) {
            return;
        }

        // Ở các lần sau khi có message mới thì có 2 trường hợp
        // Nếu người dùng đang đọc các tin nhắn cũ thì không tự scroll xuống...
        // ...mà có thể thông báo new message và có nút bấm để scroll xuống
        if (
            Math.floor(messagesListElement.scrollHeight - messagesListElement.offsetHeight) -
                Math.floor(messagesListElement.scrollTop) >
            100
        ) {
            // console.log('New message!');
            if (!(messagesListElement.scrollTop === 0) && messages.length > 20) {
                setIsActiveBtnScrollToBottom(true);
            }
        } else {
            // Nếu người dùng đang ở dưới cùng của Chat Window (đang chat) thì scroll xuống để hiện new message
            endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }

        // Scroll xuống tin nhắn mới nhất khi lần đầu load messages (when initial load)
        if (messagesListElement.scrollTop === 0 && messages.length <= 20) {
            // Small delay to ensure DOM updated
            requestAnimationFrame(() => {
                messagesListElement.scrollTop = messagesListElement.scrollHeight;
            });
        }
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
        <>
            {/* Conversation Info */}
            <div className="tabSwitchProfile">
                <div className="profileUserName">
                    <span>Chat: {conversationId}</span>
                </div>
                <div className="btnComeBackBox">
                    <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                        <VscChevronLeft />
                        <span class="tooltiptext">Quay lại</span>
                    </button>
                </div>
            </div>
            <div
                className="chatWindow"
                // style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}
            >
                {/* Scroll Box */}
                <div
                    className="messagesList"
                    ref={messagesListRef}
                    // style={{
                    //     flex: 1,
                    //     overflow: 'auto',
                    //     padding: 12,
                    //     display: 'flex',
                    //     flexDirection: 'column',
                    //     position: 'relative',
                    // }}
                >
                    {/* Load More Ref */}
                    <div
                        ref={loadMoreMessagesRef}
                        // style={{ background: 'red', width: '100%' }}
                    ></div>
                    {/* Render Messages List */}
                    {messages && (
                        <>
                            {messages?.map((m, index, array) => (
                                <MessageBubble
                                    key={m.messageId}
                                    message={m}
                                    messages={array}
                                    isOwn={m.senderId === auth?.user?.userId}
                                    isPreviousSameSender={index > 0 ? array[index - 1].senderId === m.senderId : false}
                                    isForwardSameSender={
                                        index < array?.length - 1 ? array[index + 1].senderId === m.senderId : false
                                    }
                                />
                            ))}
                        </>
                    )}
                    {/* End Ref */}
                    <div ref={endRef} />
                </div>
                {/* Button Scroll To Bottom */}
                {(isActiveBtnScrollToBottom || isTyping?.isTyping) && (
                    <div className="btnScrollToBottom">
                        {/* Button Scroll to Bottom */}
                        {isActiveBtnScrollToBottom && (
                            <div className="btnContainer">
                                <button
                                    onClick={() => {
                                        endRef.current?.scrollIntoView({ behavior: 'smooth' });
                                        setIsActiveBtnScrollToBottom(false);
                                    }}
                                >
                                    {/* Tin nhắn mới <CgChevronDown /> */}
                                    <CgChevronDown />
                                </button>
                            </div>
                        )}
                        {/* Is Typing */}
                        {isTyping?.isTyping &&
                            isTyping?.conversationId === conversationId &&
                            isTyping?.userId !== auth?.user?.userId && (
                                <div className="btnContainer">
                                    <button
                                        onClick={() => {}}
                                        style={{
                                            width: '48px',
                                            padding: '10px 8px',
                                            backgroundColor: 'transparent',
                                            cursor: 'unset',
                                            transform: 'unset',
                                        }}
                                    >
                                        {/* Tin nhắn mới <CgChevronDown /> */}
                                        {/* <CgChevronDown /> */}
                                        <div class="dot-elastic"></div>
                                    </button>
                                </div>
                            )}
                    </div>
                )}
                {/* Message Input */}
                <MessageInput onSend={handleSend} onTyping={handleTyping} conversationId={conversationId} />
            </div>
        </>
    );
}

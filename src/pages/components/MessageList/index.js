import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import MessageBubble from '../MessageBubble';
import { IoChatbubbles, IoSyncSharp } from 'react-icons/io5';
import { CgChevronDown } from 'react-icons/cg';
import { AuthContext } from '~/context/auth.context';
import MessageStatus from '../MessageStatus';
import { useQueryClient } from '@tanstack/react-query';

function MessageList({
    messages,
    lastReadMessagesEachParticipant,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isTyping,
    conversationId,
    handleSendConversationRead,
}) {
    // State
    const [isActiveBtnScrollToBottom, setIsActiveBtnScrollToBottom] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(true);

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const messagesListRef = useRef(null);
    const loadMoreMessagesRef = useRef(null);
    const endRef = useRef(null);

    // --- HANDLE FUNCTION ---
    // Handle On Load
    useEffect(() => {
        const messagesListElement = messagesListRef.current;
        if (!messagesListElement) return;
        // Scroll to bottom on load
        messagesListElement.scrollTop = messagesListElement.scrollHeight;
    }, []);
    // Handle Auto Load More Message (Intersection Observer loadMoreMessagesRef)
    useEffect(() => {
        //
        if (!hasNextPage || isFetchingNextPage) return;

        // Messages List
        const messagesListElement = messagesListRef.current;
        if (!messagesListElement) return;

        // Observer loadMoreMessageRef
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                fetchNextPage();
                messagesListElement.scrollTop += 20;
                // messagesListElement.scrollTop += 10;
            }
        });
        if (loadMoreMessagesRef.current) observer.observe(loadMoreMessagesRef.current);

        // Disconnect observer if no more pages or is fetching
        if (!hasNextPage || isFetchingNextPage) {
            observer.disconnect();
        }

        // Cleanup
        return () => {
            if (loadMoreMessagesRef.current) observer.disconnect();
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
    // Handle when new message arrives
    useEffect(() => {
        // Check messagesListRef
        const messagesListElement = messagesListRef.current;
        if (!messagesListElement) return;

        // Auto scroll to bottom if isAtBottom
        if (isAtBottom) {
            // endRef.current?.scrollIntoView({ behavior: 'smooth' });
            endRef.current?.scrollIntoView();
        }

        // Handle ACK Message: Gửi cập nhật trạng thái đã xem tin nhắn
        // (Tạm thời xử lý nếu người dùng đang joined conversation, thì khi có tin nhắn mới nó sẽ được tính là đã được xem)
        // (NÂNG CAO: Chỉ tính là đã xem khi người dùng ở dưới cùng của ChatWindow,...
        // ...còn đang scroll lên để đọc tin nhắn cũ sẽ không tính là đã xem)
        // handleSendConversationRead(conversationId); // Hàm được gọi khi người dùng đang trong conversation và có tin nhắn mới đến làm thay đổi messages
        // Gửi cập nhật trạng thái đã xem tin nhắn qua socket
        console.log(
            `lastReadMessage: ${messages[messages.length - 1]?.messageId} - ${messages[messages.length - 1]?.content}`,
        );
        handleSendConversationRead({
            conversationId,
            lastReadMessageId: messages?.[messages?.length - 1] ? messages[messages.length - 1]?.messageId : null,
        });

        // Cleanup
        return () => {};
    }, [messages?.length]);
    // Handle when reach bottom of messages list (Intersection Observer endRef)
    useEffect(() => {
        // Observer endRef
        const endRefObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsAtBottom(true);
                setIsActiveBtnScrollToBottom(false);
                // Gửi cập nhật trạng thái đã xem tin nhắn qua socket
            } else {
                setIsAtBottom(false);
                setIsActiveBtnScrollToBottom(true);
            }
        });
        if (endRef.current) endRefObserver.observe(endRef.current);
        return () => {
            if (endRef.current) endRefObserver.disconnect();
        };
    }, []); // Tạm thời bỏ dependency messages?.length

    //
    return (
        <>
            <div className="messagesList" ref={messagesListRef}>
                {/* Load More Ref */}
                <div ref={loadMoreMessagesRef}>
                    {isFetchingNextPage ? (
                        <>
                            <div
                                style={{
                                    height: 'max-content',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '5px',
                                }}
                            >
                                <IoSyncSharp
                                    className="loadingAnimation"
                                    style={{ color: 'white', width: '17px', height: '17px' }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <span
                                style={{ display: 'block', height: '3px', width: '100%', background: 'transparent' }}
                            ></span>
                        </>
                    )}
                    {/* {!isFetchingNextPage && <span style={{ display: 'block', height: '1px' }}></span>} */}
                </div>
                {/* Render Messages List */}
                {messages?.length > 0 && (
                    <>
                        {messages?.map((m, index, array) => {
                            return (
                                <Fragment key={m.messageId}>
                                    {/* Message Bubble */}
                                    <MessageBubble
                                        message={m}
                                        isOwn={m.senderId === auth?.user?.userId}
                                        isPreviousSameSender={
                                            index > 0 ? array[index - 1].senderId === m.senderId : false
                                        }
                                        isForwardSameSender={
                                            index < array?.length - 1 ? array[index + 1].senderId === m.senderId : false
                                        }
                                    />
                                    {/* Message Status */}
                                    <MessageStatus
                                        message={m}
                                        lastReadMessagesEachParticipant={lastReadMessagesEachParticipant}
                                        isNewestMessageByAuthUser={
                                            index === array?.length - 1 && m.senderId === auth?.user?.userId
                                        }
                                    />
                                </Fragment>
                            );
                        })}
                    </>
                )}
                {/* Nếu chưa có tin nhắn nào */}
                {messages?.length === 0 && (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            className="newConversation"
                            style={{
                                width: '100%',
                                display: 'grid',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '15px',
                            }}
                        >
                            <div
                                className=""
                                style={{
                                    background: '#2e2e2e80',
                                    width: 'max-content',
                                    height: 'max-content',
                                    padding: '15px',
                                    borderRadius: '50%',
                                    margin: '0 auto',
                                }}
                            >
                                <IoChatbubbles style={{ fontSize: '75px', color: '#121212' }} />
                            </div>
                            <div className="">
                                <span
                                    style={{
                                        fontFamily: 'system-ui',
                                        fontSize: '22px',
                                        fontWeight: '700',
                                        color: '#ffffff',
                                        userSelect: 'none',
                                    }}
                                >
                                    Hãy bắt đầu cuộc trò chuyện
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {/* End Ref */}
                <div ref={endRef} />
            </div>
            {/* Button Scroll To Bottom and Typing Indicator */}
            {(isActiveBtnScrollToBottom || isTyping?.isTyping) && (
                <div className="btnScrollToBottom">
                    {isActiveBtnScrollToBottom && (
                        <div className="btnContainer">
                            <button
                                onClick={() => {
                                    endRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <CgChevronDown />
                            </button>
                        </div>
                    )}
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
                                    <div class="dot-elastic"></div>
                                </button>
                            </div>
                        )}
                </div>
            )}
        </>
    );
}

export default MessageList;

import React, { Fragment, useContext, useEffect, useState } from 'react';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { useChat } from '~/hooks/useChat';
import { useParams } from 'react-router-dom';

export default function MessageBubble({ message, index, messages, isOwn, isPreviousSameSender, isForwardSameSender }) {
    // State
    const [isLastMessageByAuthUser, setIsLastMessageByAuthUser] = useState();

    // Context
    const { auth } = useContext(AuthContext);

    // React Router
    // const { conversationId } = useParams();

    // Message Bubble Shape (Border Radius)
    const messageBubbleShape = {
        alignLeft:
            isPreviousSameSender === false && isForwardSameSender === true
                ? `20px 20px 20px 7px`
                : isPreviousSameSender === true && isForwardSameSender === false
                ? `7px 20px 20px 20px`
                : isPreviousSameSender === true && isForwardSameSender === true
                ? `7px 20px 20px 7px`
                : `20px 20px 20px 20px`,
        alignRight:
            isPreviousSameSender === false && isForwardSameSender === true
                ? `20px 20px 7px 20px`
                : isPreviousSameSender === true && isForwardSameSender === false
                ? `20px 7px 20px 20px`
                : isPreviousSameSender === true && isForwardSameSender === true
                ? `20px 7px 7px 20px`
                : `20px 7px 20px 20px`,
    };

    // --- HANDLE FUNCTION ---
    // Format thời gian tạo
    const timeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const seconds = Math.floor((now - past) / 1000);
        const intervals = [
            { label: 'năm', seconds: 31536000 },
            { label: 'tháng', seconds: 2592000 },
            { label: 'tuần', seconds: 604800 },
            { label: 'ngày', seconds: 86400 },
            { label: 'giờ', seconds: 3600 },
            { label: 'phút', seconds: 60 },
            { label: 'giây', seconds: 1 },
        ];
        // Nếu đã quá 30 phút thì return chi tiết
        if (seconds >= intervals[5].seconds * 30) {
            return formatTimestamp(timestamp);
        }
        for (let i = 0; i < intervals.length; i++) {
            const interval = Math.floor(seconds / intervals[i].seconds);
            if (interval >= 1) {
                return `${interval} ${intervals[i].label} trước`;
            }
        }
        return 'vừa xong';
    };
    // Format thời gian sang định dạng "dd/mm/yyyy HH:MM"
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day} Tháng ${month}, ${year} lúc ${hours}:${minutes}`;
    };
    //
    useEffect(() => {
        // Handle set is last message by auth user
        const reversedMessages = [...messages].reverse();
        const lastMessageByAuthUser = reversedMessages.find((m) => m.senderId === auth?.user?.userId);
        if (message?.messageId === lastMessageByAuthUser?.messageId) {
            setIsLastMessageByAuthUser(true);
        } else {
            setIsLastMessageByAuthUser(false);
        }
    }, [messages?.length]);

    return (
        <Fragment key={`msgBubbleFragment${message.messageId}`}>
            <div
                className="messageBubble"
                style={{
                    alignSelf: isOwn ? 'flex-end' : 'flex-start',
                    marginTop: !isPreviousSameSender ? '3px' : '',
                    marginBottom: !isForwardSameSender ? '3px' : '',
                }}
            >
                {/* Sender Info */}
                {!(message.senderId === auth?.user?.userId) && (
                    <div className="sender">
                        {/* Avatar */}
                        {isPreviousSameSender === true && isForwardSameSender === false ? (
                            <div className="avatar">
                                <img
                                    src={
                                        message.Sender
                                            ? process.env.REACT_APP_BACKEND_URL + message.Sender.userAvatar
                                            : process.env.REACT_APP_BACKEND_URL + message.sender.userAvatar
                                    }
                                />
                            </div>
                        ) : isPreviousSameSender === false && isForwardSameSender === false ? (
                            <div className="avatar">
                                <img
                                    src={
                                        message.Sender
                                            ? process.env.REACT_APP_BACKEND_URL + message.Sender.userAvatar
                                            : process.env.REACT_APP_BACKEND_URL + message.sender.userAvatar
                                    }
                                />
                            </div>
                        ) : (
                            <div className="avatar"></div>
                        )}
                    </div>
                )}
                {/* Content */}
                <div
                    className="messageContent"
                    style={{
                        color: isOwn ? '#000' : '#ffffff',
                        background: isOwn ? '#ffffff' : '#2e2e2e80',
                        borderRadius: isOwn ? messageBubbleShape.alignRight : messageBubbleShape.alignLeft,
                    }}
                >
                    {message.content}
                </div>
                {/* Created At */}
                <div className="createdAt" style={{ left: isOwn ? '' : '100%' }}>
                    {timeAgo(message.createdAt)}{' '}
                    {/* {message.optimistic ? '· sending...' : message.status === 'read' ? '· read' : ''} */}
                </div>
                {/* Ack */}
                <div className="ack">
                    {/* Đang gửi */}
                    {message.optimistic && 'Đang gửi...'}
                    {/* Đã gửi */}
                    {!message.optimistic &&
                        isOwn &&
                        isLastMessageByAuthUser &&
                        message?.seenBy?.length === 0 &&
                        'Đã gửi'}
                    {/* ... */}
                </div>
            </div>
            {/* Đã xem */}
            {isOwn && (isLastMessageByAuthUser || messages?.[index + 1]?.seenBy?.length === 0) && (
                <>
                    {message?.seenBy?.length > 0 ? (
                        <>
                            {message?.seenBy?.map((user) => (
                                <div
                                    key={`msgReadAt${message.messageId}`}
                                    className="readAt"
                                    style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start' }}
                                >
                                    <div className="avatarReadAt" style={{ marginBottom: '3px' }}>
                                        <img
                                            src={
                                                user?.User?.userAvatar
                                                    ? process.env.REACT_APP_BACKEND_URL + user?.User?.userAvatar
                                                    : defaultAvatar
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <></>
                    )}
                </>
            )}
        </Fragment>
    );
}

import React, { useContext } from 'react';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';

export default function MessageBubble({
    message,
    index,
    messages,
    isOwn,
    isPreviousSameSender,
    isForwardSameSender,
    lastMessageAuthUserSend,
}) {
    // State

    // Context
    const { auth } = useContext(AuthContext);

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

    return (
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
                {/* Optimistic Ack Sending */}
                {message.optimistic && 'Đang gửi...'}
                {/* Ack Status */}
                {/* Ack for DM (1:1) Conversation */}
                {message?.senderId === auth?.user?.userId &&
                    message?.Statuses?.length > 0 &&
                    message?.Statuses?.length === 2 &&
                    message.Statuses.map((status, index, array) => (
                        <>
                            {/* Đã gửi */}
                            {status?.userId === auth?.user?.userId &&
                                !(array[0]?.readAt !== null && array[1]?.readAt !== null) &&
                                status?.deliveredAt !== null && (
                                    <>
                                        <div className="readAt">Đã gửi</div>
                                    </>
                                )}
                            {/* Đã xem */}
                            {status?.userId !== auth?.user?.userId &&
                                status?.readAt !== null &&
                                lastMessageAuthUserSend?.messageId === status?.messageId && (
                                    <>
                                        <div className="readAt">
                                            <div className="avatarReadAt">
                                                <img
                                                    src={
                                                        status?.User?.userAvatar
                                                            ? process.env.REACT_APP_BACKEND_URL +
                                                              status?.User?.userAvatar
                                                            : defaultAvatar
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                        </>
                    ))}
                {/* Ack for Group Conversation */}
                {/* ... */}
            </div>
        </div>
    );
}

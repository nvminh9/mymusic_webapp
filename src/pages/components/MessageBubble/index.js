import React, { Fragment, useContext, useEffect, useState } from 'react';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { useChat } from '~/hooks/useChat';
import { useParams } from 'react-router-dom';
import { formatMessageTime } from '~/utils/dateFormatter';

export default function MessageBubble({ message, isOwn, isPreviousSameSender, isForwardSameSender }) {
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
    // useEffect(() => {
    //     // Handle set is last message by auth user
    //     const reversedMessages = [...messages].reverse();
    //     const lastMessageByAuthUser = reversedMessages.find((m) => m.senderId === auth?.user?.userId);
    //     if (message?.messageId === lastMessageByAuthUser?.messageId) {
    //         setIsLastMessageByAuthUser(true);
    //     } else {
    //         setIsLastMessageByAuthUser(false);
    //     }
    // }, [messages?.length]);

    return (
        <Fragment key={`msgBubbleFragment${message.messageId}`}>
            {/* Message Bubble */}
            <div
                className="messageBubble"
                style={{
                    alignSelf: isOwn ? 'flex-end' : 'flex-start',
                    marginTop: !isPreviousSameSender ? '3px' : '',
                    marginBottom: !isForwardSameSender ? '3px' : '',
                }}
            >
                {/* Sender Info */}
                {!isOwn && (
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
                    {formatMessageTime(message.createdAt)}{' '}
                    {/* {message.optimistic ? '· sending...' : message.status === 'read' ? '· read' : ''} */}
                </div>
                {/* Ack */}
                <div className="ack">
                    {/* Đang gửi */}
                    {message.optimistic && 'Đang gửi...'}
                    {/* Đã gửi */}
                    {/* {isLastMessageByAuthUser && (
                        <>
                            {!message.optimistic &&
                                isOwn &&
                                !!!lastReadMessagesEachParticipant?.find(
                                    (lastReadMessage) => lastReadMessage?.lastReadMessageId === message?.messageId,
                                ) &&
                                `Đã gửi`}
                        </>
                    )} */}
                </div>
            </div>
            {/* Đã xem */}
            {/* {isLastMessageByAuthUser && (
                <>
                    {isOwn &&
                    !!lastReadMessagesEachParticipant?.find(
                        (lastReadMessage) => lastReadMessage?.lastReadMessageId === message?.messageId,
                    ) ? (
                        <>
                            {lastReadMessagesEachParticipant
                                ?.filter((lastReadMessage) => lastReadMessage?.userId !== message?.senderId)
                                ?.map((lastReadMessage) => (
                                    <div
                                        key={`msgReadAt${message.messageId}`}
                                        className="readAt"
                                        style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start' }}
                                    >
                                        <div className="avatarReadAt" style={{ marginBottom: '3px' }}>
                                            <img
                                                src={
                                                    lastReadMessage?.User?.userAvatar
                                                        ? process.env.REACT_APP_BACKEND_URL +
                                                          lastReadMessage?.User?.userAvatar
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
            )} */}
        </Fragment>
    );
}

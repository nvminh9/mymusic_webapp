import { useContext, useState } from 'react';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';

function MessageStatus({ message, lastReadMessagesEachParticipant, isNewestMessageByAuthUser }) {
    // State

    // Context
    const { auth } = useContext(AuthContext);

    return (
        <>
            <div className="messageStatus">
                {/* Render Đã gửi */}
                {isNewestMessageByAuthUser &&
                    !message.optimistic &&
                    !!!lastReadMessagesEachParticipant?.find((i) => i.lastReadMessageId === message.messageId) && (
                        <span>Đã gửi</span>
                    )}
                {/* Render Đã xem */}
                {lastReadMessagesEachParticipant?.map((i) => {
                    if (i.userId !== auth?.user?.userId && i.lastReadMessageId === message.messageId) {
                        return (
                            <div key={`msgReadAt${message.messageId}`} className="readAt">
                                <div className="avatarReadAt">
                                    <img
                                        src={
                                            i?.User?.userAvatar
                                                ? process.env.REACT_APP_BACKEND_URL + i?.User?.userAvatar
                                                : defaultAvatar
                                        }
                                    />
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </>
    );
}

export default MessageStatus;

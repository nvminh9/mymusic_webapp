import { useContext, useState } from 'react';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { EnvContext } from '~/context/env.context';

function MessageStatus({ message, lastReadMessagesEachParticipant, isNewestMessageByAuthUser }) {
    // State

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    return (
        <>
            <div className="messageStatus">
                {/* Render Đã gửi */}
                {isNewestMessageByAuthUser &&
                    !message.optimistic &&
                    !!!lastReadMessagesEachParticipant?.find(
                        (i) => i.userId !== auth?.user?.userId && i.lastReadMessageId === message.messageId,
                    ) && <span>Đã gửi</span>}
                {/* Render Đã xem */}
                {lastReadMessagesEachParticipant?.map((i) => {
                    if (i.userId !== auth?.user?.userId && i.lastReadMessageId === message.messageId) {
                        return (
                            <div key={`msgReadAt${message.messageId}`} className="readAt">
                                <div className="avatarReadAt">
                                    <img
                                        src={
                                            i?.User?.userAvatar ? env?.backend_url + i?.User?.userAvatar : defaultAvatar
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

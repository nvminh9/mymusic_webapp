import { useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '~/context/auth.context';

function UnseenConversationCount() {
    // State

    // Context
    const { auth } = useContext(AuthContext);

    // React Query
    const queryClient = useQueryClient();
    // Conversation List Data
    const conversationList = queryClient.getQueryData(['conversationList']);
    const unseenConversationCount =
        conversationList
            ?.map((conversation) => {
                if (
                    !!conversation?.unseenMessages?.find(
                        (message) => message.messageId === conversation?.newestMessage?.[0]?.messageId,
                    ) &&
                    conversation?.newestMessage?.[0]?.senderId !== auth?.user?.userId
                ) {
                    return conversation;
                } else {
                    return null;
                }
            })
            ?.filter(Boolean)?.length || 0;

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // console.log(conversationList);
    }, [conversationList, unseenConversationCount]);

    return (
        <>
            {unseenConversationCount === 0 ? (
                <></>
            ) : (
                <span className="unseenMessagesCount">{unseenConversationCount}</span>
            )}
        </>
    );
}

export default UnseenConversationCount;

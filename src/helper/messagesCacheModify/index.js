/**
 * Thêm tin nhắn mới vào cache
 * - Nếu có tin nhắn optimistic với cùng clientMessageId thì thay thế nó.
 * - Ngược lại thì thêm vào nếu không trùng lặp.
 */
export const addNewMessage = (
    queryClient,
    auth,
    conversationId,
    message,
    conversationInfo,
    lastReadMessagesEachParticipant,
) => {
    // console.log('THẰNG addNewMessage ĐƯỢC GỌI');
    // Thực hiện cập nhật cache
    queryClient.setQueryData(['messages', conversationId], (old) => {
        // If no cached pages yet, create initial page
        // Nếu chưa có tin nhắn nào
        if (!old) {
            // const result = { pages: old?.pages, pageParams: [] };
            // result.pages?.forEach((page) => {
            //     if (page?.conversation?.conversationId === conversationId) {
            //         page.messages = [message];
            //     }
            // });
            // return result;
            return {
                pages: [
                    {
                        messages: [message],
                        conversation: conversationInfo,
                        lastReadMessagesEachParticipant: lastReadMessagesEachParticipant,
                        nextCursor: null,
                    },
                ],
                pageParams: [],
            };
        }
        // Deep clone pages to avoid mutating cached object
        const pages = JSON.parse(JSON.stringify(old.pages || []));
        // Check duplicate: if any messageId or clientMessageId equal -> skip/replace
        let replaced = false;
        for (let pi = 0; pi < pages.length; pi++) {
            for (let mi = 0; mi < pages[pi].messages.length; mi++) {
                const m = pages[pi].messages[mi];
                // match by clientMessageId if optimistic, or by messageId
                const mClientId = m?.metadata?.clientMessageId;
                const sClientId = message?.metadata?.clientMessageId;
                // Replace Optimistic Message
                if (m.optimistic && sClientId && mClientId === sClientId && m.senderId === auth?.user?.userId) {
                    // replace optimistic with server message
                    pages[pi].messages[mi] = message;
                    replaced = true;
                    break;
                }
                // Check if message already replaced (prevent duplicate)
                if (m.messageId === message.messageId && m.senderId === auth?.user?.userId) {
                    replaced = true; // already present
                    break;
                }
            }
            if (replaced) break;
        }
        // console.log('Thay thế');

        if (!replaced) {
            // console.log('Thêm mới');
            // Append to last page (assuming pages in chronological order oldest->newest)
            if (pages.length === 0) {
                pages.push({
                    messages: [message],
                    conversation: conversationInfo,
                    lastReadMessagesEachParticipant: lastReadMessagesEachParticipant,
                    nextCursor: null,
                });
            } else {
                // Unshift message vào page đầu tiên
                pages[0].messages.unshift(message);
            }
        }

        return { ...old, pages };
    });
};

/**
 * Thêm tin nhắn optimistic vào cache
 */
export const addOptimisticMessage = (
    queryClient,
    conversationId,
    tempMessage,
    conversationInfo,
    lastReadMessagesEachParticipant,
) => {
    // console.log('THẰNG addOptimisticMessage ĐƯỢC GỌI');
    // Thực hiện cập nhật cache
    queryClient.setQueryData(['messages', conversationId], (old) => {
        if (!old) {
            return {
                pages: [
                    {
                        messages: [tempMessage],
                        conversation: conversationInfo,
                        lastReadMessagesEachParticipant: lastReadMessagesEachParticipant,
                        nextCursor: null,
                    },
                ],
                pageParams: [],
            };
        }
        // Deep clone pages to avoid mutating cached object
        const pages = JSON.parse(JSON.stringify(old.pages || []));
        if (pages.length === 0) {
            pages.push({
                messages: [tempMessage],
                conversation: conversationInfo,
                lastReadMessagesEachParticipant: lastReadMessagesEachParticipant,
                nextCursor: null,
            });
        } else {
            // Unshift message vào page đầu tiên
            pages[0].messages.unshift(tempMessage);
        }
        return { ...old, pages };
    });
};

/**
 * Cập nhật tin nhắn optimistic trong cache nếu ack (callback) của "send_message" trả về { status: "error", ... }
 * (Chưa dùng đến)
 */
export const markOptimisticMessageFailed = (queryClient, conversationId, clientMessageId, tempMessage) => {
    // Set optimistic message status = failed
    queryClient.setQueryData(['messages', conversationId], (old) => {
        // if (!old) return old;
        // Nếu chưa có tin nhắn nào
        if (!old) {
            return { pages: [{ messages: [{ ...tempMessage, status: 'failed' }], nextCursor: null }], pageParams: [] };
        }
        const pages = old.pages.map((p) => {
            p.messages = p.messages.map((m) => {
                if (m.optimistic && m.metadata?.clientMessageId === clientMessageId) {
                    m.status = 'failed';
                }
                return m;
            });
            return p;
        });

        return { ...old, pages };
    });
};

/**
 * Cập nhật tin nhắn optimistic trong cache nếu ack (callback) của "send_message" trả về { status: "error", ... } hoặc timeout
 * (Chưa dùng đến)
 */
export const handleOptimisticMessageTimeoutOrError = (queryClient, conversationId, clientMessageId, tempMessage) => {};

/**
 * Xóa tin nhắn khỏi cache
 * (Chưa dùng đến)
 */
export const removeMessage = (queryClient, auth, conversationId, messageId) => {};

/**
 * Cập nhật trạng thái tin nhắn trong cache khi bấm xem conversation, xem message.
 * Payload: { userId, conversationId, readAt, deliveredAt, User }
 */
export const updateMessageStatus = (queryClient, auth, payload) => {
    // Dữ liệu nhận được
    const { conversationId, lastReadMessageId, readAt, userId } = payload;
    // Update messages cache
    queryClient.setQueryData(['messages', conversationId], (old) => {
        // Nếu chưa có tin nhắn nào
        if (!old) return old;
        // if (!old) {
        //     return { pages: [{ messages: [{ ...tempMessage, status: 'failed' }], nextCursor: null }], pageParams: [] };
        // }
        const pages = old.pages.map((p) => {
            p.lastReadMessagesEachParticipant = p.lastReadMessagesEachParticipant.map((lrm) => {
                if (lrm.userId === userId) {
                    return {
                        ...lrm,
                        lastReadMessageId: lastReadMessageId,
                    };
                }
                return lrm;
            });
            return p;
        });

        return { ...old, pages };
    });
    // Update conversationList cache
    queryClient.setQueryData(['conversationList'], (oldConvList) => {
        // Nếu chưa có danh sách cuộc trò chuyện
        if (!oldConvList) return oldConvList;

        const newConvList = oldConvList.map((conv) => {
            if (conv.conversationId === conversationId) {
                return {
                    ...conv,
                    unseenMessages: [],
                };
            }
            return conv;
        });
        return newConvList;
    });
};

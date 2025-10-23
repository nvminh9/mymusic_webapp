/**
 * Thêm tin nhắn mới vào cache
 * - Nếu có tin nhắn optimistic với cùng clientMessageId thì thay thế nó.
 * - Ngược lại thì thêm vào nếu không trùng lặp.
 */
export const addNewMessage = (queryClient, auth, conversationId, message) => {
    // Thực hiện cập nhật cache
    queryClient.setQueryData(['messages', conversationId], (old) => {
        // If no cached pages yet, create initial page
        // Nếu chưa có tin nhắn nào
        if (!old) {
            return { pages: [{ messages: [message], nextCursor: null }], pageParams: [] };
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
                if (m.optimistic && sClientId && mClientId === sClientId && m.senderId === auth?.user?.userId) {
                    // replace optimistic with server message
                    pages[pi].messages[mi] = message;
                    replaced = true;
                    break;
                }
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
                pages.push({ messages: [message], nextCursor: null });
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
export const addOptimisticMessage = (queryClient, conversationId, tempMessage) => {
    // Thực hiện cập nhật cache
    queryClient.setQueryData(['messages', conversationId], (old) => {
        if (!old) {
            return { pages: [{ messages: [tempMessage], nextCursor: null }], pageParams: [] };
        }
        // Deep clone pages to avoid mutating cached object
        const pages = JSON.parse(JSON.stringify(old.pages || []));
        if (pages.length === 0) {
            pages.push({ messages: [tempMessage], nextCursor: null });
        } else {
            // Unshift message vào page đầu tiên
            pages[0].messages.unshift(tempMessage);
        }
        return { ...old, pages };
    });
};

/**
 * Cập nhật tin nhắn optimistic trong cache nếu ack (callback) của "send_message" trả về { status: "error", ... }
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
 */
export const handleOptimisticMessageTimeoutOrError = (queryClient, conversationId, clientMessageId, tempMessage) => {};

/**
 * Xóa tin nhắn khỏi cache
 */
export const removeMessage = (queryClient, auth, conversationId, messageId) => {};

/**
 * Cập nhật trạng thái tin nhắn trong cache khi bấm xem conversation, xem message
 * payload: { userId, conversationId, readAt, deliveredAt, User }
 */
export const updateMessageStatus = (queryClient, auth, payload) => {
    // Dữ liệu nhận được
    const { userId, conversationId, readAt, deliveredAt, User } = payload;
    // Update message status
    queryClient.setQueryData(['messages', conversationId], (old) => {
        // Nếu chưa có tin nhắn nào
        if (!old) return old;
        // if (!old) {
        //     return { pages: [{ messages: [{ ...tempMessage, status: 'failed' }], nextCursor: null }], pageParams: [] };
        // }
        const pages = old.pages.map((p) => {
            p.messages = p.messages.map((m) => {
                // Nếu người xem chưa có trong seenBy của message
                if (!m?.seenBy?.find((item) => item.userId === userId)) {
                    m.seenBy = [
                        ...m.seenBy,
                        {
                            messageId: m.messageId,
                            userId: userId,
                            conversationId: conversationId,
                            deliveredAt: deliveredAt,
                            readAt: readAt,
                            User: User,
                        },
                    ];
                    return m;
                }
                return m;
            });
            return p;
        });

        return { ...old, pages };
    });
};

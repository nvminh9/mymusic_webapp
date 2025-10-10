import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getMessagesApi } from '~/utils/api'; // still used for initial/history fetch
import { v4 as uuidv4 } from 'uuid';
import { useContext, useEffect } from 'react';

import { AuthContext } from '~/context/auth.context';
import { useSocket } from '~/context/socket.context';

/**
 * useChat
 * @param {string} conversationId
 */
export function useChat(conversationId) {
    // State

    // Context
    const { auth } = useContext(AuthContext);

    // React Query (Tanstack)
    const queryClient = useQueryClient();

    // Get Messages
    const messagesInfiniteQuery = useInfiniteQuery({
        queryKey: ['messages', conversationId],
        queryFn: async ({ pageParam = null }) => {
            const res = await getMessagesApi(conversationId, pageParam, 20);
            return res; // { messages, nextCursor }
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        enabled: !!conversationId,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60, // 1 minute
    });

    // useSocket
    const { socket, isConnected, on, sendMessage, acknowledgeMessage, sendTyping } = useSocket();

    // Flatten pages -> messages array (oldest -> newest)
    const messages = (messagesInfiniteQuery.data?.pages || []).flatMap((p) => p.messages || []).reverse();
    // console.log(messages);

    // --- HANDLE FUNCTION ---
    // Handler: on message_created (from server broadcast)
    // Hanlde listen socket events
    useEffect(() => {
        if (!conversationId || !socket || !isConnected) return;

        // Handle message created
        // When server broadcasts a message_created, we must:
        // - if there is an optimistic message with same clientMessageId -> replace it
        // - otherwise append if not duplicate
        const handleMessageCreated = ({ message }) => {
            // console.log('Handle message created: ', message);
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

        // Handle message status update
        const handleStatusUpdate = (payload) => {
            const { messageId, userId, status, at } = payload;
            queryClient.setQueryData(['messages', conversationId], (old) => {
                if (!old) return old;
                const pages = old.pages.map((p) => {
                    p.messages = p.messages.map((m) => {
                        if (
                            m.messageId === messageId ||
                            (m.optimistic && m.metadata?.clientMessageId === payload.clientMessageId)
                        ) {
                            m.statuses = m.statuses || {};
                            m.statuses[userId] = { status, at };
                        }
                        return m;
                    });
                    return p;
                });
                return { ...old, pages };
            });
        };

        // Register using on() which returns unsubscribe functions
        const unsubMsg = on('message_created', handleMessageCreated);
        const unsubStatus = on('message_status_update', handleStatusUpdate);

        return () => {
            unsubMsg?.();
            unsubStatus?.();
        };
    }, [conversationId, socket, on, queryClient]);

    /**
     * send: use socket for sending.
     * Behavior:
     *  - create optimistic message locally
     *  - call sendMessage(payload, ack) where ack is server callback
     *  - if ack returns success with server message -> replace optimistic with server message
     *  - if ack returns error or timeout -> mark optimistic message as failed (you can allow retry UI)
     */
    const send = async ({ content, type = 'text', metadata = {} }) => {
        if (!socket || !isConnected || !conversationId) throw new Error('No socket or conversationId');

        // Ensure metadata has clientMessageId (idempotency)
        if (!metadata.clientMessageId) metadata.clientMessageId = uuidv4();

        const clientMessageId = metadata.clientMessageId;

        // Build optimistic message
        const tempMessage = {
            messageId: clientMessageId, // temporary id
            conversationId,
            senderId: auth?.user?.userId,
            content,
            type,
            metadata,
            createdAt: new Date().toISOString(),
            optimistic: true,
            status: 'sending',
        };

        // Optimistically insert into cache at the end
        queryClient.setQueryData(['messages', conversationId], (old) => {
            if (!old) {
                return { pages: [{ messages: [tempMessage], nextCursor: null }], pageParams: [] };
            }
            const pages = JSON.parse(JSON.stringify(old.pages || []));
            if (pages.length === 0) {
                pages.push({ messages: [tempMessage], nextCursor: null });
            } else {
                // Unshift message vào page đầu tiên
                pages[0].messages.unshift(tempMessage);
            }
            return { ...old, pages };
        });

        // Send via socket with ack callback
        return new Promise((resolve, reject) => {
            try {
                sendMessage(
                    {
                        conversationId,
                        content,
                        type,
                        metadata,
                    },
                    (ack) => {
                        // ack is server response sent by socket handler
                        // expected: { status: "ok", message } or { status: "error", message: "..." }

                        // console.log('Ack: ', ack);

                        // Nếu không có ack
                        if (!ack) {
                            // no ack -> mark failed
                            // set optimistic message status = failed
                            queryClient.setQueryData(['messages', conversationId], (old) => {
                                if (!old) return old;
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
                            return reject(new Error('No ack from server'));
                        }

                        // Nếu ack status 'ok'
                        if (ack.status === 'ok' && ack.message) {
                            const serverMsg = ack.message;
                            // Replace optimistic message with serverMessage in cache
                            queryClient.setQueryData(['messages', conversationId], (old) => {
                                if (!old) {
                                    return { pages: [{ messages: [serverMsg], nextCursor: null }], pageParams: [] };
                                }
                                const pages = old.pages.map((p) => {
                                    p.messages = p.messages.map((m) => {
                                        if (
                                            m.optimistic &&
                                            m.metadata?.clientMessageId &&
                                            serverMsg.metadata?.clientMessageId &&
                                            m.metadata.clientMessageId === serverMsg.metadata.clientMessageId
                                        ) {
                                            return serverMsg;
                                        }
                                        return m;
                                    });
                                    return p;
                                });
                                return { ...old, pages };
                            });
                            return resolve({ ok: true, message: serverMsg });
                        } else {
                            // server ack error
                            queryClient.setQueryData(['messages', conversationId], (old) => {
                                if (!old) return old;
                                const pages = old.pages.map((p) => {
                                    p.messages = p.messages.map((m) => {
                                        if (m.optimistic && m.metadata?.clientMessageId === clientMessageId) {
                                            m.status = 'failed';
                                            m.error = ack?.message || 'send_error';
                                        }
                                        return m;
                                    });
                                    return p;
                                });
                                return { ...old, pages };
                            });
                            return reject(new Error(ack?.message || 'send_error'));
                        }
                    },
                );
            } catch (err) {
                // network or send error -> mark failed
                queryClient.setQueryData(['messages', conversationId], (old) => {
                    if (!old) return old;
                    const pages = old.pages.map((p) => {
                        p.messages = p.messages.map((m) => {
                            if (m.optimistic && m.metadata?.clientMessageId === clientMessageId) {
                                m.status = 'failed';
                                m.error = err.message;
                            }
                            return m;
                        });
                        return p;
                    });
                    return { ...old, pages };
                });
                return reject(err);
            }
        });
    };

    /**
     * sendTypingMessage: is typing message
     */
    const sendTypingMessage = ({ conversationId, isTyping }) => {
        //
        sendTyping(conversationId, isTyping);
    };

    /**
     * sendAckMessage
     */
    const sendAckMessage = ({ messageId, status }) => {
        //
        acknowledgeMessage(messageId, status);
    };

    return {
        ...messagesInfiniteQuery,
        messages,
        send,
        sendTypingMessage,
        sendAckMessage, // read/delivered acks
        socketAvailable: !!socket,
    };
}

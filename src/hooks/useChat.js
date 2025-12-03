import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getMessagesApi } from '~/utils/api'; // still used for initial/history fetch
import { v4 as uuidv4 } from 'uuid';
import { useContext, useEffect, useRef, useState } from 'react';
import {
    addNewMessage,
    addOptimisticMessage,
    markOptimisticMessageFailed,
    updateMessageStatus,
} from '~/helper/messagesCacheModify';
import { AuthContext } from '~/context/auth.context';
import { useSocket } from '~/context/socket.context';
import { message } from 'antd';
import { useParams } from 'react-router-dom';

/**
 * useChat
 * @param {string} conversationId
 */
export function useChat(conversationId) {
    // State
    const [isTyping, setIsTyping] = useState();

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    // const isTypingRef = useRef();

    // React Router
    // const { conversationId } = useParams();

    // React Query (Tanstack)
    const queryClient = useQueryClient();

    // Get Messages
    const messagesInfiniteQuery = useInfiniteQuery({
        queryKey: ['messages', conversationId],
        queryFn: async ({ pageParam = null }) => {
            // conversationId, pageParam = nextCursor, limit = 20
            const res = await getMessagesApi(conversationId, pageParam, 20);
            return res; // { messages, conversation, lastReadMessageEachParticipant, nextCursor }
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        // enabled: !!conversationId,
        // refetchOnWindowFocus: false,
        // staleTime: 1000 * 60, // 1 minute
        enabled: true,
        refetchOnWindowFocus: true,
    });

    // useSocket
    const { socket, isConnected, on, sendMessage, acknowledgeMessage, sendTyping, sendConversationRead, setPresence } =
        useSocket();

    // Flatten pages -> messages array (oldest -> newest)
    // const messages = (messagesInfiniteQuery.data?.pages || []).flatMap((p) => p.messages || []).reverse();
    const messages = (messagesInfiniteQuery.data?.pages || []).flatMap((p) => p.messages)?.reverse();
    // lastReadMessagesEachParticipant
    const lastReadMessagesEachParticipant = (messagesInfiniteQuery.data?.pages || [])?.[
        messagesInfiniteQuery?.data?.pages ? messagesInfiniteQuery?.data?.pages?.length - 1 : 0
    ]?.lastReadMessagesEachParticipant;
    // Conversation Info
    const conversationInfo =
        (messagesInfiniteQuery.data?.pages || [])?.[
            messagesInfiniteQuery?.data?.pages ? messagesInfiniteQuery?.data?.pages?.length - 1 : 0
        ]?.conversation || {};

    // --- HANDLE FUNCTION ---
    // Handler: on message_created (from server broadcast)
    // HANDLE LISTEN SOCKET EVENTS
    useEffect(() => {
        if (!conversationId || !socket || !isConnected) return;

        // Handle message created
        // When server broadcasts a message_created, we must:
        // - if there is an optimistic message with same clientMessageId -> replace it
        // - otherwise append if not duplicate
        const handleMessageCreated = ({ message }) => {
            // console.log('Handle message created: ', message);
            // Thêm tin nhắn mới vào cache
            addNewMessage(
                queryClient,
                auth,
                conversationId,
                message,
                conversationInfo,
                lastReadMessagesEachParticipant,
            );
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

        // Handle typing detect
        const handleTypingDetect = (payload) => {
            setIsTyping(payload);
        };

        // Handle joined conversation
        const handleJoinedConversation = (payload) => {
            //
            // console.log('Joined Conversation: ', payload?.conversationId);
            // handleSendConversationRead(payload?.conversationId);
        };

        // Handle conversation read by
        const handleConversationReadBy = (payload) => {
            // console.log(
            //     `Người dùng ${payload?.User?.userName} đã xem tin nhắn lúc ${payload?.readAt}, cuộc trò chuyện ${payload?.conversationId}`,
            // );
            console.log(payload);
            console.log('handleConversationReadBy bên ChatWindow');
            updateMessageStatus(queryClient, auth, payload);
        };

        // Handle presence
        const handlePresence = (payload) => {
            // Set presence context
            setPresence((old) => {
                const presenceMap = new Map(old);
                presenceMap.set(payload?.userId, payload);
                return presenceMap;
            });
        };

        // Register using on() which returns unsubscribe functions
        const unsubMsg = on('message_created', handleMessageCreated); // Nhận tin nhắn mới khi ở trong cuộc trò chuyện
        const unsubStatus = on('message_status_update', handleStatusUpdate); // Nhận cập nhật trạng thái tin nhắn
        const unsubTyping = on('typing', handleTypingDetect); // Nhận trạng thái gõ/nhập tin nhắn
        const unsubJoined = on('joined_conversation', handleJoinedConversation); // Nhận trạng thái đã tham gia cuộc trò chuyện
        const unsubReadBy = on('conversation_read_by', handleConversationReadBy); // Nhận trạng thái đã xem cuộc trò chuyện
        const unsubPresence = on('presence', handlePresence); // Nhận trạng thái hoạt động của người dùng

        return () => {
            unsubMsg?.();
            unsubStatus?.();
            unsubTyping?.();
            unsubJoined?.();
            unsubReadBy?.();
            unsubPresence?.();
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

        // Thêm tin nhắn optimistic vào cache
        addOptimisticMessage(
            queryClient,
            conversationId,
            tempMessage,
            conversationInfo,
            lastReadMessagesEachParticipant,
        );

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

                        // Nếu không có ack hoặc status là error
                        if (!ack || ack.status === 'error') {
                            // no ack -> mark failed
                            // Set optimistic message status = failed
                            markOptimisticMessageFailed(queryClient, conversationId, clientMessageId, tempMessage);
                            return reject(new Error('No ack from server'));
                        }

                        // Nếu ack status 'ok'
                        if (ack.status === 'ok' && ack.message) {
                            // console.log('Ack Status OK');
                            const serverMsg = ack.message;
                            // Replace optimistic message with serverMessage in cache
                            // queryClient.setQueryData(['messages', conversationId], (old) => {
                            //     if (!old) {
                            //         return { pages: [{ messages: [serverMsg], nextCursor: null }], pageParams: [] };
                            //     }
                            //     const pages = old.pages.map((p) => {
                            //         p.messages = p.messages.map((m) => {
                            //             if (
                            //                 m.optimistic &&
                            //                 m.metadata?.clientMessageId &&
                            //                 serverMsg.metadata?.clientMessageId &&
                            //                 m.metadata.clientMessageId === serverMsg.metadata.clientMessageId
                            //             ) {
                            //                 return serverMsg;
                            //             }
                            //             return m;
                            //         });
                            //         return p;
                            //     });
                            //     return { ...old, pages };
                            // });

                            // # Không cần thiết thực hiện thay thế tin nhắn optimistic ở đây,...
                            // # vì sự kiện lắng nghe message_created sẽ làm việc này

                            return resolve({ ok: true, message: serverMsg });
                        } else {
                            console.log('Server timeout or unexpected ack');
                            // server ack error
                            // queryClient.setQueryData(['messages', conversationId], (old) => {
                            //     if (!old) return old;
                            //     const pages = old.pages.map((p) => {
                            //         p.messages = p.messages.map((m) => {
                            //             if (m.optimistic && m.metadata?.clientMessageId === clientMessageId) {
                            //                 m.status = 'failed';
                            //                 m.error = ack?.message || 'send_error';
                            //             }
                            //             return m;
                            //         });
                            //         return p;
                            //     });
                            //     return { ...old, pages };
                            // });
                            markOptimisticMessageFailed(queryClient, conversationId, clientMessageId, tempMessage);
                            return reject(new Error(ack?.message || 'send_error'));
                        }
                    },
                );
            } catch (err) {
                console.log('Send message error, network or socket issue');
                // network or send error -> mark failed
                // queryClient.setQueryData(['messages', conversationId], (old) => {
                //     if (!old) return old;
                //     const pages = old.pages.map((p) => {
                //         p.messages = p.messages.map((m) => {
                //             if (m.optimistic && m.metadata?.clientMessageId === clientMessageId) {
                //                 m.status = 'failed';
                //                 m.error = err.message;
                //             }
                //             return m;
                //         });
                //         return p;
                //     });
                //     return { ...old, pages };
                // });
                markOptimisticMessageFailed(queryClient, conversationId, clientMessageId, tempMessage);
                return reject(err);
            }
        });
    };

    /**
     * sendAckMessage
     */
    const sendAckMessage = ({ messageId, status }) => {
        //
        acknowledgeMessage(messageId, status);
    };

    /**
     * sendTypingMessage: is typing message
     */
    const sendTypingMessage = ({ conversationId, isTyping }) => {
        //
        sendTyping(conversationId, isTyping);
    };

    /**
     * sendConversationRead: mark conversation as read
     */
    const handleSendConversationRead = ({ conversationId, lastReadMessageId }) => {
        // Gọi hàm gửi cập nhật trạng thái đã xem tin nhắn qua socket
        sendConversationRead(conversationId, lastReadMessageId);
    };

    return {
        ...messagesInfiniteQuery,
        messages,
        lastReadMessagesEachParticipant,
        conversationInfo,
        send,
        sendTypingMessage,
        sendAckMessage, // read/delivered acks
        handleSendConversationRead,
        socketAvailable: !!socket,
        isTyping,
    };
}

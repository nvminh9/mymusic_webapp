import { useEffect, useRef, useState } from 'react';
import { getMessagesApi } from '~/utils/api';

/**
 * useInfiniteMessages loads message pages (older first).
 * - conversationId: id
 */
export default function useInfiniteMessages(conversationId) {
    // State
    const [pages, setPages] = useState([]); // array of arrays (each page is messages chronological oldest->newest)
    const [nextCursor, setNextCursor] = useState();
    const [loading, setLoading] = useState(false);

    // Context

    // Ref
    const loadedRef = useRef(false);

    // --- HANDLE FUNCTION ---
    // Initial load
    useEffect(() => {
        let cancelled = false;
        const loadFirst = async () => {
            setLoading(true);
            try {
                const data = await getMessagesApi(conversationId, null, 20);
                if (cancelled) return;
                // API returns messages chronological oldest->newest per page
                setPages([data.messages || []]);
                setNextCursor(data.nextCursor);
                loadedRef.current = true;
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        if (conversationId) loadFirst();
        return () => (cancelled = true);
    }, [conversationId]);
    // Handle Load More Message (Older Message)
    const loadMore = async () => {
        if (!nextCursor) return null;
        setLoading(true);
        try {
            const data = await getMessagesApi(conversationId, nextCursor, 20);
            // prepend older page to pages (older -> earlier)
            setPages((prev) => [data.messages || [], ...prev]);
            setNextCursor(data.nextCursor);
            return data.messages;
        } catch (err) {
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // flatten messages (pages[0] is newest page? In our earlier server we returned oldest->newest per page.
    // We keep pages array in order: [page0, page1,...] where page0 is newest chunk loaded first? In hook we loaded most recent chunk first.
    // To render: we want chronological oldest -> newest across all pages: flatten pages in order of insertion.
    const messages = pages.flat();

    console.log('useInfiniteMessages, flat messages: ', messages);

    return {
        messages,
        pages,
        loading,
        nextCursor,
        loadMore,
        prependMessage: (message) => {
            // append newest message to end (newest at end)
            setPages((prev) => {
                if (prev.length === 0) return [[message]];
                // put message in last page (which contains newest items)
                const copy = [...prev];
                copy[0] = [...copy[0], message];
                console.log(copy);
                return copy;
            });
            // console.log('prependMessage, new message: ', message);
        },
        replaceMessageByClientId: (clientMessageId, newMessage) => {
            setPages((prev) =>
                prev.map((page) => page.map((m) => (m.metadata?.clientMessageId === clientMessageId ? newMessage : m))),
            );
        },
        updateMessageStatus: (messageId, updates) => {
            setPages((prev) =>
                prev.map((page) => page.map((m) => (m.messageId === messageId ? { ...m, ...updates } : m))),
            );
        },
    };
}

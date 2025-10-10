import React, { useEffect, useRef } from 'react';

/**
 * messages: array chronological oldest -> newest
 * onScrollToTop: callback to load older messages
 */
export default function MessageList({ messages, onScrollToTop, currentUserId, messageStatusUpdater }) {
    // State

    // Context

    // Ref
    const ref = useRef();

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // scroll to bottom when messages change (newer message appended)
        const el = ref.current;
        if (!el) return;
        // small delay to ensure DOM updated
        requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight;
        });
    }, [messages.length]);

    const handleScroll = (e) => {
        if (e.target.scrollTop < 100 && onScrollToTop) {
            onScrollToTop();
        }
    };

    return (
        <div className="message-list" ref={ref} onScroll={handleScroll}>
            {messages.map((m) => (
                <div
                    key={m.messageId || m.metadata?.clientMessageId}
                    className={`message-row ${m.senderId === currentUserId ? 'me' : 'them'}`}
                >
                    <div className="message-bubble">
                        <div className="message-text">{m.content}</div>
                        <div className="message-meta">
                            <small>{new Date(m.createdAt).toLocaleTimeString()}</small>
                            <small className="status">
                                {m.status ||
                                    (m.readAt ? 'read' : m.deliveredAt ? 'delivered' : m.createdAt ? 'sent' : '')}
                            </small>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

import React, { useState, useRef } from 'react';
import { CiPaperplane } from 'react-icons/ci';
import { v4 as uuidv4 } from 'uuid';

export default function MessageInput({ onSend, onTyping, conversationId }) {
    // State
    const [text, setText] = useState('');

    // Ref
    const typingTimeoutRef = useRef(null);

    // --- HANDLE FUNCTION ---
    // Handle khi nhập nội dung nhắn
    const handleChange = (e) => {
        setText(e.target.value);
        onTyping?.({ conversationId, isTyping: true });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            onTyping?.({ conversationId, isTyping: false });
        }, 800);
    };
    // Handle gửi tin nhắn
    const handleSend = async () => {
        if (!text.trim()) return;
        const clientMessageId = uuidv4();
        const metadata = { clientMessageId };
        await onSend({ content: text, metadata });
        setText('');
        onTyping?.({ conversationId, isTyping: false });
    };

    return (
        <div
            className="messageInputContainer"
            // style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', gap: 8 }}
        >
            <input
                className="messageInput"
                value={text}
                onChange={handleChange}
                placeholder="Tin nhắn..."
                // style={{ flex: 1, padding: 8 }}
            />
            <button className="btnSendMessage" onClick={handleSend}>
                <CiPaperplane />
            </button>
        </div>
    );
}

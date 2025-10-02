import React from 'react';

export default function MessageBubble({ message, isOwn }) {
    const time = new Date(message.createdAt).toLocaleTimeString();
    const style = {
        maxWidth: '70%',
        padding: 8,
        margin: '6px 0',
        borderRadius: 8,
        background: isOwn ? '#0078ff' : '#eee',
        color: isOwn ? '#fff' : '#000',
        alignSelf: isOwn ? 'flex-end' : 'flex-start',
    };

    return (
        <div style={style}>
            <div>{message.content}</div>
            <div style={{ fontSize: 10, opacity: 0.8, marginTop: 6, textAlign: 'right' }}>
                {time} {message.optimistic ? '· sending...' : message.status === 'read' ? '· read' : ''}
            </div>
        </div>
    );
}

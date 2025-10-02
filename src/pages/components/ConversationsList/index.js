import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConversationsApi } from '~/utils/api';
import { Link } from 'react-router-dom';

export default function ConversationsList() {
    // const { data, isLoading } = useQuery(['conversations'], getConversationsApi);

    // const convs = data?.conversations || [
    //     {
    //         conversationId: '65e2a2f5-8a61-45d9-bc09-c1bdd1e36061',
    //         title: 'DM Test',
    //         lastMessage: {
    //             content: 'Test last message',
    //         },
    //     },
    // ];
    const convs = [
        {
            conversationId: '65e2a2f5-8a61-45d9-bc09-c1bdd1e36061',
            title: 'DM Test',
            lastMessage: {
                content: 'Test last message',
            },
        },
    ];

    // Nếu đang load
    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <h3>Conversations</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {convs.map((c) => (
                    <li key={c.conversationId}>
                        <Link
                            to={`${c.conversationId}`}
                            style={{
                                display: 'block',
                                padding: 12,
                                backgroundColor: 'whitesmoke',
                                margin: '10px',
                                borderRadius: '15px',
                            }}
                        >
                            <div>
                                <strong>{c.title || 'DM'}</strong>
                            </div>
                            <div style={{ fontSize: 12 }}>{c.lastMessage?.content?.slice(0, 80)}</div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

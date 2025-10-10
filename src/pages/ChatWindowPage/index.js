import { useEffect, useLayoutEffect, useRef } from 'react';
import ChatWindow from '../components/ChatWindow';
import { useParams } from 'react-router-dom';

function ChatWindowPage() {
    // State

    // Context

    // React Router
    const { conversationId } = useParams();

    // Ref
    const chatWindowContainerRef = useRef(null);

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        return () => {
            //
        };
    }, [conversationId]);

    return (
        <div ref={chatWindowContainerRef} className="chatWindowContainer">
            <ChatWindow />
        </div>
    );
}

export default ChatWindowPage;

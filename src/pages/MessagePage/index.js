import { Outlet } from 'react-router-dom';
import ConversationsList from '../components/ConversationsList';

function MessagePage() {
    // State

    // Context

    return (
        <>
            <h1 style={{ color: 'white' }}>MessagePage</h1>
            {/* Conversations List */}
            <ConversationsList />
            {/* Outlet */}
            <Outlet />
        </>
    );
}

export default MessagePage;

import { Outlet } from 'react-router-dom';
import ConversationsList from '../components/ConversationsList';

function MessagePage() {
    // State

    // Context

    return (
        <div className="messagePage">
            <h1 style={{ color: 'white', margin: '0' }}>MessagePage</h1>
            {/* Conversations List */}
            <ConversationsList />
            {/* Outlet */}
            <Outlet />
        </div>
    );
}

export default MessagePage;

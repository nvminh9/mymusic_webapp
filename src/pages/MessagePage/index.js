import { Fragment, useEffect } from 'react';
import ConversationsList from '../components/ConversationsList';
import { VscChevronLeft } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '~/context/socket.context';

function MessagePage() {
    // State

    // Context

    // Navigation
    const navigate = useNavigate();

    // useSocket
    const { socket, isConnected, on } = useSocket();

    // --- HANDLE FUNCTION ---
    // Đăng ký hàm xử lý cho các sự kiện Socket nhận về từ Server
    useEffect(() => {
        if (!socket || !isConnected) return;

        // Handle Conversation New Message
        const handleConversationNewMessage = (payload) => {
            console.log('Conversation New Message', payload);
        };

        // Handle conversation read by
        const handleConversationReadBy = (payload) => {
            // console.log(
            //     `Người dùng ${payload?.User?.userName} đã xem tin nhắn lúc ${payload?.readAt}, cuộc trò chuyện ${payload?.conversationId}`,
            // );
            console.log(payload);
            // updateMessageStatus(queryClient, auth, payload);
        };

        // Đăng ký với socket
        // const unsubConversationNewMessage = on('conversation_new_message', handleConversationNewMessage);
        // const unsubReadBy = on('conversation_read_by', handleConversationReadBy); // Nhận trạng thái đã xem cuộc trò chuyện

        return () => {
            // unsubConversationNewMessage?.();
            // unsubReadBy?.();
        };
    }, [socket, on]);

    return (
        <Fragment>
            {/* Thanh chuyển tab */}
            <div className="tabSwitchProfile">
                <div className="profileUserName">
                    <span>Nhắn tin</span>
                </div>
                <div className="btnComeBackBox">
                    <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                        <VscChevronLeft />
                        <span class="tooltiptext">Quay lại</span>
                    </button>
                </div>
            </div>
            <div className="messagePage">
                {/* Conversations List */}
                <ConversationsList />
                {/* Outlet */}
                {/* <Outlet /> */}
            </div>
        </Fragment>
    );
}

export default MessagePage;

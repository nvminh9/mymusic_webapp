import React, { Fragment, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getConversationsApi } from '~/utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { VscChevronLeft } from 'react-icons/vsc';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { IoEllipse, IoSyncSharp } from 'react-icons/io5';
import { AuthContext } from '~/context/auth.context';
import { formatMessageTime } from '~/utils/dateFormatter';
import { message } from 'antd';
import { EnvContext } from '~/context/env.context';

export default function ConversationsList({ isOpenSearchConversation }) {
    // State

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // Navigation
    const navigate = useNavigate();

    // React Query (Tanstack)
    // const queryClient = useQueryClient();
    // Fetch Conversation List (Chưa phân trang)
    const {
        data: conversationList,
        isLoading,
        status,
    } = useQuery({
        queryKey: ['conversationList'],
        queryFn: async () => {
            const res = await getConversationsApi(); // { status, message, data }
            return res.data;
        },
        enabled: true,
        refetchOnWindowFocus: true,
        // staleTime: 1000 * 60, // Cần refetch sau 1 phút (có thể sẽ điều chỉnh lại thành lâu hơn)
    });

    // --- HANDLE FUNCTION ---
    // Format thời gian tạo
    const timeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const seconds = Math.floor((now - past) / 1000);
        const intervals = [
            { label: 'năm', seconds: 31536000 },
            { label: 'tháng', seconds: 2592000 },
            { label: 'tuần', seconds: 604800 },
            { label: 'ngày', seconds: 86400 },
            { label: 'giờ', seconds: 3600 },
            { label: 'phút', seconds: 60 },
            { label: 'giây', seconds: 1 },
        ];
        // Nếu đã quá 30 phút thì return chi tiết
        if (seconds >= intervals[5].seconds * 30) {
            return formatTimestamp(timestamp);
        }
        for (let i = 0; i < intervals.length; i++) {
            const interval = Math.floor(seconds / intervals[i].seconds);
            if (interval >= 1) {
                return `${interval} ${intervals[i].label} trước`;
            }
        }
        return 'vừa xong';
    };
    // Format thời gian sang định dạng "dd/mm/yyyy HH:MM"
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day} Tháng ${month}, ${year} lúc ${hours}:${minutes}`;
    };
    // Check if conversation is new (check createdAt)
    const handleCheckIsNewConversation = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const seconds = Math.floor((now - past) / 1000);
        const intervals = [
            { label: 'năm', seconds: 31536000 },
            { label: 'tháng', seconds: 2592000 },
            { label: 'tuần', seconds: 604800 },
            { label: 'ngày', seconds: 86400 },
            { label: 'giờ', seconds: 3600 },
            { label: 'phút', seconds: 60 },
            { label: 'giây', seconds: 1 },
        ];
        // Nếu chưa quá 1 ngày thì return true
        if (seconds <= intervals[3].seconds) {
            return true;
        } else {
            return false;
        }
    };

    // Nếu đang load
    if (isLoading) {
        return (
            <Fragment>
                {/* Thanh chuyển tab */}
                <div className="tabSwitchProfile">
                    <div className="profileUserName">
                        <span>Message</span>
                    </div>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div>
                <div
                    style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // padding: '30px 0px',
                    }}
                >
                    <IoSyncSharp
                        className="loadingAnimation"
                        style={{ color: 'white', width: '20px', height: '20px' }}
                    />
                </div>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <div className="conversationListContainer">
                <ul className="conversationList" style={{ paddingTop: isOpenSearchConversation ? '48.8px' : '' }}>
                    {/* Render Conversation List */}
                    {conversationList &&
                        conversationList?.map((conversation) => {
                            if (
                                conversation?.newestMessage?.length === 0 &&
                                conversation?.createdBy !== auth?.user?.userId
                            ) {
                                return;
                            }
                            return (
                                <li className="conversationItem" key={conversation.conversationId}>
                                    <Link className="conversationLink" to={`${conversation.conversationId}`}>
                                        {/* Left */}
                                        <div className="left">
                                            {/* Avatar */}
                                            <div className="conversationAvatar">
                                                <img
                                                    src={
                                                        conversation.avatar
                                                            ? env?.backend_url + conversation.avatar
                                                            : defaultAvatar
                                                    }
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                        {/* Right */}
                                        <div className="right">
                                            {/* User Name */}
                                            <span className="conversationTitle">
                                                {conversation.title ? conversation.title : 'Chưa có tên'}
                                            </span>
                                            {/* Tin nhắn mới nhất */}
                                            {conversation?.newestMessage?.[0] ? (
                                                <span className="newestMessage">
                                                    <span
                                                        className="content"
                                                        style={{
                                                            color:
                                                                !!conversation?.unseenMessages?.find(
                                                                    (message) =>
                                                                        message.messageId ===
                                                                        conversation?.newestMessage?.[0]?.messageId,
                                                                ) &&
                                                                conversation?.newestMessage?.[0]?.senderId !==
                                                                    auth?.user?.userId
                                                                    ? '#ffffff'
                                                                    : '',
                                                            fontWeight:
                                                                !!conversation?.unseenMessages?.find(
                                                                    (message) =>
                                                                        message.messageId ===
                                                                        conversation?.newestMessage?.[0]?.messageId,
                                                                ) &&
                                                                conversation?.newestMessage?.[0]?.senderId !==
                                                                    auth?.user?.userId
                                                                    ? '700'
                                                                    : '',
                                                            width:
                                                                conversation?.newestMessage?.[0]?.content?.length < 31
                                                                    ? 'max-content'
                                                                    : '',
                                                        }}
                                                    >
                                                        {conversation?.newestMessage?.[0]
                                                            ? `${
                                                                  conversation?.newestMessage?.[0]?.senderId ===
                                                                  auth?.user?.userId
                                                                      ? 'Bạn: '
                                                                      : ''
                                                              }${conversation?.newestMessage?.[0]?.content}`
                                                            : ''}
                                                    </span>
                                                    {conversation?.newestMessage?.[0] && <span>·</span>}
                                                    <span className="createdAt">
                                                        {conversation?.newestMessage?.[0]?.createdAt
                                                            ? `${formatMessageTime(
                                                                  conversation?.newestMessage?.[0]?.createdAt,
                                                              )}`
                                                            : ''}
                                                    </span>
                                                </span>
                                            ) : (
                                                <span className="newestMessage">
                                                    <span
                                                        className="content"
                                                        style={{ width: 'max-content' }}
                                                    >{`Hãy chào ${conversation?.title} 👋`}</span>
                                                </span>
                                            )}
                                        </div>
                                        {/* Nếu Conversation mới */}
                                        {!conversation?.newestMessage?.[0] &&
                                            handleCheckIsNewConversation(conversation?.createdAt) && (
                                                <span
                                                    style={{
                                                        fontFamily: 'system-ui',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        color: '#0984e3',
                                                        backgroundColor: '#0985e340',
                                                        border: '1px solid #0984e3',
                                                        borderRadius: '25px',
                                                        padding: '1px 4px',
                                                        position: 'absolute',
                                                        right: '16px',
                                                    }}
                                                >
                                                    Mới
                                                </span>
                                            )}
                                        {/* Mark if have new message unseen or seen, sent */}
                                        {/* Unseen */}
                                        {!!conversation?.unseenMessages?.find(
                                            (message) =>
                                                message.messageId === conversation?.newestMessage?.[0]?.messageId,
                                        ) && (
                                            <>
                                                {conversation?.newestMessage?.[0]?.senderId !== auth?.user?.userId ? (
                                                    <div className="mark">
                                                        <IoEllipse />
                                                    </div>
                                                ) : (
                                                    <div className="mark">
                                                        <span style={{ color: '#818181', fontWeight: '500' }}>
                                                            Đã gửi
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {/* Seen */}
                                        {!!!conversation?.unseenMessages?.find(
                                            (message) =>
                                                message.messageId === conversation?.newestMessage?.[0]?.messageId,
                                        ) && (
                                            <>
                                                {conversation?.newestMessage?.[0]?.senderId === auth?.user?.userId ? (
                                                    <>
                                                        <div className="mark">
                                                            <img
                                                                className="markAvatar"
                                                                src={
                                                                    conversation?.participants?.filter(
                                                                        (participant) =>
                                                                            participant?.User?.userId !==
                                                                            auth?.user?.userId,
                                                                    )?.[0]?.User?.userAvatar
                                                                        ? env?.backend_url +
                                                                          conversation?.participants?.filter(
                                                                              (participant) =>
                                                                                  participant?.User?.userId !==
                                                                                  auth?.user?.userId,
                                                                          )?.[0]?.User?.userAvatar
                                                                        : defaultAvatar
                                                                }
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                </ul>
            </div>
        </Fragment>
    );
}

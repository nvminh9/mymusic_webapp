import { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ConversationsList from '../components/ConversationsList';
import { VscChevronLeft } from 'react-icons/vsc';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '~/context/socket.context';
import { updateMessageStatus } from '~/helper/messagesCacheModify';
import { AuthContext } from '~/context/auth.context';
import { useQueryClient } from '@tanstack/react-query';
import { IoAdd, IoClose, IoEllipse, IoPeople, IoPerson, IoSearch, IoSyncSharp } from 'react-icons/io5';
import { searchConversationApi } from '~/utils/api';
import { debounce } from 'lodash';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { formatMessageTime } from '~/utils/dateFormatter';
import CreateNewConversationBox from '../components/CreateNewConversationBox';
import { EnvContext } from '~/context/env.context';

function MessagePage() {
    // State
    const [isOpenSearchConversation, setIsOpenSearchConversation] = useState(false);
    const [isOpenCreateConversation, setIsOpenCreateConversation] = useState(false);
    const [searchConversationQuery, setSearchConversationQuery] = useState('');
    const [searchConversationResult, setSearchConversationResult] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isShowSearchConversationResult, setIsShowSearchConversationResult] = useState(false);
    const [isOpenCreateNewConversationBox, setIsOpenCreateNewConversationBox] = useState(false);

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // Ref
    const createConversationChoicesRef = useRef(null);
    const searchConversationInputRef = useRef(null);

    // Navigation
    const navigate = useNavigate();

    // useSocket
    const { socket, isConnected, on } = useSocket();

    // React Query
    const queryClient = useQueryClient();

    // --- HANDLE FUNCTION ---
    // Đăng ký hàm xử lý cho các sự kiện Socket nhận về từ Server
    useEffect(() => {
        if (!socket || !isConnected) return;

        // Handle Conversation New Message
        const handleConversationNewMessage = (payload) => {
            console.log('Conversation New Message', payload);
            const { conversationId, message } = payload;
            // -- Update messages cache
            // queryClient.setQueryData(['messages', conversationId], (old) => {
            //     // If conversation has no cached messages yet
            //     if (!old) {
            //         return old; // Do nothing
            //     }
            //     // Deep clone pages to avoid mutating cached object
            //     const pages = JSON.parse(JSON.stringify(old.pages || []));
            //     if (!pages.length === 0) {
            //         // Unshift message vào page đầu tiên
            //         pages[0].messages.unshift(message);
            //     }
            // });
            // -- Update conversationList cache
            queryClient.setQueryData(['conversationList'], (old) => {
                // If conversationList has no cached data yet
                if (!old) {
                    return old; // Do nothing
                }
                //
                const updatedConversations = old.map((conversation) => {
                    // Find the conversation to update
                    if (conversation.conversationId === conversationId) {
                        return {
                            ...conversation,
                            newestMessageCreatedAt: message.createdAt,
                            newestMessage: [{ ...message }],
                            unseenMessages: [
                                ...conversation.unseenMessages,
                                {
                                    messageId: message.messageId,
                                    userId: conversation?.participants?.find((p) => p.userId !== auth?.user?.userId)
                                        ?.userId,
                                    readAt: null,
                                    conversationId: conversationId,
                                },
                            ],
                        };
                    }
                    //
                    return conversation;
                });
                // Order conversations by newestMessageCreatedAt descending
                updatedConversations.sort(
                    (a, b) => new Date(b.newestMessageCreatedAt) - new Date(a.newestMessageCreatedAt),
                );
                // Return updated conversation list
                return updatedConversations;
            });
        };

        // Handle conversation read by
        const handleConversationReadBy = (payload) => {
            // console.log(
            //     `Người dùng ${payload?.User?.userName} đã xem tin nhắn lúc ${payload?.readAt}, cuộc trò chuyện ${payload?.conversationId}`,
            // );
            console.log(payload);
            console.log('handleConversationReadBy bên MessagePage');
            updateMessageStatus(queryClient, auth, payload);
        };

        // Đăng ký với socket
        const unsubConversationNewMessage = on('conversation_new_message', handleConversationNewMessage); // Nhận tin nhắn mới trong cuộc trò chuyện
        const unsubReadBy = on('conversation_read_by', handleConversationReadBy); // Nhận trạng thái đã xem cuộc trò chuyện

        return () => {
            unsubConversationNewMessage?.();
            unsubReadBy?.();
        };
    }, [socket, on]);
    // Handle Click Outside To Close
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Click outside createConversationChoicesRef
            if (createConversationChoicesRef.current && !createConversationChoicesRef.current.contains(event.target)) {
                setIsOpenCreateConversation(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Handle Search Conversation (Debounce)
    const debouncedSearchConversation = useCallback(
        debounce(async (searchQuery) => {
            // Kiểm tra người dùng đã nhập keyword chưa
            if (!searchQuery.trim()) {
                // setSuggestions([]);
                setIsShowSearchConversationResult(false);
                return;
            }

            //
            setIsLoading(true);
            try {
                // Call API Search Conversation
                // const res = await getSearchAutocompleteApi(encodeURIComponent(searchQuery), 8);
                const res = await searchConversationApi(encodeURIComponent(searchQuery));

                if (res?.status === 200 && res?.data) {
                    setSearchConversationResult(res.data);
                    setIsShowSearchConversationResult(true);
                }
            } catch (error) {
                console.error('Search autocomplete error:', error);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        [],
    );
    // Cleanup debounced function
    useEffect(() => {
        return () => {
            debouncedSearchConversation.cancel();
        };
    }, [debouncedSearchConversation]);
    // Handle input change
    const handleSearchConversationQueryChange = (e) => {
        const value = e.target.value;
        setSearchConversationQuery(value);
        debouncedSearchConversation(value);
    };

    return (
        <Fragment>
            {/* Thanh chuyển tab */}
            <div className="tabSwitchProfile">
                <div className="profileUserName">
                    <span>Nhắn tin</span>
                    {/* Phần tiện tích */}
                    <div className="utilsBox">
                        <button
                            className="btnSearchConversation"
                            onClick={() => {
                                // setIsOpenSearchConversation(!isOpenSearchConversation);
                                if (isOpenSearchConversation) {
                                    setIsOpenSearchConversation(false);
                                    setSearchConversationQuery('');
                                    setIsShowSearchConversationResult(false);
                                } else {
                                    setIsOpenSearchConversation(true);
                                    searchConversationInputRef.current?.focus();
                                }
                            }}
                            style={{
                                backgroundColor: isOpenSearchConversation ? '#1f1f1f' : '',
                            }}
                        >
                            <IoSearch />
                        </button>
                        <button
                            className="btnCreateConversation"
                            onClick={() => {
                                setIsOpenCreateConversation(!isOpenCreateConversation);
                            }}
                            style={{
                                backgroundColor: isOpenCreateConversation ? '#1f1f1f' : '',
                            }}
                        >
                            <IoAdd />
                        </button>
                        {/* Create Conversation Choices */}
                        {isOpenCreateConversation && (
                            <div ref={createConversationChoicesRef} className="createConversationChoices">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpenCreateConversation(false);
                                        setIsOpenCreateNewConversationBox(true);
                                    }}
                                >
                                    <IoPerson /> Tạo cuộc trò chuyện mới
                                </button>
                                <button
                                    type="button"
                                    disabled
                                    style={{
                                        opacity: '0.3',
                                        transform: 'scale(1)',
                                        backgroundColor: 'transparent',
                                        cursor: 'unset',
                                    }}
                                >
                                    <IoPeople /> Tạo nhóm mới
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="btnComeBackBox">
                    <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                        <VscChevronLeft />
                        <span class="tooltiptext">Quay lại</span>
                    </button>
                </div>
            </div>
            <div className="messagePage">
                {/* Search Conversation Input */}
                <div
                    className="searchConversation"
                    style={{
                        top: isOpenSearchConversation ? '58.4px' : '',
                    }}
                >
                    <div className="searchInput">
                        <IoSearch />
                        <input
                            ref={searchConversationInputRef}
                            type="text"
                            placeholder="Tìm kiếm cuộc trò chuyện"
                            autoComplete="off"
                            spellCheck="false"
                            value={searchConversationQuery}
                            onChange={handleSearchConversationQueryChange}
                        />
                    </div>
                    <button
                        className="btnCloseSearchConversation"
                        onClick={() => {
                            setIsOpenSearchConversation(false);
                            setSearchConversationQuery('');
                            setIsShowSearchConversationResult(false);
                        }}
                    >
                        <IoClose />
                    </button>
                </div>
                {/* Create New Conversation Box (DM) */}
                <CreateNewConversationBox
                    isOpenCreateNewConversationBox={isOpenCreateNewConversationBox}
                    setIsOpenCreateNewConversationBox={setIsOpenCreateNewConversationBox}
                    type={'dm'}
                />
                {/* Create New Conversation Box (Group) */}
                {/* ... */}
                {/* Conversations List */}
                {isShowSearchConversationResult ? (
                    <Fragment>
                        {/* Search Result */}
                        <div className="conversationListContainer">
                            <ul
                                className="conversationList"
                                style={{
                                    paddingTop: isShowSearchConversationResult ? '48.8px' : '',
                                }}
                            >
                                {/* Render Conversation List */}
                                {searchConversationResult ? (
                                    searchConversationResult?.length > 0 ? (
                                        searchConversationResult?.map((conversation) => {
                                            if (
                                                conversation?.newestMessage?.length === 0 &&
                                                conversation?.createdBy !== auth?.user?.userId
                                            ) {
                                                return;
                                            }
                                            return (
                                                <li className="conversationItem" key={conversation.conversationId}>
                                                    <Link
                                                        className="conversationLink"
                                                        to={`${conversation.conversationId}`}
                                                    >
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
                                                                {conversation.title
                                                                    ? conversation.title
                                                                    : 'Chưa có tên'}
                                                            </span>
                                                            {/* Tin nhắn mới nhất */}
                                                            <span className="newestMessage">
                                                                <span
                                                                    className="content"
                                                                    style={{
                                                                        color:
                                                                            !!conversation?.unseenMessages?.find(
                                                                                (message) =>
                                                                                    message.messageId ===
                                                                                    conversation?.newestMessage?.[0]
                                                                                        ?.messageId,
                                                                            ) &&
                                                                            conversation?.newestMessage?.[0]
                                                                                ?.senderId !== auth?.user?.userId
                                                                                ? '#ffffff'
                                                                                : '',
                                                                        fontWeight:
                                                                            !!conversation?.unseenMessages?.find(
                                                                                (message) =>
                                                                                    message.messageId ===
                                                                                    conversation?.newestMessage?.[0]
                                                                                        ?.messageId,
                                                                            ) &&
                                                                            conversation?.newestMessage?.[0]
                                                                                ?.senderId !== auth?.user?.userId
                                                                                ? '700'
                                                                                : '',
                                                                        width:
                                                                            conversation?.newestMessage?.[0]?.content
                                                                                ?.length < 31
                                                                                ? 'max-content'
                                                                                : '',
                                                                    }}
                                                                >
                                                                    {conversation?.newestMessage?.[0]
                                                                        ? `${
                                                                              conversation?.newestMessage?.[0]
                                                                                  ?.senderId === auth?.user?.userId
                                                                                  ? 'Bạn: '
                                                                                  : ''
                                                                          }${conversation?.newestMessage?.[0]?.content}`
                                                                        : ''}
                                                                </span>
                                                                {conversation?.newestMessage?.[0] && <span>·</span>}
                                                                <span className="createdAt">
                                                                    {conversation?.newestMessage?.[0]?.createdAt
                                                                        ? `${formatMessageTime(
                                                                              conversation?.newestMessage?.[0]
                                                                                  ?.createdAt,
                                                                          )}`
                                                                        : ''}
                                                                </span>
                                                            </span>
                                                        </div>
                                                        {/* Mark if have new message unseen or seen, sent */}
                                                        {/* Unseen */}
                                                        {!!conversation?.unseenMessages?.find(
                                                            (message) =>
                                                                message.messageId ===
                                                                conversation?.newestMessage?.[0]?.messageId,
                                                        ) && (
                                                            <>
                                                                {conversation?.newestMessage?.[0]?.senderId !==
                                                                auth?.user?.userId ? (
                                                                    <div className="mark">
                                                                        <IoEllipse />
                                                                    </div>
                                                                ) : (
                                                                    <div className="mark">
                                                                        <span
                                                                            style={{
                                                                                color: '#818181',
                                                                                fontWeight: '500',
                                                                            }}
                                                                        >
                                                                            Đã gửi
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                        {/* Seen */}
                                                        {!!!conversation?.unseenMessages?.find(
                                                            (message) =>
                                                                message.messageId ===
                                                                conversation?.newestMessage?.[0]?.messageId,
                                                        ) && (
                                                            <>
                                                                {conversation?.newestMessage?.[0]?.senderId ===
                                                                auth?.user?.userId ? (
                                                                    <>
                                                                        <div className="mark">
                                                                            <img
                                                                                className="markAvatar"
                                                                                src={
                                                                                    conversation?.participants?.filter(
                                                                                        (participant) =>
                                                                                            participant?.User
                                                                                                ?.userId !==
                                                                                            auth?.user?.userId,
                                                                                    )?.[0]?.User?.userAvatar
                                                                                        ? env?.backend_url +
                                                                                          conversation?.participants?.filter(
                                                                                              (participant) =>
                                                                                                  participant?.User
                                                                                                      ?.userId !==
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
                                        })
                                    ) : (
                                        <span
                                            style={{
                                                fontFamily: 'system-ui',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                                color: '#ffffff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                padding: '30px 0px',
                                            }}
                                        >
                                            Không tìm thấy cuộc trò chuyện
                                        </span>
                                    )
                                ) : (
                                    <>
                                        {/* Search Loading */}
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
                                                style={{ color: 'white', width: '18px', height: '18px' }}
                                            />
                                        </div>
                                    </>
                                )}
                            </ul>
                        </div>
                    </Fragment>
                ) : (
                    <ConversationsList isOpenSearchConversation={isOpenSearchConversation} />
                )}
                {/* Outlet */}
                {/* <Outlet /> */}
            </div>
        </Fragment>
    );
}

export default MessagePage;

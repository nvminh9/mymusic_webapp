import { debounce } from 'lodash';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { IoAdd, IoClose, IoSyncSharp } from 'react-icons/io5';
import { createConversationApi, searchReferenceUserApi } from '~/utils/api';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/auth.context';
import { EnvContext } from '~/context/env.context';

function CreateNewConversationBox({ isOpenCreateNewConversationBox, setIsOpenCreateNewConversationBox, type }) {
    // State
    const [searchUserQuery, setSearchUserQuery] = useState('');
    const [searchUserResult, setSearchUserResult] = useState();
    const [selectedUser, setSelectedUser] = useState();
    const [isLoadingSearchUser, setIsLoadingSearchUser] = useState(false);
    const [isShowSearchUserResult, setIsShowSearchUserResult] = useState(false);

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // Ref
    const searchUserInputRef = useRef(null);
    const createNewConversationBoxRef = useRef(null);

    // Navigation
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---
    // Handle Search Reference User (Debounce)
    const debouncedSearchReferenceUser = useCallback(
        debounce(async (searchQuery) => {
            // Kiểm tra người dùng đã nhập keyword chưa
            if (!searchQuery.trim()) {
                // setSuggestions([]);
                setIsShowSearchUserResult(false);
                return;
            }

            //
            setIsLoadingSearchUser(true);
            try {
                // Call API Search Reference User
                // const res = await getSearchAutocompleteApi(encodeURIComponent(searchQuery), 8);
                const res = await searchReferenceUserApi(encodeURIComponent(searchQuery));

                if (res?.status === 200 && res?.data) {
                    setSearchUserResult(res.data);
                    setIsShowSearchUserResult(true);
                }
            } catch (error) {
                console.error('Search autocomplete error:', error);
            } finally {
                setIsLoadingSearchUser(false);
            }
        }, 300),
        [],
    );
    // Cleanup debounced function
    useEffect(() => {
        return () => {
            debouncedSearchReferenceUser.cancel();
        };
    }, [debouncedSearchReferenceUser]);
    // Handle Click Outside To Close
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Click outside createNewConversationBoxRef
            if (createNewConversationBoxRef.current && !createNewConversationBoxRef.current.contains(event.target)) {
                setIsOpenCreateNewConversationBox(false);
                setSelectedUser();
                setSearchUserQuery('');
                setSearchUserResult();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Handle input change
    const handleSearchReferenceUserQueryChange = (e) => {
        const value = e.target.value;
        setSearchUserQuery(value);
        debouncedSearchReferenceUser(value);
    };
    // Handle select reference user for new conversation
    const handleSelectUser = (user) => {
        // Set Selected User
        setSelectedUser(user);
        // Set query and search result null
        setSearchUserQuery('');
        setSearchUserResult();
    };
    // Handle delete selected user
    const handleSelectedUser = () => {
        // Set selected user null
        setSelectedUser();
    };
    // Handle Button Create New Conversation
    const handleBtnCreateNewConversation = async () => {
        // Type DM
        if (type === 'dm') {
            try {
                // Check Selected User
                if (!selectedUser) return;

                // Call API tạo conversation
                // Payload: { type: 'dm' || 'group', participantIds: ['781ac2b1a24',...], title: '', avatar: '' }
                const res = await createConversationApi({
                    type: 'dm',
                    participantIds: JSON.stringify([`${auth?.user?.userId}`, `${selectedUser?.userId}`]),
                });
                // Check if conversation created or existing, then navigate to conversation with conversationId
                if (res?.conversation && res?.conversation?.conversationId) {
                    navigate(`/messages/${res?.conversation?.conversationId}`);
                } else {
                    console.log('Tạo cuộc trò chuyện không thành công');
                }
            } catch (error) {
                console.log('Error Handle Button Message: ', error);
                return;
            }
        }
    };

    if (type === 'group') {
        return <>Group</>;
    }

    if (type === 'dm') {
        return (
            <div
                className="createNewConversationContainer"
                style={{
                    transform: isOpenCreateNewConversationBox ? 'scale(1)' : '',
                    borderRadius: isOpenCreateNewConversationBox ? '0px' : '',
                }}
            >
                <div ref={createNewConversationBoxRef} className="createNewConversationBox">
                    <div className="top">
                        <span className="title">Cuộc trò chuyện mới</span>
                        {/* Button Close */}
                        <button
                            className="btnClose"
                            onClick={() => {
                                setIsOpenCreateNewConversationBox(false);
                                setSelectedUser();
                                setSearchUserQuery('');
                                setSearchUserResult();
                            }}
                        >
                            <IoClose />
                        </button>
                        <div
                            className="inputFindParticipantWrapper"
                            style={{
                                display: !selectedUser ? '' : 'none',
                            }}
                        >
                            <span
                                style={{
                                    color: '#ffffff',
                                    fontFamily: 'system-ui',
                                    fontSize: '15px',
                                    fontWeight: '400',
                                }}
                            >
                                Đến:
                            </span>
                            <input
                                ref={searchUserInputRef}
                                type="text"
                                id="inputFindParticipantID"
                                name="queryFindParticipant"
                                className="inputFindParticipant"
                                placeholder="Tìm kiếm người dùng..."
                                autoComplete="off"
                                autoFocus
                                spellCheck="false"
                                value={searchUserQuery}
                                onChange={handleSearchReferenceUserQueryChange}
                            />
                        </div>
                    </div>
                    <div className="middle">
                        {/* Search Reference User Result */}
                        {isShowSearchUserResult && !selectedUser && (
                            <ul
                                className="searchResultList"
                                style={{
                                    width: !selectedUser ? '' : '0px',
                                }}
                            >
                                {searchUserResult ? (
                                    <>
                                        {searchUserResult?.map((user) => (
                                            <>
                                                <li
                                                    className="searchResultItem"
                                                    onClick={() => {
                                                        handleSelectUser(user);
                                                    }}
                                                >
                                                    <div className="user">
                                                        <div className="avatarContainer">
                                                            <img
                                                                className="userAvatar"
                                                                src={
                                                                    user?.userAvatar
                                                                        ? env?.backend_url + user?.userAvatar
                                                                        : defaultAvatar
                                                                }
                                                                alt={`Hình đại diện của ${user?.userName}`}
                                                            />
                                                        </div>
                                                        <span className="userName">{user?.userName}</span>
                                                    </div>
                                                </li>
                                            </>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {/* Search Loading */}
                                        {/* <div
                                            style={{
                                                height: '45px',
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
                                        </div> */}
                                    </>
                                )}
                            </ul>
                        )}
                        {/* Selected User */}
                        {!!selectedUser && (
                            <div className="selectedUser">
                                <span className="title">Đến:</span>
                                <div className="user">
                                    <div className="avatarContainer">
                                        <img
                                            className="userAvatar"
                                            src={
                                                selectedUser?.userAvatar
                                                    ? env?.backend_url + selectedUser?.userAvatar
                                                    : defaultAvatar
                                            }
                                            alt={`Hình đại diện của ${selectedUser?.userName}`}
                                        />
                                    </div>
                                    <span className="userName">{selectedUser?.userName}</span>
                                    {/* Button Delete Selected User */}
                                    <div className="btnDeleteSelectedUserContainer">
                                        <button
                                            type="button"
                                            className="btnDeleteSelectedUser"
                                            onClick={() => {
                                                handleSelectedUser();
                                            }}
                                        >
                                            <IoClose />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bottom">
                        <span className="conversationType">Loại: DM</span>
                        {/* Btn Create */}
                        <button
                            type="button"
                            className="btnCreateNewConversation"
                            onClick={() => {
                                handleBtnCreateNewConversation();
                            }}
                            disabled={!selectedUser ? true : false}
                            style={{
                                opacity: !selectedUser ? '0.3' : '',
                                transform: !selectedUser ? 'scale(1)' : '',
                                background: !selectedUser ? '#ffffff' : '',
                                cursor: !selectedUser ? 'not-allowed' : '',
                            }}
                        >
                            <IoAdd /> Tạo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <span style={{ color: 'yellowgreen', fontFamily: 'system-ui', fontWeight: '400' }}>
                CreateNewConversationBox chưa được chuyền "type"
            </span>
        </>
    );
}

export default CreateNewConversationBox;

import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/auth.context';
import { getUserProfileInfoApi } from '~/utils/api';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { IoCloseSharp, IoSyncSharp } from 'react-icons/io5';

// Cache user data (Tạm thời chưa dùng, để cập nhật data mới nhất của user)
const userCache = {};

function UserTag({ children, userName, userTagData, typeUserTag, handleRemoveUserTag }) {
    // State
    const [show, setShow] = useState(false);
    // const [hoverInfoBox, setHoverInfoBox] = useState(false);
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [position, setPosition] = useState(); // tooltip position

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const userTagRef = useRef(null);
    const timeoutFetchUserRef = useRef(null);
    const userTagInfoBoxRef = useRef(null);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // --- HANDLE FUNCTION ---
    // Handle Fetch User
    const handleFetchUser = async () => {
        // Kiểm tra trong cache (CACHE)
        // if (userCache[userName]) {
        //     setUserData(userCache[userName]);
        //     return;
        // }
        // Set Loading true (bắt đầu load fetch user)
        setIsLoading(true);
        try {
            // Call API lấy user data theo username
            const res = await getUserProfileInfoApi(userName);
            // Set userCache (CACHE)
            // userCache[userName] = res?.data;
            // Set userData State
            setUserData(res?.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    // Handle Mouse Enter User Tag
    const handleMouseEnter = () => {
        // Set show true để hiện box thông tin
        if (!userData) {
            timeoutFetchUserRef.current = setTimeout(() => {
                handleFetchUser();
                setShow(true);
                // Xác định vị trí hiển thị
                setTimeout(() => {
                    if (userTagRef.current && userTagInfoBoxRef.current) {
                        const tagRect = userTagRef.current.getBoundingClientRect();
                        const tooltipRect = userTagInfoBoxRef.current.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        // const windowWidth = window.innerWidth;
                        if (tooltipRect.top > windowHeight / 2) {
                            setPosition('top');
                        } else {
                            setPosition('bottom');
                        }
                    }
                }, 0); // đảm bảo DOM đã render xong
            }, 350); // Delay 350ms
        } else {
            timeoutFetchUserRef.current = setTimeout(() => {
                setShow(true);
            }, 350); // Delay 350ms
        }
    };
    // Handle Mouse Leave User Tag
    const handleMouseLeave = () => {
        clearTimeout(timeoutFetchUserRef.current);
        // Set show false
        setShow(false);
    };
    // Handle Format Numeral (Hiển thị số người theo dõi)
    const formatNumeral = (count) => {
        if (count) {
            if (count >= 1000000) {
                return (count / 1000000).toFixed(1).replace('.0', '') + ' Tr'; // 1.5 Tr
            } else if (count >= 10000) {
                return (count / 1000).toFixed(1).replace('.0', '') + ' N'; // 1.5 N
            }
            return count.toString(); // Nếu nhỏ hơn 10000, giữ nguyên
        } else {
            return count;
        }
    };
    // Get user data
    useEffect(() => {
        // If typeUserTag === 'atCreatePlaylist'
        // if (typeUserTag === 'atCreatePlaylist') {
        //     handleFetchUser();
        // }
        // If typeUserTag === 'atPlaylistDetail'
        // if (typeUserTag === 'atPlaylistDetail') {
        //     handleFetchUser();
        // }
    }, [userName]);

    // typeUserTag === 'atCreatePlaylist'
    if (typeUserTag === 'atCreatePlaylist') {
        return (
            <>
                {/* Owner */}
                <button
                    className="btnOwner"
                    id={`btnOwnerID${userTagData?.userName}`}
                    type="button"
                    style={{
                        // opacity: '0.8',
                        background: '#171717',
                    }}
                    // disabled
                >
                    <img
                        src={
                            userTagData?.userAvatar
                                ? process.env.REACT_APP_BACKEND_URL + userTagData?.userAvatar
                                : defaultAvatar
                        }
                        draggable="false"
                    />{' '}
                    {userTagData?.userName}
                    <button
                        type="button"
                        className="btnDeleteUserTag"
                        onClick={() => {
                            handleRemoveUserTag(`@${userName}`);
                        }}
                    >
                        <IoCloseSharp />
                    </button>
                </button>
            </>
        );
    }

    // typeUserTag === 'atPlaylistDetail'
    if (typeUserTag === 'atPlaylistDetail') {
        return (
            <button
                className="btnOwner"
                type="button"
                onClick={() => {
                    navigate(`/profile/${userTagData?.userName}`);
                }}
            >
                <img
                    src={
                        userTagData?.userAvatar
                            ? process.env.REACT_APP_BACKEND_URL + userTagData?.userAvatar
                            : defaultAvatar
                    }
                />{' '}
                {userTagData?.userName}
            </button>
        );
    }

    // Kiểu user tag mặc định
    return (
        <div className="userTagContainer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link ref={userTagRef} to={`/profile/${userName}`} className="userTag">
                {children}
            </Link>
            {/* Render Show User Tag Info */}
            {show && (
                <div
                    className="userTagInfoBox"
                    ref={userTagInfoBoxRef}
                    style={{
                        bottom: position === 'top' ? '100%' : 'auto',
                    }}
                >
                    {/* Loading... */}
                    {/* {isLoading && <>Loading...</>} */}
                    {/* Thông tin User */}
                    {userData ? (
                        <>
                            <Link to={`/profile/${userName}`} style={{ textDecoration: 'none' }}>
                                <div className="top">
                                    <div className="userInfo">
                                        <span className="name">{userData?.user?.name}</span>
                                        <span className="userName">{userData?.user?.userName}</span>
                                    </div>
                                    <img
                                        className="userAvatar"
                                        src={
                                            userData?.user?.userAvatar
                                                ? process.env.REACT_APP_BACKEND_URL + userData?.user?.userAvatar
                                                : defaultAvatar
                                        }
                                    />
                                </div>
                            </Link>
                            <div className="middle">
                                <span className="description">{userData?.user?.description}</span>
                                <span className="followers">
                                    {formatNumeral(userData?.follower?.count)} người theo dõi
                                </span>
                            </div>
                            <div className="bottom">
                                {/* Render nút theo dõi */}
                                {userData?.user?.userName !== auth?.user?.userName && (
                                    <button className={`${userData?.followStatus ? 'btnFollowed' : 'btnFollow'}`}>
                                        {userData?.followStatus ? 'Đang theo dõi' : 'Theo dõi'}
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div
                            style={{
                                width: '230px',
                                textAlign: 'center',
                                padding: '0px',
                            }}
                        >
                            <IoSyncSharp
                                className="loadingAnimation"
                                style={{ color: 'white', width: '15px', height: '15px' }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserTag;

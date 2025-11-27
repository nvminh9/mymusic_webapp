import { useContext, useRef, useState } from 'react';
import { IoSyncSharp } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { AuthContext } from '~/context/auth.context';
import { EnvContext } from '~/context/env.context';
import { getUserProfileInfoApi } from '~/utils/api';

// Cache user data (Tạm thời chưa dùng, vì muốn cập nhật data mới nhất của user)
const userCache = {};

function UserName({ userName }) {
    // State
    const [show, setShow] = useState(false);
    // const [hoverInfoBox, setHoverInfoBox] = useState(false);
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [position, setPosition] = useState(); // tooltip position

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // Ref
    const timeoutFetchUserRef = useRef(null);
    const userNameRef = useRef(null);
    const userNameInfoBoxRef = useRef(null);

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
                    if (userNameRef.current && userNameInfoBoxRef.current) {
                        const tagRect = userNameRef.current.getBoundingClientRect();
                        const tooltipRect = userNameInfoBoxRef.current.getBoundingClientRect();
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

    return (
        <div className="userTagContainer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link to={`/profile/${userName}`} style={{ textDecoration: 'none' }} ref={userNameRef}>
                <span className="userName">{userName}</span>
            </Link>
            {/* Render Show User Tag Info */}
            {show && (
                <div
                    className="userTagInfoBox"
                    ref={userNameInfoBoxRef}
                    style={{
                        bottom: position === 'top' ? '100%' : 'auto',
                    }}
                >
                    {/* Thông tin User */}
                    {userData ? (
                        <>
                            <Link to={`/profile/${userName}`} style={{ textDecoration: 'none' }}>
                                <div className="top">
                                    <div className="userInfo">
                                        <span className="name">{userData?.user?.name}</span>
                                        <span className="userName" style={{ fontWeight: '300' }}>
                                            {userData?.user?.userName}
                                        </span>
                                    </div>
                                    <img
                                        className="userAvatar"
                                        src={
                                            userData?.user?.userAvatar
                                                ? env?.backend_url + userData?.user?.userAvatar
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
                                {/* {userData?.user?.userName !== auth?.user?.userName && (
                                    <button className={`${userData?.followStatus ? 'btnFollowed' : 'btnFollow'}`}>
                                        {userData?.followStatus ? 'Đang theo dõi' : 'Theo dõi'}
                                    </button>
                                )} */}
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
                            {/* Loading... */}
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

export default UserName;

import { useContext, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/auth.context';
import { getUserProfileInfoApi } from '~/utils/api';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { IoSyncSharp } from 'react-icons/io5';

// Cache user data (Tạm thời chưa dùng, để cập nhật data mới nhất của user)
const userCache = {};

function UserTag({ children, userName }) {
    // State
    const [show, setShow] = useState(false);
    // const [hoverInfoBox, setHoverInfoBox] = useState(false);
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(false);

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const userTagRef = useRef(null);
    const timeoutFetchUserRef = useRef(null);

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
        setShow(true);
        if (!userData) {
            timeoutFetchUserRef.current = setTimeout(() => {
                handleFetchUser();
            }, 300); // Delay 300ms
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
            <Link ref={userTagRef} to={`/profile/${userName}`} className="userTag">
                {children}
            </Link>
            {/* Render Show User Tag Info */}
            {show && (
                <div className="userTagInfoBox">
                    {/* Loading... */}
                    {/* {isLoading && <>Loading...</>} */}
                    {/* Thông tin User */}
                    {userData ? (
                        <>
                            <div className="top">
                                <div className="userInfo">
                                    <span className="name">{userData?.user?.name}</span>
                                    <span className="userName">{userData?.user?.userName}</span>
                                </div>
                                <Link to={`/profile/${userName}`}>
                                    <img
                                        className="userAvatar"
                                        src={
                                            userData?.user?.userAvatar
                                                ? process.env.REACT_APP_BACKEND_URL + userData?.user?.userAvatar
                                                : defaultAvatar
                                        }
                                    />
                                </Link>
                            </div>
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

import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { VscChevronLeft } from 'react-icons/vsc';
import {
    IoEllipsisHorizontalSharp,
    IoMusicalNotesSharp,
    IoAppsSharp,
    IoChevronDownSharp,
    IoSyncSharp,
    IoAddSharp,
    IoImagesOutline,
    IoMusicalNotesOutline,
    IoCloseSharp,
    IoListOutline,
} from 'react-icons/io5';
import { AuthContext } from '~/context/auth.context';
import {
    createConversationApi,
    createFollowUserApi,
    getFollowersApi,
    getUserProfileInfoApi,
    signOutApi,
    unfollowUserApi,
} from '~/utils/api';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { message } from 'antd';
import ArticleProfile from '../components/ArticleProfile';
import { EnvContext } from '~/context/env.context';
import { RiPlayListFill } from 'react-icons/ri';

function ProfilePage() {
    // State (useState)
    const [isOpenSettingMenu, setIsOpenSettingMenu] = useState(false); // State đóng/mở menu cài đặt
    const [isOpenFollowSetting, setIsOpenFollowSetting] = useState(false); // State đóng/mở menu theo dõi (nút đang theo dõi)
    const [isOpenCreateMenu, setIsOpenCreateMenu] = useState(false); // State đóng/mở menu tạo bài viết/nhạc
    const [profileInfo, setProfileInfo] = useState(); // Profile data
    const [isFollowed, setIsFollowed] = useState(); // For Loading Follow Animation

    // Context (useContext)
    // auth là object, trong đó có thuộc tính user chứa thông tin của user auth
    const { auth, setAuth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // Ref
    const followersTotal = useRef();
    const createMenuRef = useRef(null);
    const followingSettingRef = useRef(null);
    const settingMenuRef = useRef(null);

    // Chuyển Tab
    const location = useLocation();
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---
    // Handle Switch Tab Content
    const handleBtnToArticle = () => {
        console.log('Loaded list article');
        console.log(location.pathname);
        // document.getElementById('btnToArticleID').classList.add('actived');
        // document.getElementById('btnToMusicID').classList.remove('actived');
    };
    const handleBtnToMusic = () => {
        console.log('Loaded list music in profile');
        console.log(location.pathname);
        // document.getElementById('btnToMusicID').classList.add('actived');
        // document.getElementById('btnToArticleID').classList.remove('actived');
    };
    // Handle Sign Out
    const handleSignOut = async () => {
        // const token = localStorage?.getItem('actk');
        try {
            // Call API Sign Out
            const res = await signOutApi();
            if (res.message === 'Đăng xuất thành công') {
                // Set Auth Context For Sign Out
                setAuth({
                    isAuthenticated: false,
                    user: {},
                });
                // Clear token in local storage
                localStorage.clear('actk');
                localStorage.clear('valid');
                console.log('Đăng xuất thành công !');
                // Chuyển sang trang đăng nhập
                navigate('/signin');
            } else {
                console.log('Đăng xuất thất bại !');
            }
        } catch (error) {
            console.log('>>> Error Sign Out: ', error);
            return;
        }
    };
    // Handle Format Numeral
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
    // Handle Follow User
    const handleFollowUser = async () => {
        try {
            // Loading Follow Handle
            setIsFollowed('pending');
            // userName của profile (của user được theo dõi)
            const userName = location.pathname.split('/')[2];
            // Call API
            setTimeout(async () => {
                const res = await createFollowUserApi(userName);
                // Kiểm tra response
                if (res?.data !== null) {
                    console.log('Theo dõi người dùng thành công');
                    setProfileInfo({ ...profileInfo, followStatus: true });
                    console.log('profileInfo change: ', profileInfo);
                    setIsFollowed('success');
                    // Tăng số lượng follower hiển thị (+1)
                    let followersTotalChange = followersTotal.current.getHTML() - 0 + 1;
                    followersTotal.current.innerHTML = followersTotalChange;
                    return;
                } else {
                    console.log('Theo dõi người dùng không thành công');
                    setProfileInfo({ ...profileInfo, followStatus: false });
                    console.log('profileInfo change: ', profileInfo);
                    setIsFollowed('fail');
                    message.error({
                        content: 'Theo dõi người dùng không thành công',
                        duration: 1.5,
                    });
                    return;
                }
            }, 1000);
        } catch (error) {
            console.log('>>> Error Sign Out: ', error);
            setIsFollowed('fail');
            message.error({
                content: 'Theo dõi người dùng không thành công',
                duration: 1.5,
            });
            return;
        }
    };
    // Handle Unfollow User
    const handleUnfollowUser = async () => {
        try {
            // Đóng Menu Follow Setting
            setIsOpenFollowSetting(false);
            // Loading Follow Handle
            setIsFollowed('pending');
            // userName của profile (của user được theo dõi)
            const userName = location.pathname.split('/')[2];
            // Call API Hủy theo dõi
            setTimeout(async () => {
                const res = await unfollowUserApi(userName);
                // Kiểm tra response
                if (res?.data === true) {
                    console.log('Hủy theo dõi người dùng thành công');
                    setProfileInfo({ ...profileInfo, followStatus: false });
                    setIsFollowed('fail');
                    // Giảm số lượng follower hiển thị (-1)
                    let followersTotalChange = followersTotal.current.getHTML() - 0 - 1;
                    followersTotal.current.innerHTML = followersTotalChange;
                    return;
                } else {
                    console.log('Hủy theo dõi người dùng không thành công');
                    setIsFollowed('success');
                    setProfileInfo({ ...profileInfo, followStatus: true });
                    message.error({
                        content: 'Hủy theo dõi người dùng không thành công',
                        duration: 1.5,
                    });
                    return;
                }
            }, 1000);
        } catch (error) {
            console.log('>>> Error Sign Out: ', error);
            setIsFollowed('success');
            message.error({
                content: 'Hủy theo dõi người dùng không thành công',
                duration: 1.5,
            });
            return;
        }
    };
    // Handle Button Message
    const handleBtnMessage = async (e) => {
        //
        try {
            // Call API tạo conversation
            // Payload: { type: 'dm' || 'group', participantIds: ['781ac2b1a24',...], title: '', avatar: '' }
            const res = await createConversationApi({
                type: 'dm',
                participantIds: JSON.stringify([`${auth?.user?.userId}`, `${profileInfo?.user?.userId}`]),
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
    };
    // Handle Call API Profile Data
    useEffect(() => {
        // Đổi title trang
        document.title = 'Profile | mymusic: Music from everyone';
        console.log('>>> auth: ', auth);
        console.log('>>> location: ', location);
        // Đóng Menu Follow Setting
        setIsOpenFollowSetting(false);
        // userName của trang profile đó
        const userName = location.pathname.split('/')[2];
        // Call API Lấy thông tin profile (API Get User Profile)
        const getUserProfileInfo = async (userName) => {
            try {
                const res = await getUserProfileInfoApi(userName);
                if (res?.status === 200) {
                    // console.log('Thông tin profile: ', res?.data);
                    // setTimeout(() => {
                    //     setProfileInfo(res?.data);
                    // }, 200);
                    setProfileInfo(res?.data);
                    // console.log('Check: ', typeof profileInfo.followStatus);
                    // Set document title
                    document.title = `${res?.data?.user?.name} (${res?.data?.user?.userName})`;
                } else if (res?.status === 404) {
                    // console.log('Lấy thông tin profile thất bại !');
                    setProfileInfo({
                        userNotExist: true,
                    });
                }
                // console.log('Check: ', typeof profileInfo.followStatus);
            } catch (error) {
                console.log(error);
            }
        };
        getUserProfileInfo(userName);
    }, [location.pathname.split('/')[2]]);
    // Handle Click Outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Click outside create menu
            if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
                setIsOpenCreateMenu(false);
            }
            // Click outside follow setting
            if (followingSettingRef.current && !followingSettingRef.current.contains(event.target)) {
                setIsOpenFollowSetting(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Handle Click Outside To Close
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Click outside settingMenuRef
            if (settingMenuRef.current && !settingMenuRef.current.contains(event.target)) {
                setIsOpenSettingMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // console.log(auth);

    return (
        <Fragment>
            {/* Menu Setting */}
            {isOpenSettingMenu === true && auth?.user?.userName === location.pathname.split('/')[2] ? (
                <div className="settingMenuContainer">
                    <div ref={settingMenuRef} className="settingMenu">
                        <span className="title">Cài đặt</span>
                        <button
                            id="btnSignOutID"
                            className="btnSignOut"
                            onClick={() => {
                                handleSignOut();
                            }}
                            style={{ marginBottom: '8px' }}
                        >
                            Đăng xuất
                        </button>
                        <button
                            id="btnCloseID"
                            className="btnClose"
                            onClick={() => {
                                setIsOpenSettingMenu(false);
                            }}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
            {/* Menu Follow Setting */}
            {isOpenFollowSetting === true && location.pathname.split('/')[2] === profileInfo?.user?.userName ? (
                <div className="settingMenuContainer">
                    <div ref={followingSettingRef} className="settingMenu">
                        <span
                            className="title"
                            style={{
                                display: 'grid',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <div style={{ padding: '3px' }}>
                                <img
                                    src={
                                        profileInfo?.user?.userAvatar
                                            ? env?.backend_url + profileInfo?.user?.userAvatar
                                            : defaultAvatar
                                    }
                                    style={{
                                        width: '55px',
                                        height: '55px',
                                        borderRadius: '50%',
                                        objectPosition: 'center',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                            <span>{profileInfo?.user?.userName ? profileInfo?.user?.userName : 'Tên người dùng'}</span>
                        </span>
                        <button
                            id="btnSignOutID"
                            className="btnSignOut"
                            onClick={() => {
                                handleUnfollowUser();
                            }}
                            style={{ marginBottom: '8px' }}
                        >
                            Bỏ theo dõi
                        </button>
                        <button
                            id="btnCloseID"
                            className="btnClose"
                            onClick={() => {
                                setIsOpenFollowSetting(false);
                            }}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
            {/* Menu Tạo bài viết / nhạc */}
            {isOpenCreateMenu === true && auth?.user?.userName === location.pathname.split('/')[2] ? (
                <div className="settingMenuContainer">
                    <div ref={createMenuRef} className="settingMenu">
                        <span className="title" style={{ position: 'relative' }}>
                            <span>Tạo</span>
                            {/* Nút thoát */}
                            <button
                                className=""
                                style={{
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '5px',
                                    top: '0',
                                    right: '0',
                                }}
                                onClick={() => {
                                    setIsOpenCreateMenu(false);
                                }}
                            >
                                <IoCloseSharp />
                            </button>
                        </span>
                        {/* Nút tạo bài viết */}
                        <button
                            id="btnSignOutID"
                            className="btnSignOut"
                            onClick={() => {
                                navigate(`/article/upload`);
                                setIsOpenCreateMenu(false);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                // padding: '10px 105px',
                                gap: '10px',
                            }}
                        >
                            <IoImagesOutline /> Bài viết
                        </button>
                        {/* Nút tạo nhạc */}
                        <button
                            id="btnSignOutID"
                            className="btnSignOut"
                            onClick={() => {
                                navigate(`/music/upload`);
                                setIsOpenCreateMenu(false);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                // padding: '10px 105px',
                                gap: '10px',
                                margin: '5px',
                                marginTop: '8px',
                                marginBottom: '0px',
                            }}
                        >
                            <IoMusicalNotesOutline /> Nhạc
                        </button>
                        {/* Nút tạo nhạc */}
                        <button
                            id="btnSignOutID"
                            className="btnSignOut"
                            onClick={() => {
                                navigate(`/playlist/create`);
                                setIsOpenCreateMenu(false);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                // padding: '10px 105px',
                                gap: '10px',
                                margin: '8px 5px',
                                // marginTop: '8px',
                            }}
                        >
                            <RiPlayListFill /> Danh sách phát
                        </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
            {/* Thanh chuyển tab */}
            <div className="tabSwitchProfile">
                <div className="profileUserName">
                    <span>{profileInfo?.user?.userName ?? ``}</span>
                </div>
                <div className="btnComeBackBox">
                    <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                        <VscChevronLeft />
                        <span class="tooltiptext">Quay lại</span>
                    </button>
                </div>
            </div>
            {/* Tài khoản người dùng không tồn tại */}
            {profileInfo?.userNotExist === true ? (
                <>
                    <span
                        style={{
                            color: 'white',
                            fontSize: '17px',
                            fontWeight: '500',
                            fontFamily: 'sans-serif',
                            textAlign: 'center',
                            display: 'block',
                            width: '100%',
                            padding: '50px 0px',
                        }}
                    >
                        Người dùng này không tồn tại
                    </span>
                </>
            ) : (
                <>
                    {/* Profile */}
                    {profileInfo ? (
                        <div className="profilePage">
                            {/* Phần top của profile */}
                            <div className="top">
                                <div className="left">
                                    {/* Avatar */}
                                    <div className="avatar">
                                        <img
                                            src={
                                                profileInfo?.user?.userAvatar
                                                    ? env?.backend_url + profileInfo?.user?.userAvatar
                                                    : defaultAvatar
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="topRight">
                                        {/* Thông tin (tên,...) */}
                                        <div className="userInfo">
                                            <span className="userName">
                                                {profileInfo?.user?.userName || 'userName'}
                                            </span>
                                            <div className="btnBox">
                                                {auth?.user?.userName === location.pathname.split('/')[2] ? (
                                                    <>
                                                        {/* Nút chỉnh sửa trang cá nhân */}
                                                        <button
                                                            className="btnFollow"
                                                            onClick={() => {
                                                                navigate(`/profile/${auth?.user?.userName}/edit`);
                                                            }}
                                                        >
                                                            Chỉnh sửa trang cá nhân
                                                        </button>
                                                        {/* Nút tạo bài viết/nhạc */}
                                                        <button
                                                            className="btnCreate"
                                                            onClick={() => {
                                                                setIsOpenCreateMenu(true);
                                                            }}
                                                        >
                                                            Tạo <IoAddSharp style={{ marginLeft: '5px' }} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Render nút theo dõi */}
                                                        {profileInfo?.followStatus === true ? (
                                                            <button
                                                                className="btnFollowed"
                                                                onClick={() => {
                                                                    console.log('setIsOpenFollowSetting true');
                                                                    setIsOpenFollowSetting(true);
                                                                }}
                                                            >
                                                                {isFollowed === 'pending' ? (
                                                                    <>
                                                                        <div
                                                                            style={{
                                                                                width: '15px',
                                                                                height: '15px',
                                                                                display: 'flex',
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                            }}
                                                                        >
                                                                            <IoSyncSharp
                                                                                className="loadingAnimation"
                                                                                style={{ color: 'white' }}
                                                                            />
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        Đang theo dõi{' '}
                                                                        <IoChevronDownSharp
                                                                            style={{ marginLeft: '5px' }}
                                                                        />
                                                                    </>
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btnFollow"
                                                                onClick={() => {
                                                                    handleFollowUser();
                                                                }}
                                                            >
                                                                {isFollowed === 'pending' ? (
                                                                    <>
                                                                        <div
                                                                            style={{
                                                                                width: '15px',
                                                                                height: '15px',
                                                                                display: 'flex',
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                            }}
                                                                        >
                                                                            <IoSyncSharp
                                                                                className="loadingAnimation"
                                                                                style={{ color: '#000' }}
                                                                            />
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>Theo dõi</>
                                                                )}
                                                            </button>
                                                        )}
                                                        {/* Nút nhắn tin */}
                                                        <button className="btnMessage" onClick={handleBtnMessage}>
                                                            Nhắn tin
                                                        </button>
                                                    </>
                                                )}
                                                {/* Menu của profile cá nhân của mình */}
                                                {auth?.user?.userName === location.pathname.split('/')[2] ? (
                                                    <button
                                                        className="btnOptions"
                                                        onClick={() => {
                                                            setIsOpenSettingMenu(true);
                                                        }}
                                                    >
                                                        <IoEllipsisHorizontalSharp></IoEllipsisHorizontalSharp>
                                                    </button>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="middleRight">
                                        {/* Chỉ số (số bài viết, người theo dõi, đang theo dõi,...) */}
                                        <div className="userNumeral">
                                            <span className="articles">
                                                <span
                                                    style={{
                                                        fontWeight: '600',
                                                        color: '#ffffff',
                                                    }}
                                                >
                                                    {profileInfo?.articles.length || 0}
                                                </span>{' '}
                                                bài viết
                                            </span>
                                            <span
                                                className="followers"
                                                onClick={() => {
                                                    navigate(`followers`);
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontWeight: '600',
                                                        color: '#ffffff',
                                                    }}
                                                    id="followersTotalID"
                                                    ref={followersTotal}
                                                >
                                                    {profileInfo?.follower?.count
                                                        ? formatNumeral(profileInfo?.follower?.count)
                                                        : 0}
                                                </span>{' '}
                                                người theo dõi
                                            </span>
                                            <span
                                                className="following"
                                                onClick={() => {
                                                    navigate(`following`);
                                                }}
                                            >
                                                Đang theo dõi{' '}
                                                <span
                                                    style={{
                                                        fontWeight: '600',
                                                        color: '#ffffff',
                                                    }}
                                                >
                                                    {profileInfo?.follow?.count
                                                        ? formatNumeral(profileInfo?.follow?.count)
                                                        : 0}
                                                </span>{' '}
                                                người dùng
                                            </span>
                                        </div>
                                        <div className="userDescription">
                                            <p>
                                                {/* Kendrick Lamar <br /> @pglang <br />{' '}
                                    <a
                                        href="https://my-gnx.com"
                                        style={{
                                            color: 'whitesmoke',
                                        }}
                                        target="_blank"
                                    >
                                        my-gnx.com
                                    </a> */}
                                                {profileInfo?.user?.description}
                                            </p>
                                        </div>
                                        <div className="bottomRight"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Phần middle của profile */}
                            <div className="middle">
                                {/* Phần gợi ý người dùng liên quan (chỉ hiện lên khi follow người dùng,...) */}
                                <div className="userSuggest"></div>
                            </div>
                            {/* Phần bottom của profile */}
                            <div className="bottom">
                                {/* Thanh switch bar đổi nội dung hiển thị */}
                                <div className="switchBar">
                                    <Link
                                        to={``}
                                        id="btnToArticleID"
                                        className={[
                                            'btnToArticle',
                                            location.pathname.split('/')[3] === 'musics' ? '' : 'actived',
                                        ].join(' ')}
                                        onClick={handleBtnToArticle}
                                    >
                                        <IoAppsSharp style={{ marginRight: '5px' }}></IoAppsSharp> BÀI VIẾT
                                    </Link>
                                    <Link
                                        to={`musics`}
                                        id="btnToMusicID"
                                        className={[
                                            'btnToMusic',
                                            location.pathname.split('/')[3] === 'musics' ? 'actived' : '',
                                        ].join(' ')}
                                        onClick={handleBtnToMusic}
                                    >
                                        <IoMusicalNotesSharp style={{ marginRight: '5px' }}></IoMusicalNotesSharp> ÂM
                                        NHẠC
                                    </Link>
                                </div>
                                {/* Nội dung */}
                                <div className="main">
                                    {/* Nếu route là .../musics thì sẽ ko hiển thị danh sách articles */}
                                    {location.pathname.split('/')[3] === 'musics' ? (
                                        <></>
                                    ) : (
                                        <>
                                            <div className="listArticle">
                                                {/* List Articles */}
                                                <div className="row">
                                                    {profileInfo?.articles?.length === 0 ? (
                                                        <>
                                                            <span
                                                                style={{
                                                                    color: 'rgba(255, 255, 255, 0.64)',
                                                                    fontSize: '17px',
                                                                    fontWeight: '500',
                                                                    fontFamily: 'sans-serif',
                                                                    textAlign: 'center',
                                                                    display: 'block',
                                                                    width: '100%',
                                                                    padding: '50px 0px',
                                                                }}
                                                            >
                                                                Chưa có bài viết
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {profileInfo?.articles ? (
                                                                <>
                                                                    {profileInfo?.articles.map((article, index) => (
                                                                        <>
                                                                            {/* Article */}
                                                                            <ArticleProfile
                                                                                key={index}
                                                                                article={article}
                                                                                user={profileInfo?.user}
                                                                            />
                                                                        </>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            marginTop: '50px',
                                                                        }}
                                                                    >
                                                                        <IoSyncSharp className="loadingAnimation" />
                                                                    </div>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '30px 0px',
                            }}
                        >
                            <IoSyncSharp
                                className="loadingAnimation"
                                style={{ color: 'white', width: '19px', height: '19px' }}
                            />
                        </div>
                    )}
                </>
            )}
        </Fragment>
    );
}

export default ProfilePage;

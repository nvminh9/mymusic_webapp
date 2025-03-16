import { Fragment, useContext, useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { VscChevronLeft } from 'react-icons/vsc';
import { IoEllipsisHorizontalSharp, IoMusicalNotesSharp, IoAppsSharp } from 'react-icons/io5';
import { AuthContext } from '~/context/auth.context';
import { getUserProfileInfoApi, signOutApi } from '~/utils/api';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';

function ProfilePage() {
    // State (useState)
    const [isOpenSettingMenu, setIsOpenSettingMenu] = useState(false);
    const [profileInfo, setProfileInfo] = useState();

    // Context (useContext)
    // auth là object, trong đó có thuộc tính user chứa thông tin của user auth
    const { auth, setAuth } = useContext(AuthContext);

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
    // Handle Call API
    useEffect(() => {
        // Đổi title trang
        document.title = 'Profile | mymusic: Music from everyone';
        console.log('>>> auth: ', auth);
        console.log('>>> location: ', location);
        // userName của trang profile đó
        const userName = location.pathname.split('/')[2];
        // Call API Lấy thông tin profile
        const getUserProfileInfo = async (userName) => {
            try {
                const res = await getUserProfileInfoApi(userName);
                if (res) {
                    // console.log("Thông tin profile: ", res?.data);
                    setProfileInfo(res?.data);
                } else {
                    // console.log("Lấy thông tin profile thất bại !")
                    setProfileInfo({});
                }
            } catch (error) {
                console.log(error);
            }
        };
        getUserProfileInfo(userName);
    }, [location.pathname.split('/')[2]]);

    return (
        <Fragment>
            {/* Menu Setting */}
            {isOpenSettingMenu ? (
                <div className="settingMenuContainer">
                    <div className="settingMenu">
                        <span className="title">Cài đặt hồ sơ</span>
                        <button
                            id="btnSignOutID"
                            className="btnSignOut"
                            onClick={() => {
                                handleSignOut();
                            }}
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

            {/* Thanh chuyển tab */}
            <div className="tabSwitchProfile">
                <div className="profileUserName">
                    <span>{auth?.user?.userName ?? `Tên người dùng`}</span>
                </div>
                <div className="btnComeBackBox">
                    <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                        <VscChevronLeft />
                        <span class="tooltiptext">Quay lại</span>
                    </button>
                </div>
            </div>
            <div className="profilePage">
                {/* Phần top của profile */}
                <div className="top">
                    <div className="left">
                        {/* Avatar */}
                        <div className="avatar">
                            <img src={auth?.user?.userAvatar ?? defaultAvatar} />
                        </div>
                    </div>
                    <div className="right">
                        <div className="topRight">
                            {/* Thông tin (tên,...) */}
                            <div className="userInfo">
                                <span className="userName">{auth?.user?.userName ?? 'Tên người dùng'}</span>
                                <div className="btnBox">
                                    {auth?.user?.userName === location.pathname.split('/')[2] ? (
                                        <>
                                            {/* Nút chỉnh sửa trang cá nhân */}
                                            <button className="btnFollow">Chỉnh sửa trang cá nhân</button>
                                        </>
                                    ) : (
                                        <>
                                            {/* Nút theo dõi */}
                                            <button className="btnFollow">Theo dõi</button>
                                            {/* Nút nhắn tin */}
                                            <button className="btnMessage">Nhắn tin</button>
                                        </>
                                    )}

                                    <button
                                        className="btnOptions"
                                        onClick={() => {
                                            setIsOpenSettingMenu(true);
                                        }}
                                    >
                                        <IoEllipsisHorizontalSharp></IoEllipsisHorizontalSharp>
                                    </button>
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
                                        }}
                                    >
                                        {profileInfo?.articles?.count}
                                    </span>{' '}
                                    bài viết
                                </span>
                                <span
                                    className="followers"
                                    onClick={() => {
                                        alert('17,4 triệu người theo dõi');
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: '600',
                                        }}
                                    >
                                        {formatNumeral(profileInfo?.follower?.count)}
                                    </span>{' '}
                                    người theo dõi
                                </span>
                                <span
                                    className="following"
                                    onClick={() => {
                                        alert('Đang theo dõi 1 người dùng');
                                    }}
                                >
                                    Đang theo dõi{' '}
                                    <span
                                        style={{
                                            fontWeight: '600',
                                        }}
                                    >
                                        {formatNumeral(profileInfo?.follow?.count)}
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
                                    {auth?.user?.description}
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
                                location.pathname === '/profile/kendricklamar' ? 'actived' : '',
                            ].join(' ')}
                            onClick={handleBtnToArticle}
                        >
                            <IoAppsSharp style={{ marginRight: '5px' }}></IoAppsSharp> BÀI VIẾT
                        </Link>
                        <Link
                            to={`musics`}
                            id="btnToMusicID"
                            // Tạm test với pathname là /profile/kendricklamar/musics sau này sẽ thay kendricklamar bằng userName từ api
                            className={[
                                'btnToMusic',
                                location.pathname === '/profile/kendricklamar/musics' ? 'actived' : '',
                            ].join(' ')}
                            onClick={handleBtnToMusic}
                        >
                            <IoMusicalNotesSharp style={{ marginRight: '5px' }}></IoMusicalNotesSharp> ÂM NHẠC
                        </Link>
                    </div>
                    {/* Nội dung */}
                    <div className="main">
                        <Outlet />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default ProfilePage;

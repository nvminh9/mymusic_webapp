import { Fragment, useContext, useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { VscChevronLeft } from 'react-icons/vsc';
import { IoEllipsisHorizontalSharp, IoMusicalNotesSharp, IoAppsSharp } from 'react-icons/io5';
import { AuthContext } from '~/context/auth.context';
import { signOutApi } from '~/utils/api';

function ProfilePage() {
    // State (useState)
    const [isOpenSettingMenu, setIsOpenSettingMenu] = useState(false);

    // Context (useContext)
    const { auth } = useContext(AuthContext);

    // Chuyển Tab
    const location = useLocation();
    const navigate = useNavigate();

    // Đổi title trang
    useEffect(() => {
        document.title = 'Profile | mymusic: Music from everyone';
        console.log('>>> auth: ', auth);
    }, []);

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
                localStorage.clear('actk');
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
                            <img src="https://cdn-images.dzcdn.net/images/artist/be0a7c550567f4af0ed202d7235b74d6/1900x1900-000000-80-0-0.jpg" />
                        </div>
                    </div>
                    <div className="right">
                        <div className="topRight">
                            {/* Thông tin (tên,...) */}
                            <div className="userInfo">
                                <span className="userName">kendricklamar</span>
                                <div className="btnBox">
                                    <button className="btnFollow">Theo dõi</button>
                                    <button className="btnMessage">Nhắn tin</button>
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
                                        6
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
                                        17,4 Tr
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
                                        1
                                    </span>{' '}
                                    người dùng
                                </span>
                            </div>
                            <div className="userDescription">
                                <p>
                                    Kendrick Lamar <br /> @pglang <br />{' '}
                                    <a
                                        href="https://my-gnx.com"
                                        style={{
                                            color: 'whitesmoke',
                                        }}
                                        target="_blank"
                                    >
                                        my-gnx.com
                                    </a>
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

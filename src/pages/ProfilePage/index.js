import { Fragment, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { VscChevronLeft } from 'react-icons/vsc';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';

function ProfilePage() {
    // Chuyển Tab
    const location = useLocation();
    const navigate = useNavigate();

    // Đổi title trang
    useEffect(() => {
        document.title = 'Profile | mymusic: Music from everyone';
    }, []);

    return (
        <Fragment>
            {/* Thanh chuyển tab */}
            <div className="tabSwitchProfile">
                <div className="profileUserName">
                    <span>kendricklamar</span>
                </div>
                <div className="btnComeBackBox">
                    <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                        <VscChevronLeft />
                        <span class="tooltiptext">Quay lại</span>
                    </button>
                </div>
            </div>
            <div className="profilePage">
                <div className="top">
                    <div className="left">
                        {/* Avatar */}
                        <div className="avatar">
                            <img src="https://cdn-images.dzcdn.net/images/artist/be0a7c550567f4af0ed202d7235b74d6/1900x1900-000000-80-0-0.jpg" />
                        </div>
                    </div>
                    <div className="right">
                        <div className="top">
                            <div className="userInfo">
                                <span className="userName">kendricklamar</span>
                                <div className="btnBox">
                                    <button className="btnFollow">Theo dõi</button>
                                    <button className="btnMessage">Nhắn tin</button>
                                    <button className="btnOptions">
                                        <IoEllipsisHorizontalSharp></IoEllipsisHorizontalSharp>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="middle">
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
                            <div className="bottom"></div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default ProfilePage;

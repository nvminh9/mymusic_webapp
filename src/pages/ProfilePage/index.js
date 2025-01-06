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
                                <button className="btnFollow">Theo dõi</button>
                                <button className="btnOptions">
                                    <IoEllipsisHorizontalSharp></IoEllipsisHorizontalSharp>
                                </button>
                            </div>
                        </div>
                        <div className="middle">
                            <div className="userNumeral">
                                <span className="articles">
                                    <b>6</b> bài viết
                                </span>
                                <span className="followers">
                                    <b>17,4 Tr</b> người theo dõi
                                </span>
                                <span className="following">
                                    Đang theo dõi <b>1</b> người dùng
                                </span>
                            </div>
                            <div className="userDescription">
                                <p>
                                    Kendrick Lamar <br /> @pglang <br /> my-gnx.com
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

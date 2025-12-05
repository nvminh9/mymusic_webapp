import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useRef, useState } from 'react';
import {
    IoAdd,
    IoAddOutline,
    IoChatbubble,
    IoChatbubbleOutline,
    IoChevronBackSharp,
    IoClose,
    IoCloseOutline,
    IoEllipsisVertical,
    IoExpandSharp,
    IoHome,
    IoHomeOutline,
    IoHomeSharp,
    IoImagesOutline,
    IoMusicalNotesOutline,
    IoSearch,
    IoSearchOutline,
} from 'react-icons/io5';
import { VscChevronLeft } from 'react-icons/vsc';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '~/context/auth.context';
import { getConversationsApi } from '~/utils/api';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { EnvContext } from '~/context/env.context';
import { RiPlayListFill } from 'react-icons/ri';
import { set } from 'lodash';
import MusicPlayer from '~/pages/components/MusicPlayer';

function MiddleContainer({ children }) {
    // State
    const [isExpandMenu, setIsExpandMenu] = useState(false);
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [isOpenUploadOptionsBox, setIsOpenUploadOptionsBox] = useState(false);

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // Ref
    const bottomNavigationBarRef = useRef(null);
    const btnUploadRef = useRef(null);
    const uploadOptionsRef = useRef(null);

    // React Query
    // Prefetch Conversation List (Chưa phân trang)
    const {
        data: conversationList,
        isLoading,
        status,
    } = useQuery({
        queryKey: ['conversationList'],
        queryFn: async () => {
            const res = await getConversationsApi(); // { status, message, data }
            return res.data;
        },
        enabled: true,
        refetchOnWindowFocus: true,
        // staleTime: 1000 * 60, // Cần refetch sau 1 phút (có thể sẽ điều chỉnh lại thành lâu hơn)
    });

    // Chuyển Tab
    const location = useLocation();
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---
    // Handle scrolling down window ẩn hiện bottom navigation bar (phone)
    useEffect(() => {
        let lastScrollTop = 0;
        const onScroll = () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollTop > lastScrollTop) {
                // Scrolling Down
                setIsScrollingDown(true);
                bottomNavigationBarRef.current.style.transform = 'translateY(100%)';
                uploadOptionsRef.current.style.visibility = 'hidden';
                setIsOpenUploadOptionsBox(false);
            } else {
                // Scrolling Up
                setIsScrollingDown(false);
                bottomNavigationBarRef.current.style.transform = 'translateY(0)';
                uploadOptionsRef.current.style.visibility = isOpenUploadOptionsBox ? 'visible' : 'hidden';
                setIsOpenUploadOptionsBox(isOpenUploadOptionsBox);
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    // Handle Click Outside To Close
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Click outside uploadOptionsRef
            if (
                uploadOptionsRef.current &&
                !uploadOptionsRef.current.contains(event.target) &&
                !btnUploadRef.current.contains(event.target)
            ) {
                setIsOpenUploadOptionsBox(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className="col l-3 m-0 c-0"></div>
            <div
                id="middleContainerID"
                className="col l-6 m-12 c-12 middleContainer"
                // style={{ opacity: '0' }}
                //
            >
                {/* Thanh chuyển tab cũ */}
                {location?.pathname === '/' || location?.pathname === '/feeds' ? (
                    <div className="tabSwitchBar">
                        <Link
                            to="/"
                            style={{
                                fontFamily: '"Funnel Sans", sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'ease-out 0.2s',
                                width: '50%',
                                margin: '0px',
                                textDecoration: 'none',
                            }}
                        >
                            <button
                                id="1"
                                className={['btnHomePage', location.pathname === '/' ? 'actived' : ''].join(' ')}
                            >
                                <span>Trang chủ</span>
                            </button>
                        </Link>
                        <Link
                            to="/feeds"
                            style={{
                                fontFamily: '"Funnel Sans", sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'ease-out 0.2s',
                                width: '50%',
                                margin: '0px',
                                textDecoration: 'none',
                            }}
                        >
                            <button
                                id="2"
                                className={['btnFeedPage', location.pathname === '/feeds' ? 'actived' : ''].join(' ')}
                            >
                                <span>Bài đăng</span>
                            </button>
                        </Link>
                        <div className="btnComeBackBox">
                            <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                                <VscChevronLeft />
                                <span class="tooltiptext">Quay lại</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                {/* <div className="tabSwitchBar">
                    <Link
                        to="/"
                        style={{
                            fontFamily: '"Funnel Sans", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'ease-out 0.2s',
                            width: '50%',
                            margin: '0px',
                            textDecoration: 'none',
                        }}
                    >
                        <button
                            id="1"
                            className={['btnHomePage', location.pathname === '/' ? 'actived' : ''].join(' ')}
                        >
                            <span>Trang chủ</span>
                        </button>
                    </Link>
                    <Link
                        to="/feeds"
                        style={{
                            fontFamily: '"Funnel Sans", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'ease-out 0.2s',
                            width: '50%',
                            margin: '0px',
                            textDecoration: 'none',
                        }}
                    >
                        <button
                            id="2"
                            className={['btnFeedPage', location.pathname === '/feeds' ? 'actived' : ''].join(' ')}
                        >
                            <span>Bài đăng</span>
                        </button>
                    </Link>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div> */}
                {/* Thanh chuyển tab mới */}
                {/* <div className="tabSwitchBar">
                    <div className="left">
                        <Link to="/">
                            <button
                                id="1"
                                className={['btnHomePage', location.pathname === '/' ? 'actived' : ''].join(' ')}
                            >
                                <span>Trang chủ</span>
                            </button>
                        </Link>
                        <Link to="/feeds">
                            <button
                                id="2"
                                className={['btnFeedPage', location.pathname === '/feeds' ? 'actived' : ''].join(' ')}
                            >
                                <span>Bài đăng</span>
                            </button>
                        </Link>
                    </div>
                    <div className="right">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div> */}
                {children}
                {/* Button Expand Menu (Phone) */}
                {/* <button
                    className="btnExpandMenuOnPhone"
                    style={{
                        position: 'sticky',
                        bottom: '15px',
                        margin: '15px',
                        float: 'right',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(18, 18, 18, 0.8)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid #1f1f1f',
                        fontFamily: 'system-ui',
                        fontSize: '13px',
                        fontWeight: '500',
                        padding: '15px',
                        borderRadius: '50%',
                        color: '#ffffff',
                        cursor: 'pointer',
                        visibility: 'hidden',
                    }}
                    onClick={() => {
                        const leftContainer = document.getElementById('leftContainerID');
                        if (!leftContainer) return;
                        //
                        if (isExpandMenu) {
                            // Đóng
                            leftContainer.classList = 'col l-3 m-0 c-0 leftContainer';
                            setIsExpandMenu(false);
                        } else {
                            // Mở
                            leftContainer.classList = 'col l-3 m-0 c-8 leftContainer';
                            setIsExpandMenu(true);
                        }
                    }}
                >
                    {isExpandMenu ? <IoClose /> : <IoEllipsisVertical />}
                </button> */}
                {/* Bottom Navigation (Phone) */}
                <div
                    ref={bottomNavigationBarRef}
                    className="bottomNavigationBar"
                    style={{
                        transform:
                            location?.pathname === '/' ||
                            location?.pathname === '/feeds' ||
                            location?.pathname === '/messages' ||
                            location?.pathname === '/search' ||
                            location?.pathname?.startsWith(`/profile`)
                                ? ''
                                : 'translateY(100%)',
                    }}
                >
                    {/* Mini MusicPlayer */}
                    <div className="miniMusicPlayerContainer">
                        <MusicPlayer type={'mini'} />
                    </div>
                    {/* Button Home */}
                    <button
                        className="btnHome"
                        onClick={() => {
                            navigate('/');
                        }}
                    >
                        {location?.pathname === '/' || location?.pathname === '/feeds' ? (
                            <IoHomeSharp />
                        ) : (
                            <IoHomeOutline />
                        )}
                    </button>
                    {/* Button Messages */}
                    <button
                        className="btnMessages"
                        onClick={() => {
                            navigate('/messages');
                        }}
                    >
                        {location?.pathname?.startsWith('/messages') ? <IoChatbubble /> : <IoChatbubbleOutline />}
                    </button>
                    {/* Button Upload (Article, Music, Playlist) */}
                    <button
                        ref={btnUploadRef}
                        className="btnUpload"
                        onClick={() => {
                            setIsOpenUploadOptionsBox(!isOpenUploadOptionsBox);
                        }}
                    >
                        <IoAddOutline
                            style={{
                                transform: isOpenUploadOptionsBox ? 'rotate(-45deg)' : '',
                            }}
                        />
                        {/* Upload Options */}
                        <div
                            ref={uploadOptionsRef}
                            className="uploadOptions"
                            style={{
                                visibility: isOpenUploadOptionsBox ? 'visible' : '',
                            }}
                        >
                            <button
                                onClick={() => {
                                    navigate('/article/upload');
                                }}
                            >
                                <IoImagesOutline /> Bài viết
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/music/upload');
                                }}
                            >
                                <IoMusicalNotesOutline /> Nhạc
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/playlist/create');
                                }}
                            >
                                <RiPlayListFill /> Danh sách phát
                            </button>
                        </div>
                    </button>
                    {/* Button Search */}
                    <button
                        className="btnSearch"
                        onClick={() => {
                            navigate('/search');
                        }}
                    >
                        {location?.pathname?.startsWith('/search') ? <IoSearch /> : <IoSearchOutline />}
                    </button>
                    {/* Button Profile */}
                    <button
                        className="btnProfile"
                        onClick={() => {
                            navigate(`/profile/${auth?.user?.userName}`);
                        }}
                    >
                        <img
                            className="userAvatar"
                            src={auth?.user?.userAvatar ? env?.backend_url + auth?.user?.userAvatar : defaultAvatar}
                            alt="Ảnh đại diện"
                            loading="lazy"
                            style={{
                                border:
                                    location?.pathname === `/profile/${auth?.user?.userName}`
                                        ? '2px solid #ffffff'
                                        : '',
                            }}
                        />
                    </button>
                </div>
            </div>
            <div className="col l-3 m-0 c-0"></div>
        </>
    );
}

export default MiddleContainer;

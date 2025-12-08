import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/auth.context';
import { EnvContext } from '~/context/env.context';
import MusicPlayer from '../MusicPlayer';
import {
    IoAddOutline,
    IoChatbubble,
    IoChatbubbleOutline,
    IoHomeOutline,
    IoHomeSharp,
    IoImagesOutline,
    IoMusicalNotesOutline,
    IoSearch,
    IoSearchOutline,
} from 'react-icons/io5';
import { RiPlayListFill } from 'react-icons/ri';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { useIsMobile } from '~/hooks/useIsMobile';
import UnseenConversationCount from '../UnseenConversationCount';

function BottomNavigationBar() {
    // State
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [isOpenUploadOptionsBox, setIsOpenUploadOptionsBox] = useState(false);
    const [isExpandMiniMusicPlayer, setIsExpandMiniMusicPlayer] = useState(false);

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // Ref
    const bottomNavigationBarRef = useRef(null);
    const btnUploadRef = useRef(null);
    const uploadOptionsRef = useRef(null);
    const miniMusicPlayerRef = useRef(null);

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // Custom Hooks
    const isMobile = useIsMobile(768); // breakpoint = 768px

    // --- HANDLE FUNCTION ---
    //
    useEffect(() => {
        // Nếu trong cửa sổ chat thì ẩn Bottom Navigation Bar
        if (location?.pathname?.startsWith('/messages/')) {
            bottomNavigationBarRef.current.style.display = 'none';
        } else {
            bottomNavigationBarRef.current.style.display = '';
        }
    }, [location?.pathname]);
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
                miniMusicPlayerRef.current.style.transform = 'translateY(100%)';
                setIsOpenUploadOptionsBox(false);
            } else {
                // Scrolling Up
                setIsScrollingDown(false);
                bottomNavigationBarRef.current.style.transform = 'translateY(0)';
                uploadOptionsRef.current.style.visibility = isOpenUploadOptionsBox ? 'visible' : 'hidden';
                miniMusicPlayerRef.current.style.transform = 'translateY(0)';
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
    // Handle when expand Mini Music Player
    useEffect(() => {
        // When expand Mini Music Player, set body's overflow hidden
        const body = document.body;
        if (isExpandMiniMusicPlayer) {
            body.style.overflow = 'hidden';
            bottomNavigationBarRef.current.style.transform = 'translateY(0)';
        } else {
            body.style.overflow = 'auto';
            bottomNavigationBarRef.current.style.transform = '';
        }
    }, [isExpandMiniMusicPlayer]);

    return (
        <Fragment>
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
                    height: isExpandMiniMusicPlayer ? '100%' : '',
                }}
            >
                {/* Mini MusicPlayer */}
                <div
                    ref={miniMusicPlayerRef}
                    className="miniMusicPlayerContainer"
                    style={{
                        transform:
                            location?.pathname === '/' ||
                            location?.pathname === '/feeds' ||
                            location?.pathname === '/messages' ||
                            location?.pathname === '/search' ||
                            location?.pathname?.startsWith(`/profile`)
                                ? ''
                                : 'translateY(100%)',
                        height: isExpandMiniMusicPlayer ? '100%' : '',
                        bottom: isExpandMiniMusicPlayer ? '0' : '',
                        zIndex: isExpandMiniMusicPlayer ? '999' : '',
                        flexFlow: isExpandMiniMusicPlayer ? 'column' : '',
                    }}
                >
                    {isMobile && (
                        <MusicPlayer
                            isExpandMiniMusicPlayer={isExpandMiniMusicPlayer}
                            setIsExpandMiniMusicPlayer={setIsExpandMiniMusicPlayer}
                            type={'mini'}
                        />
                    )}
                    {/* <MusicPlayer /> */}
                </div>
                {/* Button Home */}
                <button
                    className="btnHome"
                    onClick={() => {
                        navigate('/');
                    }}
                    style={{
                        display: isExpandMiniMusicPlayer ? 'none' : '',
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
                    style={{
                        display: isExpandMiniMusicPlayer ? 'none' : '',
                    }}
                >
                    {location?.pathname?.startsWith('/messages') ? <IoChatbubble /> : <IoChatbubbleOutline />}
                    {/* Unseen Conversation Count */}
                    <UnseenConversationCount />
                </button>
                {/* Button Upload (Article, Music, Playlist) */}
                <button
                    ref={btnUploadRef}
                    className="btnUpload"
                    onClick={() => {
                        setIsOpenUploadOptionsBox(!isOpenUploadOptionsBox);
                    }}
                    style={{
                        display: isExpandMiniMusicPlayer ? 'none' : '',
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
                    style={{
                        display: isExpandMiniMusicPlayer ? 'none' : '',
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
                    style={{
                        display: isExpandMiniMusicPlayer ? 'none' : '',
                    }}
                >
                    <img
                        className="userAvatar"
                        src={auth?.user?.userAvatar ? env?.backend_url + auth?.user?.userAvatar : defaultAvatar}
                        alt="Ảnh đại diện"
                        loading="lazy"
                        style={{
                            border:
                                location?.pathname === `/profile/${auth?.user?.userName}` ? '2px solid #ffffff' : '',
                        }}
                    />
                </button>
            </div>
        </Fragment>
    );
}

export default BottomNavigationBar;

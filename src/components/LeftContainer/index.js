import logo from '~/assets/images/logoWhiteTransparent_noR.png';
import avatarDefault from '~/assets/images/avatarDefault.jpg';
import CircumIcon from '@klarr-agency/circum-icons-react';
import { VscChevronDown, VscAdd, VscChevronUp, VscClose, VscLibrary, VscMusic, VscHistory } from 'react-icons/vsc';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuthUserInfoApi, getListPlaylistOfUserDataApi, getSongDataApi, getUserSongsDataApi } from '~/utils/api';
import { AuthContext } from '~/context/auth.context';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import MyMusicList from '~/pages/components/MyMusicList';
import ListenHistoryList from '~/pages/components/ListenHistoryList';
import PlaylistList from '~/pages/components/PlaylistList';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function LeftContainer() {
    // State
    const [isOpenPlayList, setIsOpenPlayList] = useState(false);
    const [isOpenHistoryListen, setIsOpenHistoryListen] = useState(false);
    const [isOpenMySong, setIsOpenMySong] = useState(false);
    const [playlistData, setPlaylistData] = useState(); // Data playlist
    const [listenHistoryData, setListenHistoryData] = useState(); // Data listen history
    const [listenHistoryListKey, setListenHistoryListKey] = useState(Date.now()); // Để reset listen history data khi mở
    const [mySongsData, setMySongsData] = useState(); // Data my songs

    // Context
    const { auth } = useContext(AuthContext);
    const { playlist, setPlaylist, setCurrentIndex, setIsPlaying } = useMusicPlayerContext();

    // Ref
    const playlistRef = useRef(null);
    const listenHistoryRef = useRef(null);
    const mySongsRef = useRef(null);
    const mainPlaylistRef = useRef(null);
    const mainListenHistoryRef = useRef(null);
    const mainMySongRef = useRef(null);

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // React Query (Tanstack)
    const queryClient = useQueryClient();

    // --- HANDLE FUNCTION ---
    // Đóng / Mở Playlist
    const btnExpandPlaylist = () => {
        // 80px (height của playlist card ngang)
        let height = playlistData?.length
            ? 80 * (playlistData?.length >= 5 ? 4.5 : playlistData?.length) + 42 + 1
            : 123;
        // let mainListenHistoryHeight = listenHistoryData?.length
        //     ? 80 * (listenHistoryData?.length >= 5 ? 4.5 : listenHistoryData?.length) + 42 + 1
        //     : 123;
        let mainListenHistoryHeight = 400;
        if (!isOpenPlayList) {
            if (playlistData?.length > 0 && playlistData?.length < 5) {
                mainPlaylistRef.current.style.height = `${height}px`;
                if (!isOpenHistoryListen) {
                    listenHistoryRef.current.style.transform = `translateY(${height - 42}px)`;
                    mySongsRef.current.style.transform = `translateY(${height - 42}px)`;
                } else {
                    listenHistoryRef.current.style.transform = `translateY(${height - 42}px)`;
                    mySongsRef.current.style.transform = `translateY(${
                        mainListenHistoryHeight - 42 + (height - 42)
                    }px)`;
                }
            } else if (playlistData?.length >= 5) {
                mainPlaylistRef.current.style.height = `${height}px`;
                if (!isOpenHistoryListen) {
                    listenHistoryRef.current.style.transform = `translateY(${height - 42}px)`;
                    mySongsRef.current.style.transform = `translateY(${height - 42}px)`;
                } else {
                    listenHistoryRef.current.style.transform = `translateY(${height - 42}px)`;
                    mySongsRef.current.style.transform = `translateY(${
                        mainListenHistoryHeight - 42 + (height - 42)
                    }px)`;
                }
            } else {
                mainPlaylistRef.current.style.height = `123px`;
                if (!isOpenHistoryListen) {
                    listenHistoryRef.current.style.transform = `translateY(81px)`;
                    mySongsRef.current.style.transform = `translateY(81px)`;
                } else {
                    listenHistoryRef.current.style.transform = `translateY(81px)`;
                    mySongsRef.current.style.transform = `translateY(${mainListenHistoryHeight - 42 + 81}px)`;
                }
            }
            setIsOpenPlayList(true);
        } else {
            mainPlaylistRef.current.style.height = '0px';
            if (!isOpenHistoryListen) {
                listenHistoryRef.current.style.transform = `translateY(0px)`;
                mySongsRef.current.style.transform = `translateY(0px)`;
            } else {
                listenHistoryRef.current.style.transform = `translateY(0px)`;
                if (playlistData?.length > 0) {
                    mySongsRef.current.style.transform = `translateY(${mainListenHistoryHeight - 42}px)`;
                } else {
                    // mySongsRef.current.style.transform = `translateY(${81}px)`;
                    mySongsRef.current.style.transform = `translateY(${mainListenHistoryHeight - 42}px)`;
                }
            }
            setIsOpenPlayList(false);
        }
    };
    // Đóng / Mở History Listen
    const btnExpandHistoryListen = () => {
        // 80px (height của music card ngang)
        // let height = listenHistoryData?.length
        //     ? 80 * (listenHistoryData?.length >= 5 ? 4.5 : listenHistoryData?.length) + 42 + 1
        //     : 123;
        let height = 400;
        let mainPlaylistHeight = playlistData?.length
            ? 80 * (playlistData?.length >= 5 ? 4.5 : playlistData?.length) + 42 + 1
            : 123;
        if (!isOpenHistoryListen) {
            // if (listenHistoryData?.length > 0 && listenHistoryData?.length < 5) {
            //     mainListenHistoryRef.current.style.height = `${height}px`;
            //     if (!isOpenPlayList) {
            //         mySongsRef.current.style.transform = `translateY(${height - 42}px)`;
            //     } else {
            //         mySongsRef.current.style.transform = `translateY(${mainPlaylistHeight - 42 + (height - 42)}px)`;
            //     }
            // } else if (listenHistoryData?.length >= 5) {
            //     mainListenHistoryRef.current.style.height = `${height}px`;
            //     if (!isOpenPlayList) {
            //         mySongsRef.current.style.transform = `translateY(${height - 42}px)`;
            //     } else {
            //         mySongsRef.current.style.transform = `translateY(${mainPlaylistHeight - 42 + (height - 42)}px)`;
            //     }
            // } else {
            //     mainListenHistoryRef.current.style.height = `123px`;
            //     if (!isOpenPlayList) {
            //         mySongsRef.current.style.transform = `translateY(81px)`;
            //     } else {
            //         mySongsRef.current.style.transform = `translateY(${mainPlaylistHeight - 42 + 81}px)`;
            //     }
            // }
            mainListenHistoryRef.current.style.height = `${height}px`;
            if (!isOpenPlayList) {
                mySongsRef.current.style.transform = `translateY(${height - 42}px)`;
            } else {
                mySongsRef.current.style.transform = `translateY(${mainPlaylistHeight + height - 84}px)`;
            }
            // Khi mở lại listen history list, reset key để remount và data được reload
            setListenHistoryListKey(Date.now());
            setIsOpenHistoryListen(true);
        } else {
            mainListenHistoryRef.current.style.height = '0px';
            if (!isOpenPlayList) {
                mySongsRef.current.style.transform = `translateY(0px)`;
            } else {
                // if (listenHistoryData?.length > 0) {
                //     mySongsRef.current.style.transform = `translateY(${mainPlaylistHeight - 42}px)`;
                // } else {
                //     mySongsRef.current.style.transform = `translateY(${mainPlaylistHeight - 42}px)`;
                // }
                mySongsRef.current.style.transform = `translateY(${mainPlaylistHeight - 42}px)`;
            }
            setIsOpenHistoryListen(false);
        }
    };
    // Đóng / Mở My Song
    const btnExpandMySong = () => {
        if (!isOpenMySong) {
            // 80px (height của music card ngang)
            let height = 80 * (mySongsData?.length >= 5 ? 4.5 : mySongsData?.length) + 42 + 1;
            if (mySongsData?.length > 0 && mySongsData?.length < 5) {
                mainMySongRef.current.style.height = `${height}px`;
            } else if (mySongsData?.length >= 5) {
                mainMySongRef.current.style.height = `${height}px`;
            } else {
                mainMySongRef.current.style.height = `123px`;
            }
            setIsOpenMySong(true);
        } else {
            mainMySongRef.current.style.height = '0px';
            setIsOpenMySong(false);
        }
    };
    // Lấy dữ liệu
    // Call API Get List Playlist
    const {
        status,
        data: listPlaylistData,
        error,
    } = useQuery({
        queryKey: ['listPlaylist'],
        queryFn: async () => {
            const res = await getListPlaylistOfUserDataApi(auth?.user?.userId);
            setPlaylistData(res?.data);
            return res?.data;
        },
    });
    useEffect(() => {
        if (isOpenPlayList === true) {
            queryClient.invalidateQueries(['listPlaylist']);
        }
    }, [isOpenPlayList]);
    // Call API Get Listen History
    // useEffect(() => {
    //     //
    // }, [isOpenHistoryListen]);
    // Call API Get User Songs
    const {
        status: mySongsQueryStatus,
        data: mySongs,
        error: mySongsQueryError,
    } = useQuery({
        queryKey: ['mySongs'],
        queryFn: async () => {
            const res = await getUserSongsDataApi(auth?.user?.userId);
            setMySongsData(res?.data);
            return res?.data;
        },
    });
    useEffect(() => {
        if (isOpenMySong === true) {
            queryClient.invalidateQueries(['mySongs']);
        }
    }, [isOpenMySong]);

    return (
        <div
            id="leftContainerID"
            className="col l-3 m-0 c-0 leftContainer"
            //  style={{ opacity: '0' }}
        >
            <div className="top">
                <div className="logo">
                    <Link
                        to={``}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 'fit-content',
                        }}
                    >
                        <img
                            src={logo}
                            //
                            // style={{ opacity: '0' }}
                        />
                    </Link>
                </div>
                <div className="search">
                    <button
                        className="btnOpenSearch tooltip"
                        onClick={() => {
                            navigate(`/search`);
                        }}
                    >
                        <CircumIcon name="search" />
                        {/* Tooltip Text */}
                        {/* <span class="tooltiptext">Tìm kiếm</span> */}
                    </button>
                </div>
            </div>
            <div className="middle">
                {/* User Info */}
                <div className="user">
                    <div className="avatar">
                        <Link
                            to={`/profile/${auth?.user?.userName}`}
                            style={{ textDecoration: 'none', height: '100%' }}
                        >
                            <img
                                src={
                                    auth?.user?.userAvatar
                                        ? process.env.REACT_APP_BACKEND_URL + auth?.user?.userAvatar
                                        : avatarDefault
                                }
                                draggable="false"
                            />
                        </Link>
                    </div>
                    <div className="name">
                        <Link to={`/profile/${auth?.user?.userName}`} style={{ textDecoration: 'none' }}>
                            <span>{auth?.user?.userName ?? `Tên người dùng`}</span>
                        </Link>
                    </div>
                </div>
                {/* Playlist */}
                <div ref={playlistRef} id="playListID" className="mySong">
                    <div className="top">
                        <span className="title">
                            <VscLibrary style={{ marginRight: '5px' }} />
                            Danh sách phát
                        </span>
                        <div className="options">
                            <button className="btnExpand" onClick={btnExpandPlaylist}>
                                {isOpenPlayList ? <VscChevronUp /> : <VscChevronDown />}
                            </button>
                            <button
                                className="btnAdd"
                                onClick={() => {
                                    // Navigate sang trang tạo danh sách phát
                                    if (location?.pathname !== `/playlist/create`) {
                                        navigate(`/playlist/create`);
                                    }
                                }}
                            >
                                <VscAdd />
                                <span className="btnAddText">Tạo</span>
                            </button>
                        </div>
                    </div>
                    <div ref={mainPlaylistRef} id="mainPlaylistLeftContainerID" className="main">
                        <div className="backTop"></div>
                        {/* Playlist list */}
                        <PlaylistList
                            playlistsData={listPlaylistData ? listPlaylistData : playlistData}
                            typePlaylistList={'LeftContainer'}
                        />
                    </div>
                </div>
                {/* History Listen */}
                <div ref={listenHistoryRef} id="historyListenID" className="mySong">
                    <div className="top">
                        <span className="title">
                            <VscHistory style={{ marginRight: '5px' }} />
                            Lịch sử nghe
                        </span>
                        <div className="options">
                            <button className="btnExpand" onClick={btnExpandHistoryListen}>
                                {isOpenHistoryListen ? <VscChevronUp /> : <VscChevronDown />}
                            </button>
                        </div>
                    </div>
                    <div ref={mainListenHistoryRef} id="mainHistoryListenID" className="main">
                        <div className="backTop"></div>
                        {/* Listen history list */}
                        {isOpenHistoryListen && (
                            <ListenHistoryList key={listenHistoryListKey} typeMyMusicList={'LeftContainer'} />
                        )}
                    </div>
                </div>
                {/* My Song */}
                <div ref={mySongsRef} id="mySongID" className="mySong">
                    <div className="top">
                        <span className="title">
                            <VscMusic style={{ marginRight: '5px' }} />
                            Âm nhạc của tôi
                        </span>
                        <div className="options">
                            <button className="btnExpand" onClick={btnExpandMySong}>
                                {isOpenMySong ? <VscChevronUp /> : <VscChevronDown />}
                            </button>
                        </div>
                    </div>
                    <div ref={mainMySongRef} id="mainMySongID" className="main">
                        <div className="backTop"></div>
                        {/* My music list */}
                        <MyMusicList mySongsData={mySongs ? mySongs : mySongsData} typeMyMusicList={'LeftContainer'} />
                    </div>
                </div>
            </div>
            <div className="bottom"></div>
        </div>
    );
}

export default LeftContainer;

import logo from '~/assets/images/logoWhiteTransparent.png';
import avatarTest2 from '~/assets/images/avatarTest2.jpg';
import avatarDefault from '~/assets/images/avatarDefault.jpg';
import coverPlaylistTest from '~/assets/images/0054a59f216f1ffcecf0def0621a8fa2.jpg';
import coverPlaylistTest2 from '~/assets/images/studyCover.jpg';
import coverPlaylistTest3 from '~/assets/images/relaxMusicCover.jpg';
import coverSongTest from '~/assets/images/timanhghen.jpg';
import coverSongTest2 from '~/assets/images/getmoney.jpg';
import coverMySongTest from '~/assets/images/d125db5a3cac269c33f2314b318163a2.jpg';
import coverMySongTest2 from '~/assets/images/339dba2a2e19e5440dafb92b60a6e66b.jpg';
import CircumIcon from '@klarr-agency/circum-icons-react';
import { VscChevronDown, VscAdd, VscChevronUp, VscClose, VscLibrary, VscMusic, VscHistory } from 'react-icons/vsc';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserInfoApi } from '~/utils/api';

function LeftContainer() {
    // State (useState)
    const [isOpenPlayList, setIsOpenPlayList] = useState(false);
    const [isOpenHistoryListen, setIsOpenHistoryListen] = useState(false);
    const [isOpenMySong, setIsOpenMySong] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    // Đóng / Mở Playlist
    const btnExpandPlaylist = () => {
        let mainPlaylistLeftContainerID = document.getElementById('mainPlaylistLeftContainerID');
        if (!isOpenPlayList) {
            if (isOpenHistoryListen) {
                document.getElementById('historyListenID').style.transform = 'translateY(358px)';
                document.getElementById('mySongID').style.transform = 'translateY(716px)';
                mainPlaylistLeftContainerID.style.height = '400px';
                setIsOpenPlayList(true);
            } else {
                document.getElementById('historyListenID').style.transform = 'translateY(358px)';
                document.getElementById('mySongID').style.transform = 'translateY(358px)';
                mainPlaylistLeftContainerID.style.height = '400px';
                setIsOpenPlayList(true);
            }
        } else {
            if (isOpenHistoryListen) {
                mainPlaylistLeftContainerID.style.height = '0px';
                document.getElementById('historyListenID').style.transform = 'translateY(0px)';
                document.getElementById('mySongID').style.transform = 'translateY(358px)';
                setIsOpenPlayList(false);
            } else {
                mainPlaylistLeftContainerID.style.height = '0px';
                document.getElementById('historyListenID').style.transform = 'translateY(0px)';
                document.getElementById('mySongID').style.transform = 'translateY(0px)';
                setIsOpenPlayList(false);
            }
        }
    };
    // Đóng / Mở History Listen
    const btnExpandHistoryListen = () => {
        let mainHistoryListen = document.getElementById('mainHistoryListenID');
        if (!isOpenHistoryListen) {
            if (isOpenPlayList) {
                mainHistoryListen.style.height = '400px';
                document.getElementById('mySongID').style.transform = 'translateY(716px)';
                setIsOpenHistoryListen(true);
            } else {
                mainHistoryListen.style.height = '400px';
                document.getElementById('mySongID').style.transform = 'translateY(358px)';
                setIsOpenHistoryListen(true);
            }
        } else {
            if (isOpenPlayList) {
                mainHistoryListen.style.height = '0px';
                document.getElementById('mySongID').style.transform = 'translateY(358px)';
                setIsOpenHistoryListen(false);
            } else {
                mainHistoryListen.style.height = '0px';
                document.getElementById('mySongID').style.transform = 'translateY(0px)';
                setIsOpenHistoryListen(false);
            }
        }
    };

    // Đóng / Mở My Song
    const btnExpandMySong = () => {
        let mainMySong = document.getElementById('mainMySongID');
        if (!isOpenMySong) {
            mainMySong.style.height = '400px';
            setIsOpenMySong(true);
        } else {
            mainMySong.style.height = '0px';
            setIsOpenMySong(false);
        }
    };

    // Lấy thông tin người dùng đang đăng nhập
    useEffect(() => {
        const authUserEmail = localStorage.getItem('userEmail');
        const getUserInfo = async (email) => {
            const res = await getUserInfoApi(email);
            if (res) {
                console.log('>>> res.data', res.data);
                setUserInfo(res.data);
                return;
            }
            return;
        };
        getUserInfo(authUserEmail);
    }, []);

    return (
        <div id="leftContainerID" className="col l-3 m-0 c-0 leftContainer">
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
                        <img src={logo} />
                    </Link>
                </div>
                <div className="search">
                    <button className="btnOpenSearch">
                        <CircumIcon name="search" />
                    </button>
                </div>
            </div>
            <div className="middle">
                {/* User Info */}
                <div className="user">
                    <div className="avatar">
                        <Link to={`/profile/minhngo`} style={{ textDecoration: 'none', height: '100%', width: '100%' }}>
                            <img src={userInfo?.userAvatar ?? avatarDefault} />
                        </Link>
                    </div>
                    <div className="name">
                        <Link to={`/profile/minhngo`} style={{ textDecoration: 'none' }}>
                            <span>{userInfo.userName}</span>
                        </Link>
                    </div>
                </div>
                {/* Playlist */}
                <div id="playListID" className="playlist">
                    <div className="top">
                        <span className="title">
                            <VscLibrary style={{ marginRight: '5px' }} />
                            Danh sách phát
                        </span>
                        <div className="options">
                            <button className="btnExpand" onClick={btnExpandPlaylist}>
                                {isOpenPlayList ? <VscChevronUp /> : <VscChevronDown />}
                            </button>
                            <button className="btnAdd">
                                <VscAdd />
                            </button>
                        </div>
                    </div>
                    <div id="mainPlaylistLeftContainerID" className="main">
                        <div className="backTop"></div>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverPlaylistTest} />
                            </div>
                            <div className="info">
                                <span className="name">workout music</span>
                                <span className="quantity">10 bài hát</span>
                            </div>
                        </button>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverPlaylistTest2} />
                            </div>
                            <div className="info">
                                <span className="name">study music</span>
                                <span className="quantity">15 bài hát</span>
                            </div>
                        </button>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverPlaylistTest3} />
                            </div>
                            <div className="info">
                                <span className="name">relax music</span>
                                <span className="quantity">20 bài hát</span>
                            </div>
                        </button>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverPlaylistTest} />
                            </div>
                            <div className="info">
                                <span className="name">workout music</span>
                                <span className="quantity">10 bài hát</span>
                            </div>
                        </button>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverPlaylistTest2} />
                            </div>
                            <div className="info">
                                <span className="name">study music</span>
                                <span className="quantity">15 bài hát</span>
                            </div>
                        </button>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverPlaylistTest3} />
                            </div>
                            <div className="info">
                                <span className="name">relax music</span>
                                <span className="quantity">20 bài hát</span>
                            </div>
                        </button>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverPlaylistTest} />
                            </div>
                            <div className="info">
                                <span className="name">workout music</span>
                                <span className="quantity">10 bài hát</span>
                            </div>
                        </button>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverPlaylistTest2} />
                            </div>
                            <div className="info">
                                <span className="name">study music</span>
                                <span className="quantity">15 bài hát</span>
                            </div>
                        </button>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverPlaylistTest3} />
                            </div>
                            <div className="info">
                                <span className="name">relax music</span>
                                <span className="quantity">20 bài hát</span>
                            </div>
                        </button>
                    </div>
                </div>
                {/* History Listen */}
                <div id="historyListenID" className="historyListen">
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
                    <div id="mainHistoryListenID" className="main">
                        <div className="backTop"></div>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverSongTest} />
                            </div>
                            <div className="info">
                                <span className="name">
                                    TIM ANH GHEN (ft. LVK, Dangrangto, TeuYungBoy) [prod. by rev, sleepat6pm]
                                </span>
                                <span className="quantity">Wxrdie</span>
                            </div>
                            <div className="btnRemoveBox">
                                <button className="btnRemove">
                                    <VscClose />
                                </button>
                            </div>
                        </button>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverSongTest2} />
                            </div>
                            <div className="info">
                                <span className="name">GET MONEY (ft. Thai VG) [prod. by Marlykid]</span>
                                <span className="quantity">Wxrdie</span>
                            </div>
                            <div className="btnRemoveBox">
                                <button className="btnRemove">
                                    <VscClose />
                                </button>
                            </div>
                        </button>
                    </div>
                </div>
                {/* My Song */}
                <div id="mySongID" className="mySong">
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
                    <div id="mainMySongID" className="main">
                        <div className="backTop"></div>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverMySongTest} />
                            </div>
                            <div className="info">
                                <span className="name">wonder</span>
                                <span className="quantity">minhngo</span>
                            </div>
                        </button>
                        {/* Each Item */}
                        <button className="btnPlaylist">
                            <div className="coverImage">
                                <img src={coverMySongTest2} />
                            </div>
                            <div className="info">
                                <span className="name">GRINDING</span>
                                <span className="quantity">minhngo</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div className="bottom"></div>
        </div>
    );
}

export default LeftContainer;

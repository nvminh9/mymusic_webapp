import logo from '~/assets/images/logoWhiteTransparent.png';
import avatarTest from '~/assets/images/avatarTest.jpg';
import avatarTest2 from '~/assets/images/avatarTest2.jpg';
import coverPlaylistTest from '~/assets/images/0054a59f216f1ffcecf0def0621a8fa2.jpg';
import coverPlaylistTest2 from '~/assets/images/studyCover.jpg';
import coverPlaylistTest3 from '~/assets/images/relaxMusicCover.jpg';
import CircumIcon from '@klarr-agency/circum-icons-react';
import { VscChevronDown, VscAdd, VscChevronUp } from 'react-icons/vsc';
import { useState } from 'react';

function LeftContainer() {
    const [isOpenPlayList, setIsOpenPlayList] = useState(false);
    const [isOpenPlayListTwo, setIsOpenPlayListTwo] = useState(false);

    // Đóng / Mở Playlist
    const btnExpandPlaylist = () => {
        let mainPlaylistLeftContainerID = document.getElementById('mainPlaylistLeftContainerID');
        if (!isOpenPlayList) {
            document.getElementById('playlistID2').style.transform = 'translateY(358px)';
            mainPlaylistLeftContainerID.style.height = '400px';
            setIsOpenPlayList(true);
        } else {
            mainPlaylistLeftContainerID.style.height = '0px';
            document.getElementById('playlistID2').style.transform = 'translateY(0px)';
            setIsOpenPlayList(false);
        }
    };
    // Đóng / Mở Playlist 2 Test
    const btnExpandPlaylist2 = () => {
        let mainPlaylistLeftContainerID2 = document.getElementById('mainPlaylistLeftContainerID2');
        if (!isOpenPlayListTwo) {
            mainPlaylistLeftContainerID2.style.height = '400px';
            setIsOpenPlayListTwo(true);
        } else {
            mainPlaylistLeftContainerID2.style.height = '0px';
            setIsOpenPlayListTwo(false);
        }
    };

    return (
        <div className="col l-3 m-0 c-0 leftContainer">
            <div className="top">
                <div className="logo">
                    <img src={logo} />
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
                        <img src={avatarTest2} />
                    </div>
                    <div className="name">
                        <span>minhngo</span>
                    </div>
                </div>
                {/* Playlist */}
                <div className="playlist">
                    <div className="top">
                        <span className="title">Danh sách phát</span>
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
                {/* Playlist */}
                <div id="playlistID2" className="playlist">
                    <div className="top">
                        <span className="title">Danh sách phát</span>
                        <div className="options">
                            <button className="btnExpand" onClick={btnExpandPlaylist2}>
                                {isOpenPlayList ? <VscChevronUp /> : <VscChevronDown />}
                            </button>
                            <button className="btnAdd">
                                <VscAdd />
                            </button>
                        </div>
                    </div>
                    <div id="mainPlaylistLeftContainerID2" className="main">
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
            </div>
            <div className="bottom"></div>
        </div>
    );
}

export default LeftContainer;

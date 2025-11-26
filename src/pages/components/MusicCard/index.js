import { useContext, useState } from 'react';
import {
    IoAddSharp,
    IoAlertSharp,
    IoArrowUpSharp,
    IoCheckmarkSharp,
    IoHeartSharp,
    IoMusicalNotes,
    IoPlay,
    IoPlaySharp,
    IoSyncSharp,
} from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import noContentImage from '~/assets/images/no_content.jpg';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import { useMusicPlayer } from '~/hooks/useMusicPlayer';
import { getSongDataApi } from '~/utils/api';
import { EnvContext } from '~/context/env.context';

// handleCheckIsSongAdded: Hàm kiểm tra xem bài đã có trong playlist chưa (return true hoặc false)
// handleAddMusic: Hàm thực hiện thêm bài vào playlist
// handleRemoveAddMusic: Hàm thực hiện xóa bài khỏi playlist
function MusicCard({
    songData,
    listeningHistoryData,
    order,
    typeMusicCard,
    handleCheckIsSongAdded,
    handleAddMusic,
    handleRemoveAddMusic,
    addOrRemoveMusicProgress,
    handleDeleteListeningHistory,
}) {
    // State

    // Context
    const { playlist, setPlaylist, setCurrentIndex, isPlaying, setIsPlaying, setTypeMusicPlayer } =
        useMusicPlayerContext();
    const { env } = useContext(EnvContext);

    // useMusicPlayer (Custom Hook)
    const { currentSong } = useMusicPlayer();

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // --- HANDLE FUNCTION ---
    // Test handlePlay
    const handlePlay = async (e) => {
        // Trong playlist ở Music Player
        if (typeMusicCard === 'MusicPlayerPlaylist') {
            setCurrentIndex(order - 1);
            return;
        }

        try {
            // Call API Get Song Data
            const res = await getSongDataApi(songData?.songId);
            // Set Music Player Context
            setPlaylist((prev) => {
                return prev?.length > 0 ? [...prev, { ...res?.data }] : [{ ...res?.data }];
            });
            setCurrentIndex(playlist?.length && playlist?.length > 0 ? playlist?.length : 0);
            setIsPlaying(true);
            setTypeMusicPlayer({ type: 'song' });
        } catch (error) {
            console.log(error);
        }
    };

    // Trong LeftContainer (Listen History)
    if (typeMusicCard === 'LeftContainerListenHistory') {
        return (
            <div className="listenHistoryItem">
                {/* Each Item */}
                <button
                    type="button"
                    className="btnPlaylist"
                    onClick={() => {
                        handlePlay();
                    }}
                >
                    <div className="coverImage">
                        <img
                            src={songData?.songImage ? env?.backend_url + songData?.songImage : noContentImage}
                            draggable="false"
                        />
                    </div>
                    <div className="info">
                        <span className="name">{songData?.name}</span>
                        <span className="quantity">{songData?.User?.userName}</span>
                    </div>
                </button>
                {/* Button For Info */}
                <div className="buttonBox" style={{ width: '65%' }}>
                    <button
                        className="btnName"
                        onClick={() => {
                            if (location.pathname.split('/')[2] !== songData?.songId) {
                                navigate(`/song/${songData?.songId}`);
                            }
                        }}
                    >
                        {songData?.name}
                    </button>
                    <button
                        className="btnQuantity"
                        onClick={() => {
                            if (location.pathname.split('/')[2] !== songData?.User?.userName) {
                                navigate(`/profile/${songData?.User?.userName}`);
                            }
                        }}
                    >
                        {songData?.User?.userName}
                    </button>
                </div>
                {/* Button Add / Remove Music */}
                <button
                    type="button"
                    className="btnDeleteListenHistory"
                    onClick={() => {
                        handleDeleteListeningHistory(listeningHistoryData?.listeningHistoryId);
                    }}
                >
                    Xóa
                </button>
            </div>
        );
    }

    // Trong LeftContainer (Âm nhạc của tôi)
    if (typeMusicCard === 'LeftContainerMyMusic') {
        return (
            <div className="listenHistoryItem">
                {/* Each Item */}
                <button
                    type="button"
                    className="btnPlaylist"
                    onClick={() => {
                        handlePlay();
                    }}
                >
                    <div className="coverImage">
                        <img
                            src={songData?.songImage ? env?.backend_url + songData?.songImage : noContentImage}
                            draggable="false"
                        />
                    </div>
                    <div className="info">
                        <span className="name">{songData?.name}</span>
                        <span className="quantity">{songData?.User?.userName}</span>
                    </div>
                </button>
                {/* Button For Info */}
                <div className="buttonBox">
                    <button
                        className="btnName"
                        onClick={() => {
                            if (location.pathname.split('/')[2] !== songData?.songId) {
                                navigate(`/song/${songData?.songId}`);
                            }
                        }}
                    >
                        {songData?.name}
                    </button>
                    <button
                        className="btnQuantity"
                        onClick={() => {
                            if (location.pathname.split('/')[2] !== songData?.User?.userName) {
                                navigate(`/profile/${songData?.User?.userName}`);
                            }
                        }}
                    >
                        {songData?.User?.userName}
                    </button>
                </div>
            </div>
        );
    }

    // Trong Playlist
    if (typeMusicCard === 'Playlist') {
        return (
            <button
                className="btnPlaylist"
                type="button"
                onClick={() => {
                    handlePlay();
                }}
            >
                <span className="number">
                    <span className="numberIcon">{order}</span>
                    <span className="playIcon">
                        <IoPlaySharp />
                    </span>
                </span>
                <span className="music">
                    <img
                        src={songData?.songImage ? env?.backend_url + songData?.songImage : noContentImage}
                        draggable="false"
                    />
                    <div className="info">
                        <span className="name">{songData?.name}</span>
                        <span className="quantity">
                            {songData?.User?.userName ? songData?.User?.userName : songData?.user?.userName}
                        </span>
                    </div>
                </span>
                <span className="time">{songData?.duration ? songData?.duration : 'null'}</span>
            </button>
        );
    }

    // Trong Tìm kiếm
    if (typeMusicCard === 'atAddMusicSearch') {
        return (
            <>
                {/* Each Item */}
                <button
                    type="button"
                    className="btnPlaylist"
                    onClick={() => {
                        handlePlay();
                    }}
                >
                    <div className="coverImage">
                        <img
                            src={songData?.songImage ? env?.backend_url + songData?.songImage : noContentImage}
                            draggable="false"
                        />
                    </div>
                    <div className="info">
                        <span className="name">{songData?.name}</span>
                        <span className="quantity">{songData?.User?.userName}</span>
                    </div>
                </button>
                {/* Button Add / Remove Music */}
                {handleCheckIsSongAdded(songData) ? (
                    <button
                        type="button"
                        className="btnAddMusic btnRemoveAddMusic"
                        onClick={() => {
                            handleRemoveAddMusic(songData);
                        }}
                    >
                        Xóa thêm
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="btnAddMusic"
                            onClick={() => {
                                handleAddMusic(songData);
                            }}
                        >
                            Thêm
                        </button>
                    </>
                )}
            </>
        );
    }

    // Trong playlist ở Music Player
    if (typeMusicCard === 'MusicPlayerPlaylist') {
        return (
            <>
                {/* Button Song */}
                <button
                    className="btnPlaylist"
                    type="button"
                    onClick={() => {
                        handlePlay();
                    }}
                    style={{
                        backgroundColor: songData?.songId === currentSong?.songId ? '#1f1f1f' : '',
                    }}
                >
                    <span className="number">
                        <span className="numberIcon">{order}</span>
                        <span className="playIcon">
                            <IoPlaySharp />
                        </span>
                    </span>
                    <span className="music">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                                src={songData?.songImage ? env?.backend_url + songData?.songImage : noContentImage}
                                draggable="false"
                            />
                        </div>
                        <div className="info">
                            <span className="name">{songData?.name}</span>
                            <span className="quantity">{songData?.User?.userName}</span>
                        </div>
                    </span>
                    <span className="time">
                        {songData?.songId === currentSong?.songId && isPlaying ? (
                            <div style={{ width: '100%' }}>
                                <div class="boxContainer boxContainerSmall">
                                    <div class="box box1"></div>
                                    <div class="box box2"></div>
                                    <div class="box box3"></div>
                                    <div class="box box4"></div>
                                    <div class="box box5"></div>
                                </div>
                            </div>
                        ) : (
                            songData?.duration
                        )}
                    </span>
                </button>
            </>
        );
    }

    // Trong Search Result
    if (typeMusicCard === 'SearchResult') {
        return (
            <>
                <div className="col l-4 m-4 c-6 searchItemSong">
                    {/* Image */}
                    <div
                        className="songImageContainer"
                        onClick={() => {
                            navigate(`/song/${songData?.songId}`);
                        }}
                    >
                        {/* User Info */}
                        <div className="userInfo">
                            <img
                                className="avatar"
                                src={
                                    songData?.User?.userAvatar
                                        ? env?.backend_url + songData?.User?.userAvatar
                                        : defaultAvatar
                                }
                            />
                            <span className="userName">{songData?.User?.userName}</span>
                        </div>
                        <img
                            className="songImage"
                            src={songData?.songImage ? env?.backend_url + songData?.songImage : noContentImage}
                            draggable="false"
                        />
                        {/* Icon Music */}
                        <IoMusicalNotes />
                        {/* Phần hiển thị khi hover vào thumbnail */}
                        <div className="thumbnailHoverContainer">
                            {/* Song Name */}
                            <span className="songName">{songData?.name}</span>
                            <div className="thumbnailHover">
                                {/* Lượt thích */}
                                <IoHeartSharp></IoHeartSharp>{' '}
                                <span
                                    className="likes"
                                    style={{ fontFamily: 'system-ui', fontWeight: '400', fontSize: '13px' }}
                                >
                                    {songData?.likeCount}
                                </span>
                            </div>
                        </div>
                        {/* Created At */}
                        <button type="button" className="btnPlay" onClick={handlePlay}>
                            <IoPlay />
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // Trong Next Song Recommend
    if (typeMusicCard === 'atNextSongRecommend') {
        return (
            <>
                <button
                    className="btnPlaylist"
                    type="button"
                    onClick={() => {
                        handlePlay();
                    }}
                >
                    <span className="music">
                        <div className="songImageContainer">
                            <img
                                src={songData?.songImage ? env?.backend_url + songData?.songImage : noContentImage}
                                draggable="false"
                            />
                        </div>
                        <div className="info">
                            <span className="name">{songData?.name}</span>
                            <span className="quantity">{songData?.User?.userName}</span>
                        </div>
                    </span>
                    <span className="time">{songData?.duration ? songData?.duration : 'null'}</span>
                </button>
            </>
        );
    }

    return <></>;
}

export default MusicCard;

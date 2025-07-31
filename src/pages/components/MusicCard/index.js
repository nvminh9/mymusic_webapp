import { useState } from 'react';
import { IoAddSharp, IoAlertSharp, IoArrowUpSharp, IoCheckmarkSharp, IoPlaySharp, IoSyncSharp } from 'react-icons/io5';
import noContentImage from '~/assets/images/no_content.jpg';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import { getSongDataApi } from '~/utils/api';

// handleCheckIsSongAdded: Hàm kiểm tra xem bài đã có trong playlist chưa (return true hoặc false)
// handleAddMusic: Hàm thực hiện thêm bài vào playlist
// handleRemoveAddMusic: Hàm thực hiện xóa bài khỏi playlist
function MusicCard({
    songData,
    order,
    typeMusicCard,
    handleCheckIsSongAdded,
    handleAddMusic,
    handleRemoveAddMusic,
    addOrRemoveMusicProgress,
}) {
    // State

    // Context
    const { playlist, setPlaylist, setCurrentIndex, setIsPlaying } = useMusicPlayerContext();

    // --- HANDLE FUNCTION ---
    // Test handlePlay
    const handlePlay = async (e) => {
        try {
            // Call API Get Song Data
            const res = await getSongDataApi(songData?.songId);
            // Set Music Player Context
            setPlaylist((prev) => {
                return prev?.length > 0 ? [...prev, { ...res?.data }] : [{ ...res?.data }];
            });
            setCurrentIndex(playlist?.length && playlist?.length > 0 ? playlist?.length : 0);
            setIsPlaying(true);
            // Local Storage (Bài cuối lúc trước nghe)
            localStorage.setItem('pl', JSON.stringify([{ ...res?.data }]));
        } catch (error) {
            console.log(error);
        }
    };

    // Trong LeftContainer
    if (typeMusicCard === 'LeftContainer') {
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
                            src={
                                songData?.songImage
                                    ? process.env.REACT_APP_BACKEND_URL + songData?.songImage
                                    : noContentImage
                            }
                            draggable="false"
                        />
                    </div>
                    <div className="info">
                        <span className="name">{songData?.name}</span>
                        <span className="quantity">{songData?.User?.userName}</span>
                    </div>
                </button>
            </>
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
                        src={
                            songData?.songImage
                                ? process.env.REACT_APP_BACKEND_URL + songData?.songImage
                                : noContentImage
                        }
                        draggable="false"
                    />
                    <div className="info">
                        <span className="name">{songData?.name}</span>
                        <span className="quantity">{songData?.User?.userName}</span>
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
                            src={
                                songData?.songImage
                                    ? process.env.REACT_APP_BACKEND_URL + songData?.songImage
                                    : noContentImage
                            }
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

    return <></>;
}

export default MusicCard;

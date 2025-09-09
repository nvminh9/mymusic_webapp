import { useQueryClient } from '@tanstack/react-query';
import { IoHeartSharp, IoMusicalNotes, IoPlay } from 'react-icons/io5';
import { RiPlayListFill } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import noContentImage from '~/assets/images/no_content.jpg';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import { useMusicPlayer } from '~/hooks/useMusicPlayer';
import { addMusicToPlaylistApi, getSongDataApi, removeMusicFromPlaylistApi } from '~/utils/api';

function PlaylistCard({ playlistData, typePlaylistCard }) {
    // State

    // Context
    // const { playlist, setPlaylist, setCurrentIndex, setIsPlaying } = useMusicPlayerContext();
    const { currentSong } = useMusicPlayer();

    // React Query
    const queryClient = useQueryClient();

    // Ref

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // --- HANDLE FUNCTION ---
    // Test handlePlay
    // const handlePlay = async (e) => {
    //     try {
    //         // Call API Get Song Data
    //         const res = await getSongDataApi(songData?.songId);
    //         // Set Music Player Context
    //         setPlaylist((prev) => {
    //             return prev?.length > 0 ? [...prev, { ...res?.data }] : [{ ...res?.data }];
    //         });
    //         setCurrentIndex(playlist?.length && playlist?.length > 0 ? playlist?.length : 0);
    //         setIsPlaying(true);
    //         // Local Storage (Bài cuối lúc trước nghe)
    //         localStorage.setItem('pl', JSON.stringify([{ ...res?.data }]));
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // Handle format timestamp to time ago
    const timeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const seconds = Math.floor((now - past) / 1000);
        const intervals = [
            { label: 'năm', seconds: 31536000 },
            { label: 'tháng', seconds: 2592000 },
            { label: 'tuần', seconds: 604800 },
            { label: 'ngày', seconds: 86400 },
            { label: 'giờ', seconds: 3600 },
            { label: 'phút', seconds: 60 },
            { label: 'giây', seconds: 1 },
        ];
        for (let i = 0; i < intervals.length; i++) {
            const interval = Math.floor(seconds / intervals[i].seconds);
            if (interval >= 1) {
                return `${interval} ${intervals[i].label} trước`;
            }
        }
        return 'vừa xong';
    };
    // Handle Check nếu bài hát đã được thêm rồi
    const handleCheckIsSongAdded = (songData) => {
        // Các bài trong danh sách phát
        const playlistSongs = playlistData?.songs;
        // Kiểm tra
        const result = playlistSongs?.find((item) => item?.songId === songData?.songId);
        // Result
        if (!result) {
            return false;
        } else {
            return true;
        }
    };
    // Handle Add Music
    const handleAddMusic = async (songData) => {
        // Call API
        const data = { playlistId: playlistData?.playlistId, songId: songData?.songId };
        // // Set Progress
        // setAddOrRemoveMusicProgress({
        //     status: 'pending',
        //     isLoading: true,
        // });
        try {
            const res = await addMusicToPlaylistApi(data);
            if (res?.status === 200 && res?.message === 'Thêm thành công') {
                // // Nếu tạo thành công
                // setAddOrRemoveMusicProgress({
                //     status: 'success',
                //     isLoading: true, // true để tránh trường hợp người dùng bấm thêm lần nữa trước khi navigate
                // });

                // Refetch data của query key "listPlaylist"
                queryClient.invalidateQueries(['listPlaylist']);

                return () => {
                    // clearTimeout(navigateToProfileTimeout);
                };
            } else {
                // // Nếu tạo không thành công (có thể bị lỗi ở service hoặc file quá lớn)
                // setAddOrRemoveMusicProgress({
                //     status: 'fail',
                //     isLoading: false,
                // });
                // return
                return;
            }
        } catch (error) {
            // // Nếu có lỗi xảy ra
            // setAddOrRemoveMusicProgress({
            //     status: 'error',
            //     isLoading: false,
            // });
            console.log(error);
        }
    };
    // Handle Remove Add Music
    const handleRemoveAddMusic = async (songData) => {
        // Call API
        const data = { playlistId: playlistData?.playlistId, songId: songData?.songId };
        // // Set Progress
        // setAddOrRemoveMusicProgress({
        //     status: 'pending',
        //     isLoading: true,
        // });
        try {
            const res = await removeMusicFromPlaylistApi(data.playlistId, data.songId);
            if (res?.status === 200 && res?.message === 'Xóa thành công') {
                // // Nếu xóa thành công
                // setAddOrRemoveMusicProgress({
                //     status: 'success',
                //     isLoading: true, // true để tránh trường hợp người dùng bấm thêm lần nữa trước khi navigate
                // });

                // Refetch data của query key "listPlaylist"
                queryClient.invalidateQueries(['listPlaylist']);

                return () => {
                    // clearTimeout(navigateToProfileTimeout);
                };
            } else {
                // // Nếu xóa không thành công (có thể bị lỗi ở service hoặc file quá lớn)
                // setAddOrRemoveMusicProgress({
                //     status: 'fail',
                //     isLoading: false,
                // });
                // return
                return;
            }
        } catch (error) {
            // // Nếu có lỗi xảy ra
            // setAddOrRemoveMusicProgress({
            //     status: 'error',
            //     isLoading: false,
            // });
            console.log(error);
        }
    };

    // type === 'LeftContainer'
    if (typePlaylistCard === 'LeftContainer') {
        return (
            <div className="listenHistoryItem">
                {/* Each Item */}
                <button
                    className="btnPlaylist"
                    onClick={() => {
                        if (location.pathname.split('/')[2] !== playlistData?.playlistId) {
                            navigate(`/playlist/${playlistData?.playlistId}`);
                        }
                    }}
                >
                    <div className="coverImage">
                        <img
                            src={
                                playlistData?.coverImage
                                    ? process.env.REACT_APP_BACKEND_URL + playlistData?.coverImage
                                    : noContentImage
                            }
                            draggable="false"
                            style={{
                                boxShadow:
                                    'rgb(50 50 50) -3px 0px 0px 0px, rgb(50 50 50 / 50%) -6px 0px, rgba(50, 50, 50, 0.2) -9px 0px',
                                marginLeft: '9px',
                            }}
                        />
                    </div>
                    <div className="info">
                        <span className="name">{playlistData?.name}</span>
                        <span className="quantity">{playlistData?.User?.userName}</span>
                    </div>
                </button>
                {/* Button For Info */}
                <div className="buttonBox" style={{ paddingLeft: '16px' }}>
                    <button
                        className="btnName"
                        onClick={() => {
                            if (location.pathname.split('/')[2] !== playlistData?.playlistId) {
                                navigate(`/playlist/${playlistData?.playlistId}`);
                            }
                        }}
                    >
                        {playlistData?.name}
                    </button>
                    <button
                        className="btnQuantity"
                        onClick={() => {
                            if (location.pathname.split('/')[2] !== playlistData?.User?.userName) {
                                navigate(`/profile/${playlistData?.User?.userName}`);
                            }
                        }}
                    >
                        {playlistData?.User?.userName}
                    </button>
                </div>
            </div>
        );
    }

    // type === 'atAddToPlaylistBox'
    if (typePlaylistCard === 'atAddToPlaylistBox') {
        return (
            <>
                <>
                    {/* Each Item */}
                    <button
                        type="button"
                        className="btnPlaylist"
                        onClick={() => {
                            if (location.pathname.split('/')[2] !== playlistData?.playlistId) {
                                navigate(`/playlist/${playlistData?.playlistId}`);
                            }
                        }}
                    >
                        <div className="coverImage">
                            <img
                                src={
                                    playlistData?.coverImage
                                        ? process.env.REACT_APP_BACKEND_URL + playlistData?.coverImage
                                        : noContentImage
                                }
                                draggable="false"
                            />
                        </div>
                        <div className="info">
                            <span className="name">{playlistData?.name}</span>
                            <span className="quantity">{playlistData?.User?.userName}</span>
                        </div>
                    </button>
                    {/* Button Add / Remove Music */}
                    {handleCheckIsSongAdded(currentSong) ? (
                        <button
                            type="button"
                            className="btnAddMusic btnRemoveAddMusic"
                            onClick={() => {
                                handleRemoveAddMusic(currentSong);
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
                                    handleAddMusic(currentSong);
                                }}
                            >
                                Thêm
                            </button>
                        </>
                    )}
                </>
            </>
        );
    }

    // type === 'SearchResult'
    if (typePlaylistCard === 'SearchResult') {
        return (
            <>
                <div className="col l-4 m-4 c-6 searchItemSong">
                    {/* Image */}
                    <div
                        className="songImageContainer"
                        onClick={() => {
                            navigate(`/playlist/${playlistData?.playlistId}`);
                        }}
                    >
                        {/* User Info */}
                        <div className="userInfo">
                            <img
                                className="avatar"
                                src={
                                    playlistData?.User?.userAvatar
                                        ? process.env.REACT_APP_BACKEND_URL + playlistData?.User?.userAvatar
                                        : defaultAvatar
                                }
                            />
                            <span className="userName">{playlistData?.User?.userName}</span>
                        </div>
                        <img
                            className="songImage"
                            src={
                                playlistData?.coverImage
                                    ? process.env.REACT_APP_BACKEND_URL + playlistData?.coverImage
                                    : noContentImage
                            }
                            draggable="false"
                        />
                        {/* Icon Music */}
                        <RiPlayListFill />
                        {/* Phần hiển thị khi hover vào thumbnail */}
                        <div className="thumbnailHoverContainer">
                            {/* Song Name */}
                            <span className="songName">{playlistData?.name}</span>
                            <div className="thumbnailHover">
                                {/* Lượt thích */}
                                <span
                                    className="likes"
                                    style={{ fontFamily: 'system-ui', fontWeight: '400', fontSize: '13px' }}
                                >
                                    {`${playlistData?.songs?.length || 0} bài nhạc`}
                                </span>
                            </div>
                        </div>
                        {/* Created At */}
                        <div className="createdAtHover">
                            <span>{timeAgo(playlistData?.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return <></>;
}

export default PlaylistCard;

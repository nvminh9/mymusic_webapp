import { Fragment, useContext, useEffect, useState } from 'react';
import { VscChevronLeft } from 'react-icons/vsc';
import { useLocation, useNavigate } from 'react-router-dom';
import { addMusicToPlaylistApi, getPlaylistDataApi, removeMusicFromPlaylistApi } from '~/utils/api';
import ImageAmbilight from '../components/ImageAmbilight';
import { IoAddCircleSharp, IoAddSharp, IoCloseSharp, IoPlaySharp, IoSyncSharp, IoTimeOutline } from 'react-icons/io5';
import MusicCard from '../components/MusicCard';
import noContentImage from '~/assets/images/no_content.jpg';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import UserTag from '../components/UserTag';
import { useQueryClient } from '@tanstack/react-query';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import { AuthContext } from '~/context/auth.context';
import CustomPlaylistBox from '../components/CustomPlaylistBox';

function PlaylistDetail() {
    // State
    const [playlistDetailData, setPlaylistDetailData] = useState();
    const [isOpenCustomBox, setIsOpenCustomBox] = useState(false);
    const [addOrRemoveMusicProgress, setAddOrRemoveMusicProgress] = useState();

    // Context
    const { auth } = useContext(AuthContext);
    // React Query
    const queryClient = useQueryClient();
    // Listening History
    const listenHistoryData = queryClient.getQueryData(['listeningHistory']);
    // useMusicPlayerContext
    const { setPlaylist, setCurrentIndex, setTypeMusicPlayer } = useMusicPlayerContext();

    // Ref

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // playlistId
        const playlistId = location.pathname.split('/')[2];
        // Call API Get Playlist
        const getPlaylistData = async (playlistId) => {
            const res = await getPlaylistDataApi(playlistId);
            // Set state playlistDetailData
            setPlaylistDetailData(res?.data);
        };
        getPlaylistData(playlistId);
    }, [location.pathname.split('/')[2]]);
    // Format thời gian tạo sang ago
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
        // Nếu đã quá 1 tuần thì return chi tiết
        if (seconds >= intervals[2].seconds) {
            return formatTimestamp(timestamp);
        }
        for (let i = 0; i < intervals.length; i++) {
            const interval = Math.floor(seconds / intervals[i].seconds);
            if (interval >= 1 && interval < 86400) {
                return `${interval} ${intervals[i].label} trước`;
            }
        }
        return 'vừa xong';
    };
    // Format thời gian tạo (timestamp) sang định dạng "dd/mm/yyyy HH:MM"
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day} Tháng ${month}, ${year} lúc ${hours}:${minutes}`;
    };
    // Handle Button Add Music
    const handleBtnAddMusic = () => {
        //
        setIsOpenCustomBox(!isOpenCustomBox);
    };
    // Handle Check nếu bài hát đã được thêm rồi
    const handleCheckIsSongAdded = (songData) => {
        // Các bài trong danh sách phát
        const playlistSongs = playlistDetailData?.songs;
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
        const data = { playlistId: playlistDetailData?.playlistId, songId: songData?.songId };
        // Set Progress
        setAddOrRemoveMusicProgress({
            status: 'pending',
            isLoading: true,
        });
        try {
            const res = await addMusicToPlaylistApi(data);
            if (res?.status === 200 && res?.message === 'Thêm thành công') {
                // Nếu tạo thành công
                setAddOrRemoveMusicProgress({
                    status: 'success',
                    isLoading: true, // true để tránh trường hợp người dùng bấm thêm lần nữa trước khi navigate
                });

                // Cập nhật State (nếu thành công)
                // Các bài hiện tại của playlist (array)
                const playlistSongs = playlistDetailData?.songs;
                // Thêm bài hát vào playlist
                playlistSongs?.push(songData);
                // Set lại state playlistDetailData
                const newPlaylistSongs = playlistSongs;
                setPlaylistDetailData((prev) => ({
                    ...prev,
                    songs: [...newPlaylistSongs],
                }));

                return () => {
                    // clearTimeout(navigateToProfileTimeout);
                };
            } else {
                // Nếu tạo không thành công (có thể bị lỗi ở service hoặc file quá lớn)
                setAddOrRemoveMusicProgress({
                    status: 'fail',
                    isLoading: false,
                });
                // return
                return;
            }
        } catch (error) {
            // Nếu có lỗi xảy ra
            setAddOrRemoveMusicProgress({
                status: 'error',
                isLoading: false,
            });
            console.log(error);
        }
    };
    // Handle Remove Add Music
    const handleRemoveAddMusic = async (songData) => {
        // Call API
        const data = { playlistId: playlistDetailData?.playlistId, songId: songData?.songId };
        // Set Progress
        setAddOrRemoveMusicProgress({
            status: 'pending',
            isLoading: true,
        });
        try {
            const res = await removeMusicFromPlaylistApi(data.playlistId, data.songId);
            if (res?.status === 200 && res?.message === 'Xóa thành công') {
                // Nếu xóa thành công
                setAddOrRemoveMusicProgress({
                    status: 'success',
                    isLoading: true, // true để tránh trường hợp người dùng bấm thêm lần nữa trước khi navigate
                });

                // Các bài hiện tại của playlist (array)
                const playlistSongs = playlistDetailData?.songs;
                // Xóa bài hát khỏi playlist
                const newPlaylistSongs = playlistSongs?.filter((item) => item?.songId !== songData?.songId);
                // Set lại state playlistDetailData
                setPlaylistDetailData((prev) => ({
                    ...prev,
                    songs: [...newPlaylistSongs],
                }));

                return () => {
                    // clearTimeout(navigateToProfileTimeout);
                };
            } else {
                // Nếu xóa không thành công (có thể bị lỗi ở service hoặc file quá lớn)
                setAddOrRemoveMusicProgress({
                    status: 'fail',
                    isLoading: false,
                });
                // return
                return;
            }
        } catch (error) {
            // Nếu có lỗi xảy ra
            setAddOrRemoveMusicProgress({
                status: 'error',
                isLoading: false,
            });
            console.log(error);
        }
    };
    // Handle Play Playlist
    const handlePlayPlaylist = async () => {
        try {
            // playlistId
            const playlistId = location.pathname.split('/')[2];
            // Call API Get Playlist (để lấy dữ liệu mới nhất của các bài nhạc)
            const res = await getPlaylistDataApi(playlistId);
            // Set state playlistDetailData
            setPlaylistDetailData(res?.data);
            // Set Playlist
            setPlaylist(res?.data?.songs);
            // Set currentIndex
            setCurrentIndex(0);
            setTypeMusicPlayer({ type: 'playlist', data: res?.data });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Fragment>
            {playlistDetailData === null ? (
                <div className="createPlaylistPage">
                    {/* Thanh chuyển tab */}
                    <div className="tabSwitchProfile">
                        <div className="profileUserName">
                            <span style={{ fontFamily: 'system-ui' }}>Danh sách phát</span>
                        </div>
                        <div className="btnComeBackBox">
                            <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                                <VscChevronLeft />
                                <span class="tooltiptext">Quay lại</span>
                            </button>
                        </div>
                    </div>
                    {/* Create Playlist Container */}
                    <div className="createPlaylistContainer">
                        <span
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '40px 0px',
                                color: '#ffffff',
                                fontFamily: 'system-ui',
                                fontSize: '15px',
                                fontWeight: '600',
                                textAlign: 'center',
                            }}
                        >
                            Không tìm thấy danh sách phát
                        </span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Ant Design Message */}
                    {/* {contextHolder} */}
                    {/* Create Playlist Page */}
                    <div className="createPlaylistPage">
                        {/* Thanh chuyển tab */}
                        <div className="tabSwitchProfile">
                            <div className="profileUserName">
                                <span style={{ fontFamily: 'system-ui' }}>Danh sách phát</span>
                            </div>
                            <div className="btnComeBackBox">
                                <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                                    <VscChevronLeft />
                                    <span class="tooltiptext">Quay lại</span>
                                </button>
                            </div>
                        </div>
                        {/* Create Playlist Container */}
                        <div className="createPlaylistContainer">
                            <div className="top">
                                {/* Playlist Info */}
                                <div className="playlistInfo">
                                    {/* Cover Image */}
                                    <div className="coverImage">
                                        <ImageAmbilight
                                            imageSrc={
                                                playlistDetailData?.coverImage
                                                    ? process.env.REACT_APP_BACKEND_URL + playlistDetailData?.coverImage
                                                    : noContentImage
                                            }
                                            style={{
                                                width: '285px',
                                                height: '285px',
                                                outline: 'rgba(135, 135, 135, 0.15) solid 1px',
                                                outlineOffset: '-1px',
                                                borderRadius: '10px',
                                            }}
                                        />
                                    </div>
                                    {/* Info */}
                                    <div className="info">
                                        {/* Loại */}
                                        <span className="type">
                                            {/* Type */}
                                            {playlistDetailData?.type === 'default' && 'Danh sách phát'}
                                            {playlistDetailData?.type === 'album' && 'Album'}
                                            {/* Privacy */}
                                            {playlistDetailData?.privacy === '0' ? ' công khai' : ' riêng tư'}
                                        </span>
                                        {/* Tiêu đề */}
                                        <span className="name">{playlistDetailData?.name}</span>
                                        {/* Owner, Feat, Colab user */}
                                        <span className="owner">
                                            {/* Owner */}
                                            {playlistDetailData?.User && (
                                                <button
                                                    className="btnOwner"
                                                    type="button"
                                                    onClick={() => {
                                                        navigate(`/profile/${playlistDetailData?.User?.userName}`);
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            playlistDetailData?.User?.userAvatar
                                                                ? process.env.REACT_APP_BACKEND_URL +
                                                                  playlistDetailData?.User?.userAvatar
                                                                : defaultAvatar
                                                        }
                                                        draggable="false"
                                                    />{' '}
                                                    {playlistDetailData?.User?.userName}
                                                </button>
                                            )}
                                            {/* Feat, colab... */}
                                            {playlistDetailData?.userTagsData?.length > 0 &&
                                                playlistDetailData?.userTagsData?.map((userTag, index) => {
                                                    if (!userTag) {
                                                        return <></>;
                                                    } else {
                                                        return (
                                                            <UserTag
                                                                key={index}
                                                                userName={userTag?.userName}
                                                                typeUserTag={'atPlaylistDetail'}
                                                                userTagData={userTag}
                                                            ></UserTag>
                                                        );
                                                    }
                                                })}
                                        </span>
                                        <span className="detail">
                                            {playlistDetailData?.songs?.length} bài nhạc{' '}
                                            <span className="spaceSymbol">·</span>{' '}
                                            <span className="createdAt">{timeAgo(playlistDetailData?.createdAt)}</span>
                                        </span>
                                        <div className="playlistControls">
                                            {/* Play playlist */}
                                            <button
                                                className="btnPlayPlaylist"
                                                type="button"
                                                onClick={handlePlayPlaylist}
                                                style={{
                                                    opacity: playlistDetailData?.songs?.length === 0 ? '0.3' : '1',
                                                    cursor:
                                                        playlistDetailData?.songs?.length === 0
                                                            ? 'not-allowed'
                                                            : 'pointer',
                                                }}
                                                disabled={playlistDetailData?.songs?.length === 0}
                                            >
                                                <IoPlaySharp /> Phát tất cả
                                            </button>
                                            {/* Add music */}
                                            <button
                                                className="btnPlayPlaylist btnOpenAddMusic"
                                                type="button"
                                                onClick={handleBtnAddMusic}
                                            >
                                                <IoAddSharp /> Tùy chỉnh
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="middle">
                                {/* List Music */}
                                <div className="listMusicContainer">
                                    <div className="listMusic">
                                        {/* Head */}
                                        <div className="headListMusic">
                                            <span className="number">#</span>
                                            <span className="music">Bài nhạc</span>
                                            <span className="time">
                                                <IoTimeOutline />
                                            </span>
                                        </div>
                                        {/* Body */}
                                        <div className="bodyListMusic">
                                            {playlistDetailData?.songs ? (
                                                <>
                                                    {playlistDetailData?.songs?.length > 0 ? (
                                                        playlistDetailData?.songs.map((song, index) => (
                                                            <MusicCard
                                                                order={index + 1}
                                                                songData={song}
                                                                typeMusicCard={'Playlist'}
                                                            />
                                                        ))
                                                    ) : (
                                                        <span
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#ffffffa3',
                                                                fontSize: '14px',
                                                                fontWeight: '500',
                                                                fontFamily: 'system-ui',
                                                                width: '100%',
                                                                height: '61px',
                                                                padding: '8px 10px',
                                                            }}
                                                        >
                                                            Chưa thêm bài nhạc nào
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '100%',
                                                        height: 'max-content',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: '8px',
                                                    }}
                                                >
                                                    <IoSyncSharp
                                                        className="loadingAnimation"
                                                        style={{ color: 'white', width: '16px', height: '16px' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom"></div>
                        </div>
                    </div>
                    {/* Add Music Box */}
                    {auth?.user?.userName === playlistDetailData?.User?.userName && isOpenCustomBox && (
                        <CustomPlaylistBox
                            key={`${playlistDetailData?.playlistId}playlistDetail`}
                            playlistDetailData={playlistDetailData}
                            setIsOpenCustomBox={setIsOpenCustomBox}
                            handleCheckIsSongAdded={handleCheckIsSongAdded}
                            handleAddMusic={handleAddMusic}
                            handleRemoveAddMusic={handleRemoveAddMusic}
                            addOrRemoveMusicProgress={addOrRemoveMusicProgress}
                        />
                    )}
                </>
            )}
        </Fragment>
    );
}

export default PlaylistDetail;

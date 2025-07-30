import { Fragment, useEffect, useState } from 'react';
import { VscChevronLeft } from 'react-icons/vsc';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPlaylistDataApi } from '~/utils/api';
import ImageAmbilight from '../components/ImageAmbilight';
import { IoPlaySharp, IoSyncSharp, IoTimeOutline } from 'react-icons/io5';
import MusicCard from '../components/MusicCard';
import noContentImage from '~/assets/images/no_content.jpg';

function PlaylistDetail() {
    // State
    const [playlistDetailData, setPlaylistDetailData] = useState();

    // Context

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

    return (
        <Fragment>
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
                                <span className="type">
                                    {playlistDetailData?.type === 'default' ? 'Danh sách phát' : 'Album'}
                                </span>
                                <span className="name">{playlistDetailData?.name}</span>
                                <span className="owner">
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
                                                        : noContentImage
                                                }
                                            />{' '}
                                            {playlistDetailData?.User?.userName}
                                        </button>
                                    )}
                                </span>
                                <span className="detail">
                                    {playlistDetailData?.songs?.length} bài nhạc <span className="spaceSymbol">·</span>{' '}
                                    <span className="createdAt">{timeAgo(playlistDetailData?.createdAt)}</span>
                                </span>
                                <div className="playlistControls">
                                    <button className="btnPlayPlaylist" type="button">
                                        <IoPlaySharp /> Phát tất cả
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
        </Fragment>
    );
}

export default PlaylistDetail;

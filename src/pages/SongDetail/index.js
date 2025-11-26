import { Fragment, useContext, useEffect, useState } from 'react';
import { VscChevronLeft } from 'react-icons/vsc';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSongDataApi } from '~/utils/api';
import ImageAmbilight from '../components/ImageAmbilight';
import {
    IoAddCircleSharp,
    IoAddSharp,
    IoCloseSharp,
    IoPlaySharp,
    IoReturnUpBack,
    IoSyncSharp,
    IoTimeOutline,
} from 'react-icons/io5';
import MusicCard from '../components/MusicCard';
import noContentImage from '~/assets/images/no_content.jpg';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import UserTag from '../components/UserTag';
import { useQueryClient } from '@tanstack/react-query';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import { AuthContext } from '~/context/auth.context';
import CustomSongBox from '../components/CustomSongBox';
import { EnvContext } from '~/context/env.context';

function SongDetail() {
    // State
    const [songDetailData, setSongDetailData] = useState();
    const [isOpenCustomBox, setIsOpenCustomBox] = useState(false);
    const [addOrRemoveMusicProgress, setAddOrRemoveMusicProgress] = useState();
    const [changedCount, setChangedCount] = useState();

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);
    // useMusicPlayerContext
    const { playlist, setPlaylist, setCurrentIndex } = useMusicPlayerContext();

    // React Query
    const queryClient = useQueryClient();

    // Listening History
    // const listenHistoryData = queryClient.getQueryData(['listeningHistory']);

    // Ref

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // songId
        const songId = location.pathname.split('/')[2];

        // // Tìm song detail trong query data "mySongs"
        // const mySongs = queryClient.getQueryData(['mySongs']);
        // const songDetail = mySongs?.find((song) => song.songId === songId);
        // // Nếu có thì set state song detail data
        // if (songDetail) {
        //     setSongDetailData(songDetail);
        // } else {
        //     // Call API Get Song Detail
        //     const getSongData = async (songId) => {
        //         const res = await getSongDataApi(songId);
        //         // Set state songDetailData
        //         setSongDetailData(res?.data);
        //     };
        //     getSongData(songId);
        // }

        // Call API Get Song Detail
        const getSongData = async (songId) => {
            const res = await getSongDataApi(songId);
            // Set state songDetailData
            setSongDetailData(res?.data);
            // Đổi title trang
            document.title = `${res?.data?.name} | mymusic: Music from everyone`;
        };
        getSongData(songId);
    }, [location.pathname.split('/')[2], changedCount]);
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
    // Handle Play Song
    const handlePlaySong = async () => {
        try {
            // songId
            const songId = location.pathname.split('/')[2];
            // Call API Get Song Data (để lấy dữ liệu mới nhất của bài nhạc)
            const res = await getSongDataApi(songId);
            // Set state songDetailData
            setSongDetailData(res?.data);
            // Set Playlist
            setPlaylist((prev) => [...prev, { ...res?.data }]);
            // Set currentIndex
            setCurrentIndex(playlist?.length);
        } catch (error) {
            console.log(error);
        }
    };
    // Handle Button Open Setting
    const handleOpenSetting = () => {
        setIsOpenCustomBox(true);
    };

    return (
        <Fragment>
            {songDetailData === null ? (
                <div className="createPlaylistPage">
                    {/* Thanh chuyển tab */}
                    <div className="tabSwitchProfile">
                        <div className="profileUserName">
                            <span style={{ fontFamily: 'system-ui' }}>Bài nhạc</span>
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
                            Không tìm thấy bài nhạc
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
                                <span style={{ fontFamily: 'system-ui' }}>Bài nhạc</span>
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
                                                songDetailData?.songImage
                                                    ? env?.backend_url + songDetailData?.songImage
                                                    : noContentImage
                                            }
                                            style={{
                                                width: '285px',
                                                height: '285px',
                                                outline: 'rgba(135, 135, 135, 0.15) solid 1px',
                                                outlineOffset: '-1px',
                                                borderRadius: '25px',
                                            }}
                                        />
                                    </div>
                                    {/* Info */}
                                    <div className="info">
                                        {/* Loại */}
                                        <span className="type">
                                            {/* Type */}
                                            Bài nhạc {songDetailData?.changedCount > 0 && `(đã chỉnh sửa)`}
                                            {/* Privacy */}
                                            {songDetailData?.privacy
                                                ? songDetailData?.privacy === '0'
                                                    ? ' công khai'
                                                    : ' riêng tư'
                                                : ''}
                                        </span>
                                        {/* Tiêu đề */}
                                        <span className="name">{songDetailData?.name}</span>
                                        {/* Owner, Feat, Colab user */}
                                        <span className="owner">
                                            {/* Owner */}
                                            {songDetailData?.User && (
                                                <button
                                                    className="btnOwner"
                                                    type="button"
                                                    onClick={() => {
                                                        navigate(`/profile/${songDetailData?.User?.userName}`);
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            songDetailData?.User?.userAvatar
                                                                ? env?.backend_url + songDetailData?.User?.userAvatar
                                                                : defaultAvatar
                                                        }
                                                        draggable="false"
                                                    />{' '}
                                                    {songDetailData?.User?.userName}
                                                </button>
                                            )}
                                            {/* Feat, colab... */}
                                            {songDetailData?.userTagsData?.length > 0 &&
                                                songDetailData?.userTagsData?.map((userTag, index) => {
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
                                            {songDetailData?.playCount} lượt phát <span className="spaceSymbol">·</span>{' '}
                                            <span className="createdAt">{timeAgo(songDetailData?.createdAt)}</span>
                                        </span>
                                        <div className="playlistControls">
                                            {/* Play playlist */}
                                            <button className="btnPlayPlaylist" type="button" onClick={handlePlaySong}>
                                                <IoPlaySharp /> Phát
                                            </button>
                                            {/* Button custom */}
                                            {auth?.user?.userName === songDetailData?.User?.userName && (
                                                <button
                                                    className="btnPlayPlaylist btnOpenAddMusic"
                                                    type="button"
                                                    onClick={handleOpenSetting}
                                                >
                                                    <IoAddSharp /> Tùy chỉnh
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="middle">{/*  */}</div>
                            <div className="bottom"></div>
                        </div>
                    </div>
                    {/* Custom Box */}
                    {auth?.user?.userName === songDetailData?.User?.userName && isOpenCustomBox && (
                        <CustomSongBox
                            key={`${songDetailData?.songId}songDetail`}
                            songDetailData={songDetailData}
                            setIsOpenCustomBox={setIsOpenCustomBox}
                            setChangedCount={setChangedCount}
                        />
                    )}
                </>
            )}
        </Fragment>
    );
}

export default SongDetail;

import { Fragment, useContext, useEffect, useState } from 'react';
import noContentImage from '~/assets/images/no_content.jpg';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import popCoverImage from '~/assets/images/pop.png';
import rockCoverImage from '~/assets/images/rock.png';
import jazzCoverImage from '~/assets/images/jazz.png';
import bluesCoverImage from '~/assets/images/blues.png';
import randbsoulCoverImage from '~/assets/images/r&bsoul.png';
import hiphopCoverImage from '~/assets/images/hiphop.png';
import edmCoverImage from '~/assets/images/edm.png';
import { IoAddSharp, IoPlaySharp, IoSyncSharp, IoTimeOutline } from 'react-icons/io5';
import { VscChevronLeft } from 'react-icons/vsc';
import ImageAmbilight from '../components/ImageAmbilight';
import UserTag from '../components/UserTag';
import { useNavigate, useParams } from 'react-router-dom';
import MusicCard from '../components/MusicCard';
import { getGenreTrendingSongsDataApi } from '~/utils/api';
import { AuthContext } from '~/context/auth.context';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';

function GenreDetailPage() {
    // State
    const [genreDetailData, setGenreDetailData] = useState();

    // Context
    const { auth } = useContext(AuthContext);
    const { setPlaylist, setCurrentIndex, setTypeMusicPlayer } = useMusicPlayerContext();

    // Ref

    // Navigation
    const { genreId } = useParams();
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---
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
    // Get Data For Genre Detail Page
    useEffect(() => {
        const getGenreTrendingSongs = async (genreId) => {
            try {
                // Call API Get Genre Trending
                const res = await getGenreTrendingSongsDataApi(genreId, 'weekly', 20, 0);
                // Kiểm tra
                if (res?.status === 200) {
                    // Set state genreDetailData
                    setGenreDetailData(res?.data);
                } else {
                    console.log('Error Get Genre Trending');
                }
            } catch (error) {
                console.log(error);
                return;
            }
        };
        getGenreTrendingSongs(genreId);
    }, []);
    // Handle Play Genre Playlist
    const handlePlayGenrePlaylist = async () => {
        try {
            // // playlistId
            // const playlistId = location.pathname.split('/')[2];
            // // Call API Get Playlist (để lấy dữ liệu mới nhất của các bài nhạc)
            // const res = await getPlaylistDataApi(playlistId);
            // // Set state playlistDetailData
            // setPlaylistDetailData(res?.data);
            // Set Playlist
            // setPlaylist([
            //     ...genreDetailData?.songs?.map((item) => {
            //         const song = { ...item.song };
            //         song.User = song.user;
            //         return song;
            //     }),
            // ]);
            // // Set currentIndex
            // setCurrentIndex(0);
            // setTypeMusicPlayer({ type: 'playlist', data: [...genreDetailData?.songs?.map((item) => item.song)] });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Fragment>
            {genreDetailData === null ? (
                <div className="createPlaylistPage">
                    {/* Thanh chuyển tab */}
                    <div className="tabSwitchProfile">
                        <div className="profileUserName">
                            <span style={{ fontFamily: 'system-ui' }}>Thể loại</span>
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
                            Không tìm thấy thể loại
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
                                <span style={{ fontFamily: 'system-ui' }}>Thể loại</span>
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
                                                genreDetailData?.genreName === 'Pop' || genreDetailData?.genreId === 1
                                                    ? popCoverImage
                                                    : genreDetailData?.genreName === 'Rock' ||
                                                      genreDetailData?.genreId === 2
                                                    ? rockCoverImage
                                                    : genreDetailData?.genreName === 'Jazz' ||
                                                      genreDetailData?.genreId === 3
                                                    ? jazzCoverImage
                                                    : genreDetailData?.genreName === 'Blues' ||
                                                      genreDetailData?.genreId === 4
                                                    ? bluesCoverImage
                                                    : genreDetailData?.genreName === 'R&B/Soul' ||
                                                      genreDetailData?.genreId === 5
                                                    ? randbsoulCoverImage
                                                    : genreDetailData?.genreName === 'Hip Hop' ||
                                                      genreDetailData?.genreId === 6
                                                    ? hiphopCoverImage
                                                    : genreDetailData?.genreName === 'EDM' ||
                                                      genreDetailData?.genreId === 7
                                                    ? edmCoverImage
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
                                        <span className="type">Bảng xếp hạng nhạc theo thể loại</span>
                                        {/* Tiêu đề */}
                                        <span className="name">
                                            {genreDetailData?.genreName === 'Pop' || genreDetailData?.genreId === 1
                                                ? 'Pop'
                                                : genreDetailData?.genreName === 'Rock' ||
                                                  genreDetailData?.genreId === 2
                                                ? 'Rock'
                                                : genreDetailData?.genreName === 'Jazz' ||
                                                  genreDetailData?.genreId === 3
                                                ? 'Jazz'
                                                : genreDetailData?.genreName === 'Blues' ||
                                                  genreDetailData?.genreId === 4
                                                ? 'Blues'
                                                : genreDetailData?.genreName === 'R&B/Soul' ||
                                                  genreDetailData?.genreId === 5
                                                ? 'R&B/Soul'
                                                : genreDetailData?.genreName === 'Hip Hop' ||
                                                  genreDetailData?.genreId === 6
                                                ? 'Hip Hop'
                                                : genreDetailData?.genreName === 'EDM' || genreDetailData?.genreId === 7
                                                ? 'EDM'
                                                : ''}
                                        </span>
                                        {/* Owner, Feat, Colab user */}
                                        <span className="owner">
                                            {/* Feat, colab... */}
                                            {genreDetailData?.songs?.length > 0 &&
                                                genreDetailData?.songs?.map((song, index) => {
                                                    if (!song) {
                                                        return <></>;
                                                    } else {
                                                        return (
                                                            <UserTag
                                                                key={index}
                                                                userName={song?.song?.user?.userName}
                                                                typeUserTag={'atPlaylistDetail'}
                                                                userTagData={song?.song?.user}
                                                            ></UserTag>
                                                        );
                                                    }
                                                })}
                                        </span>
                                        {genreDetailData?.total > 0 && (
                                            <span className="detail">
                                                {genreDetailData?.total} bài nhạc <span className="spaceSymbol">·</span>{' '}
                                                <span className="createdAt">
                                                    {genreDetailData?.songs?.[0]?.calculatedAt &&
                                                        `Cập nhật vào khoảng ${timeAgo(
                                                            genreDetailData?.songs?.[0]?.calculatedAt,
                                                        )}`}
                                                </span>
                                            </span>
                                        )}
                                        <span className="detail">
                                            <span
                                                className="createdAt"
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                    marginTop: '7px',
                                                    color: '#777777aa',
                                                }}
                                            >
                                                Danh sách này sẽ được cập nhật hằng tuần
                                            </span>
                                        </span>
                                        <div className="playlistControls">
                                            {/* Play playlist */}
                                            {/* <button
                                                className="btnPlayPlaylist"
                                                type="button"
                                                onClick={handlePlayGenrePlaylist}
                                                style={{
                                                    opacity: genreDetailData?.total === 0 ? '0.3' : '1',
                                                    cursor: genreDetailData?.total === 0 ? 'not-allowed' : 'pointer',
                                                }}
                                                disabled={genreDetailData?.total === 0}
                                            >
                                                <IoPlaySharp /> Phát tất cả
                                            </button> */}
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
                                            {genreDetailData?.songs ? (
                                                <>
                                                    {genreDetailData?.songs?.length > 0 ? (
                                                        genreDetailData?.songs.map((song, index) => (
                                                            <MusicCard
                                                                order={index + 1}
                                                                songData={song.song}
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
                                                            Không có dữ liệu
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
                    {/*  */}
                </>
            )}
        </Fragment>
    );
}

export default GenreDetailPage;

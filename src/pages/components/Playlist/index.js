import { useContext, useState } from 'react';
import { CgPlayList } from 'react-icons/cg';
import {
    IoChevronDownSharp,
    IoChevronUpSharp,
    IoEyeOutline,
    IoGlobeOutline,
    IoLockClosedOutline,
} from 'react-icons/io5';
import { PiPlaylist } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/auth.context';
import MusicCard from '../MusicCard';
import noContentImage from '~/assets/images/no_content.jpg';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import UserTag from '../UserTag';
import { EnvContext } from '~/context/env.context';

function Playlist({ data, currentIndex, type }) {
    // State
    const [isOpenPlaylist, setIsOpenPlaylist] = useState(false);

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // Ref

    // Navigation
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---
    // Format thời gian tạo bài chia sẻ
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
    // Format thời gian tạo bài chia sẻ (timestamp) sang định dạng "dd/mm/yyyy HH:MM"
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day} Tháng ${month}, ${year} lúc ${hours}:${minutes}`;
    };
    const handleOpenPlaylist = () => {
        setIsOpenPlaylist(!isOpenPlaylist);
        //
        const middleMusicPlayer = document.getElementById('middleMusicPlayerID');
        if (!isOpenPlaylist) {
            const middleMusicPlayerScrollTimeout = setTimeout(() => {
                middleMusicPlayer.scrollTop = 167;
            }, 205);
            return () => {
                clearTimeout(middleMusicPlayerScrollTimeout);
            };
        }
    };

    // Ở Music Player
    if (type === 'musicPlayer') {
        return (
            <div className="playlistContainer">
                <div className="playlist">
                    {/* Title */}
                    <div
                        className="title"
                        onClick={() => {
                            handleOpenPlaylist();
                        }}
                        style={{
                            backgroundColor: isOpenPlaylist ? '#1f1f1fd5' : '',
                        }}
                    >
                        <div style={{ marginTop: '4px' }}>
                            <CgPlayList />
                        </div>
                        <div className="playlistInfo">
                            <span className="nextSong">
                                Tiếp theo:{' '}
                                {currentIndex === data?.data?.songs?.length - 1
                                    ? `${data?.data?.songs[0]?.name} (đăng bởi ${data?.data?.songs[0]?.User?.userName})`
                                    : `${data?.data?.songs[currentIndex + 1]?.name} (đăng bởi ${
                                          data?.data?.songs[currentIndex + 1]?.User?.userName
                                      })`}
                            </span>
                            <span className="name">Danh sách phát "{data?.data?.name}"</span>
                        </div>
                        <div>{isOpenPlaylist ? <IoChevronUpSharp /> : <IoChevronDownSharp />}</div>
                    </div>
                    {/* Main */}
                    <div className="main" style={{ height: isOpenPlaylist ? '200px' : '0px' }}>
                        {data?.data?.songs?.map((song, index) => (
                            <MusicCard order={index + 1} songData={song} typeMusicCard={'MusicPlayerPlaylist'} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // type === 'atFeedPage'
    if (type === 'atFeedPage') {
        return (
            <>
                <div className="feedItemPlaylist">
                    <div className="playlistContainer">
                        <div className="playlist">
                            <div className="left">
                                <div className="icon">
                                    <PiPlaylist />
                                </div>
                            </div>
                            <div className="right">
                                <div className="top">
                                    <div className="playlistInfo">
                                        {/* Type */}
                                        <span className="name">
                                            {data?.type === 'default' ? 'Danh sách phát' : 'Album'}
                                        </span>
                                        {/* Privacy */}
                                        <span className="privacy">
                                            {data?.privacy === '0' ? (
                                                <IoGlobeOutline style={{ color: 'dimgray' }} />
                                            ) : (
                                                <IoLockClosedOutline style={{ color: 'dimgray' }} />
                                            )}
                                        </span>
                                        {/* Created At */}
                                        <span className="createdAt tooltip">
                                            {timeAgo(data?.createdAt)}
                                            <span className="tooltiptext">{formatTimestamp(data?.createdAt)}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="middle">
                                    <div className="playlistContent">
                                        {/* Cover Image */}
                                        <div className="coverImageContainer">
                                            <img
                                                className="coverImage"
                                                src={
                                                    data?.coverImage
                                                        ? env?.backend_url + data?.coverImage
                                                        : noContentImage
                                                }
                                            />
                                        </div>
                                        <div className="nameAndOwner">
                                            {/* Name */}
                                            <span
                                                className="name"
                                                onClick={() => {
                                                    navigate(`/playlist/${data?.playlistId}`);
                                                }}
                                            >
                                                {data?.name || ''}
                                            </span>
                                            {/* Owner and Feat (userTags) */}
                                            <span className="ownerAndUserTags">
                                                {/* Owner */}
                                                {data?.User && (
                                                    <button
                                                        className="btnOwner"
                                                        type="button"
                                                        onClick={() => {
                                                            navigate(`/profile/${data?.User?.userName}`);
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                data?.User?.userAvatar
                                                                    ? env?.backend_url + data?.User?.userAvatar
                                                                    : defaultAvatar
                                                            }
                                                            draggable="false"
                                                        />{' '}
                                                        {data?.User?.userName}
                                                    </button>
                                                )}
                                                {/* Feat, colab... */}
                                                {data?.userTagsData?.length > 0 &&
                                                    data?.userTagsData?.map((userTag, index) => {
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
                                        </div>
                                        {/* Button To Playlist Detail */}
                                        <button
                                            className="btnToPlaylistDetail"
                                            onClick={() => {
                                                navigate(`/playlist/${data?.playlistId}`);
                                            }}
                                        >
                                            <IoEyeOutline />
                                        </button>
                                    </div>
                                </div>
                                <div className="bottom"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return <></>;
}

export default Playlist;

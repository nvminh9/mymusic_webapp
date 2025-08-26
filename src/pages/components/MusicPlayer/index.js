import Hls from 'hls.js';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import {
    IoPlaySharp,
    IoPauseSharp,
    IoPlaySkipBackSharp,
    IoPlaySkipForwardSharp,
    IoShuffleSharp,
    IoRepeatSharp,
    IoVolumeHighSharp,
    IoVolumeMuteSharp,
    IoHeartSharp,
    IoSparklesSharp,
    IoRefreshSharp,
    IoHeartOutline,
    IoChevronUpSharp,
    IoChevronDownSharp,
    IoClose,
    IoSyncSharp,
    IoAdd,
} from 'react-icons/io5';
import CircumIcon from '@klarr-agency/circum-icons-react';
import Slider from 'react-slick';
import ImageAmbilight from '../ImageAmbilight';
import VideoAmbilight from '../VideoAmbilight';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMusicPlayer } from '~/hooks/useMusicPlayer';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import { CgPlayList, CgPlayListAdd } from 'react-icons/cg';
import { IoMdShareAlt } from 'react-icons/io';
import { MdFullscreen, MdFullscreenExit, MdPictureInPictureAlt } from 'react-icons/md';
import logo from '~/assets/images/logoWhiteTransparent_noR.png';
import LikeSongButton from '../LikeSongButton';
import Playlist from '../Playlist';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getListPlaylistOfUserDataApi } from '~/utils/api';
import { AuthContext } from '~/context/auth.context';
import PlaylistCard from '../PlaylistCard';
import NextSongRecommend from '../NextSongRecommend';

function MusicPlayer() {
    // State
    const [isMusicPlayerMaximized, setIsMusicPlayerMaximized] = useState(false);
    const [isOpenAddToPlaylistBox, setIsOpenAddToPlaylistBox] = useState(false);

    // Context
    const {
        playlist,
        setPlaylist,
        isPlaying,
        isShuffle,
        setIsRepeatOne,
        isRepeatOne,
        isRepeatAll,
        setIsRepeatAll,
        volume,
        currentTime,
        duration,
        isSongMuted,
        isBlocked,
        currentIndex,
        isAutoNextSong,
        setIsAutoNextSong,
        isLikedSong,
        setIsLikedSong,
        typeMusicPlayer,
    } = useMusicPlayerContext();

    // useMusicPlayer (Custom Hook)
    const {
        audioRef,
        currentSong,
        thumbnails,
        togglePlay,
        next,
        previous,
        shuffle,
        handleVolumeChange,
        handleSeek,
        formatTime,
        handleEnded,
        handleBtnVolume,
        handleLikeSong,
    } = useMusicPlayer();

    // Auth
    const { auth } = useContext(AuthContext);

    // React Query
    const queryClient = useQueryClient();
    // Call API Get List Playlist
    const {
        status,
        data: listPlaylistData,
        error,
    } = useQuery({
        queryKey: ['listPlaylist'],
        queryFn: async () => {
            const res = await getListPlaylistOfUserDataApi(auth?.user?.userId);
            // setPlaylistData(res?.data);
            return res?.data;
        },
    });

    // Config Slider Carousel Thumbnail (React Slick)
    let sliderRef = useRef(null);
    const settings = {
        dots: thumbnails?.length > 1 ? true : false,
        arrows: false,
        infinite: thumbnails?.length > 1 ? true : false,
        draggable: thumbnails?.length > 1 ? true : false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        accessibility: false,
        // adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    draggable: thumbnails?.length > 1 ? true : false,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    draggable: thumbnails?.length > 1 ? true : false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    // slidesToShow: 1,
                    // slidesToScroll: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    draggable: thumbnails?.length > 1 ? true : false,
                },
            },
        ],
    };

    // Ref
    const addToPlaylistBoxRef = useRef(null);

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // --- HANDLE FUNCTION ---
    // Phóng to / thu nhỏ music player
    const handleMaximizeMinimizeMusicPlayer = () => {
        let middleContainer = document.getElementById('middleContainerID');
        let rightContainerID = document.getElementById('rightContainerID');
        if (isMusicPlayerMaximized) {
            rightContainerID.classList = 'col l-3 m-0 c-0 rightContainer';
            middleContainer.classList = 'col l-6 m-12 c-12 middleContainer';
            setIsMusicPlayerMaximized(false);
        } else {
            rightContainerID.classList = 'col l-12 m-0 c-0 rightContainer';
            middleContainer.classList = 'col l-0 m-12 c-12 middleContainer';
            setIsMusicPlayerMaximized(true);
        }
    };
    // Animation cho tên bài hát
    const activeSongNameMarquee = () => {
        let songName = document.getElementById('songNameID');
        if (songName && songName.offsetWidth > 300) {
            songName.classList.add('songNameMarqueeActived');
        }
    };
    const turnOffSongNameMarquee = () => {
        let songName = document.getElementById('songNameID');
        songName.classList.remove('songNameMarqueeActived');
        songName.style.transform = 'transformX("0px")';
    };
    // Handle click outside Add To Playlist Box
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addToPlaylistBoxRef.current && !addToPlaylistBoxRef.current.contains(event.target)) {
                setIsOpenAddToPlaylistBox(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Fragment>
            <div className="songPlayer">
                {/* top */}
                <div className="top">
                    <span className="title">
                        {isMusicPlayerMaximized ? (
                            <img src={logo} style={{ width: '95px' }} draggable="false" />
                        ) : (
                            'Music Player'
                        )}
                    </span>
                    <div className="options">
                        {/* Nút phóng to / thu nhỏ trình phát nhạc */}
                        <button className="btnFullScreen tooltip" onClick={handleMaximizeMinimizeMusicPlayer}>
                            {isMusicPlayerMaximized ? (
                                <>
                                    {/* <CircumIcon name="minimize_1" /> */}
                                    <MdFullscreenExit />
                                    <span class="tooltiptext">Thu nhỏ</span>
                                </>
                            ) : (
                                <>
                                    {/* <CircumIcon name="maximize_1" /> */}
                                    <MdFullscreen />
                                    <span class="tooltiptext">Phóng to</span>
                                </>
                            )}
                        </button>
                        {/* Nút chế độ hình trong hình */}
                        <button className="btnPicInPic tooltip">
                            {/* <CircumIcon name="minimize_2" /> */}
                            <MdPictureInPictureAlt />
                            <span class="tooltiptext">Trình phát thu nhỏ</span>
                        </button>
                    </div>
                </div>
                {/* middle */}
                <div className="middle" id="middleMusicPlayerID">
                    {/* topBack */}
                    <div className="topBack"></div>
                    {/* Thumbnail */}
                    <div className="carouselThumbnail">
                        <Slider
                            ref={(slider) => {
                                sliderRef = slider;
                            }}
                            {...settings}
                        >
                            {thumbnails?.map((thumbnail, index) => (
                                <div className="thumbnail" key={index}>
                                    {thumbnail?.imageUrl && (
                                        <ImageAmbilight imageSrc={thumbnail?.imageUrl}></ImageAmbilight>
                                    )}
                                    {thumbnail?.videoUrl && (
                                        <VideoAmbilight videoSrc={thumbnail?.videoUrl}></VideoAmbilight>
                                    )}
                                </div>
                            ))}
                        </Slider>
                    </div>
                    {/* Song Info */}
                    <div className="songInfo">
                        {/* Name */}
                        {currentSong && (
                            <div className="name">
                                <span
                                    id="songNameID"
                                    onMouseOver={activeSongNameMarquee}
                                    onMouseLeave={turnOffSongNameMarquee}
                                    onClick={() => {
                                        if (location.pathname.split('/')[2] !== currentSong?.songId) {
                                            navigate(`/song/${currentSong?.songId}`);
                                        }
                                    }}
                                >
                                    {currentSong?.name || ''}
                                </span>
                            </div>
                        )}
                        <div className="artist">
                            <button
                                type="button"
                                className="btnArtist"
                                style={{ textDecoration: 'none' }}
                                onClick={() => {
                                    if (location.pathname.split('/')[2] !== currentSong?.User?.userName) {
                                        navigate(`/profile/${currentSong?.User?.userName}`);
                                    }
                                }}
                            >
                                <span>{currentSong?.User?.userName || ''}</span>
                            </button>
                        </div>
                    </div>
                    {/* Audio */}
                    <audio
                        ref={audioRef}
                        onEnded={() => {
                            // onEnded handled
                            handleEnded();
                        }}
                        controls={false}
                        preload="auto"
                    />
                    {/* Progress Bar */}
                    {currentSong && (
                        <div className="progressBarContainer">
                            {/* Progress */}
                            <input
                                className="progressBar"
                                type="range"
                                min="0"
                                max={duration}
                                value={currentTime}
                                onChange={handleSeek}
                                style={{
                                    margin: '0px',
                                    cursor: !playlist?.length || playlist?.length < 1 ? 'not-allowed' : 'pointer',
                                }}
                            />
                            {/* Time */}
                            <div className="timeBar">
                                <div className="left" id="leftTimeBarID">
                                    {formatTime(currentTime)}
                                </div>
                                <div className="right" id="rightTimeBarID">
                                    {formatTime(duration)}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Song Interact Button Box */}
                    <div className="interactButtonBoxContainer">
                        <div className="interactButtonBox">
                            {/* Button Like Song */}
                            {currentSong && (
                                <LikeSongButton
                                    key={currentSong?.songId}
                                    songData={currentSong}
                                    playlist={playlist}
                                    setPlaylist={setPlaylist}
                                />
                            )}
                            {/* Button Add To Playlist */}
                            <div className="btnLikeSongContainer">
                                <button
                                    type="button"
                                    className={`btnLikeSong ${
                                        !playlist?.length || playlist?.length < 1 ? 'btnDisabled' : ''
                                    }`}
                                    disabled={!playlist?.length || playlist?.length < 1 ? true : false}
                                    onClick={() => {
                                        setIsOpenAddToPlaylistBox(true);
                                    }}
                                    style={{
                                        borderRadius: '25px',
                                        gap: '3px',
                                        padding: '7px 12px',
                                    }}
                                >
                                    <CgPlayListAdd />{' '}
                                    <span
                                        style={{
                                            fontFamily: 'system-ui',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                        }}
                                    >
                                        Thêm vào danh sách phát
                                    </span>
                                </button>
                            </div>
                            {/* Button Share Song */}
                            <div className="btnLikeSongContainer">
                                <button
                                    type="button"
                                    className={`btnLikeSong ${
                                        !playlist?.length || playlist?.length < 1 ? 'btnDisabled' : ''
                                    }`}
                                    disabled={!playlist?.length || playlist?.length < 1 ? true : false}
                                    // onClick={() => {
                                    //     handleLikeSong();
                                    // }}
                                    style={{
                                        borderRadius: '25px',
                                        gap: '3px',
                                        padding: '7px 12px',
                                    }}
                                >
                                    <IoMdShareAlt />{' '}
                                    <span
                                        style={{
                                            fontFamily: 'system-ui',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                        }}
                                    >
                                        Chia sẻ
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Playlist */}
                    {typeMusicPlayer?.type === 'playlist' && (
                        <Playlist data={typeMusicPlayer} currentIndex={currentIndex} type={'musicPlayer'} />
                    )}
                    {/* Next Song Recommend */}
                    {typeMusicPlayer?.type === 'song' && <NextSongRecommend />}
                    {/* Add To Playlist Box */}
                    {isOpenAddToPlaylistBox && (
                        <div className="addToPlaylistBox">
                            <div ref={addToPlaylistBoxRef} className="addToPlaylist">
                                {/* Title */}
                                <div className="title">
                                    <span>Lưu nhạc vào...</span>
                                    <button
                                        type="button"
                                        className="btnClose"
                                        onClick={() => {
                                            setIsOpenAddToPlaylistBox(false);
                                        }}
                                    >
                                        <IoClose />
                                    </button>
                                </div>
                                {/* List Playlist */}
                                <div className="listPlaylist">
                                    {/* Render list playlist */}
                                    {listPlaylistData?.length > 0 ? (
                                        <>
                                            {listPlaylistData?.map((playlist) => (
                                                <div className="playlistCard">
                                                    <PlaylistCard
                                                        key={playlist?.playlistId}
                                                        playlistData={playlist}
                                                        typePlaylistCard={'atAddToPlaylistBox'}
                                                    />
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: 'max-content',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: '8px',
                                                    paddingTop: '150px',
                                                }}
                                            >
                                                <IoSyncSharp
                                                    className="loadingAnimation"
                                                    style={{ color: 'white', width: '16px', height: '16px' }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                {/* Button Create Playlist */}
                                <div className="btnCreatePlaylistContainer">
                                    <button
                                        type="button"
                                        className="btnCreatePlaylist"
                                        onClick={() => {
                                            if (
                                                location.pathname.split('/')[1] +
                                                    '/' +
                                                    location.pathname.split('/')[2] !==
                                                'playlist/create'
                                            ) {
                                                navigate(`/playlist/create`);
                                            }
                                        }}
                                    >
                                        <IoAdd /> Danh sách phát mới
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* bottom */}
                <div className="bottom">
                    {/* Controls */}
                    <div className="controlsContainer">
                        <div className="controls">
                            <div className="btnVolumeControlContainer">
                                {/* Volume Control */}
                                {!playlist?.length || playlist?.length < 1 ? (
                                    <></>
                                ) : (
                                    <div className="volumeControl">
                                        <input
                                            className="volumeControlRange"
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={audioRef?.current?.volume !== 0 ? volume : 0}
                                            onChange={handleVolumeChange}
                                        />
                                    </div>
                                )}
                                <button
                                    className={`btnVolumeControl ${
                                        !playlist?.length || playlist?.length < 1 ? 'btnDisabled' : ''
                                    }`}
                                    onClick={() => {
                                        handleBtnVolume();
                                    }}
                                    disabled={!playlist?.length || playlist?.length < 1 ? true : false}
                                >
                                    {isSongMuted ? <IoVolumeMuteSharp /> : <IoVolumeHighSharp />}
                                </button>
                            </div>
                            <div className="btnShuffleContainer">
                                <button
                                    className={`btnShuffle ${
                                        !playlist?.length || playlist?.length <= 1 ? 'btnDisabled' : ''
                                    }`}
                                    onClick={() => {
                                        shuffle();
                                    }}
                                    style={{
                                        backgroundColor: isShuffle ? '#ffffff' : '',
                                        color: isShuffle ? '#000' : '#ffffff',
                                        position: 'relative',
                                    }}
                                    disabled={!playlist?.length || playlist?.length <= 1 ? true : false}
                                >
                                    <IoShuffleSharp />
                                    {isShuffle && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                backgroundColor: '#ffffff',
                                                color: '#000',
                                                fontFamily: 'system-ui',
                                                fontSize: '6px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '50%',
                                                padding: '4px 3px',
                                                top: '2px',
                                                right: '4px',
                                            }}
                                        >
                                            ON
                                        </span>
                                    )}
                                </button>
                            </div>
                            <div className="btnPreviousSongContainer">
                                <button
                                    className={`btnPreviousSong ${
                                        !playlist?.length || playlist?.length < 1 || currentIndex === 0
                                            ? 'btnDisabled'
                                            : ''
                                    }`}
                                    onClick={previous}
                                    disabled={
                                        !playlist?.length || playlist?.length < 1 || currentIndex === 0 ? true : false
                                    }
                                >
                                    <IoPlaySkipBackSharp />
                                </button>
                            </div>
                            <div className="btnPlayContainer">
                                <button
                                    className={`btnPlay ${
                                        !playlist?.length || playlist?.length < 1 ? 'btnDisabled' : ''
                                    }`}
                                    onClick={togglePlay}
                                    disabled={!playlist?.length || playlist?.length < 1 ? true : false}
                                >
                                    {isPlaying && <IoPauseSharp />}
                                    {!isPlaying && <IoPlaySharp />}
                                    {/* {!isPlaying && currentTime === duration && <IoRefreshSharp />} */}
                                </button>
                            </div>
                            <div className="btnNextSongContainer">
                                <button
                                    className={`btnNextSong ${
                                        !playlist?.length ||
                                        playlist?.length < 1 ||
                                        currentIndex === playlist?.length - 1
                                            ? 'btnDisabled'
                                            : ''
                                    }`}
                                    onClick={next}
                                    disabled={
                                        !playlist?.length ||
                                        playlist?.length < 1 ||
                                        currentIndex === playlist?.length - 1
                                            ? true
                                            : false
                                    }
                                >
                                    <IoPlaySkipForwardSharp />
                                </button>
                            </div>
                            <div className="btnRepeatContainer">
                                <button
                                    className={`btnRepeat ${
                                        !playlist?.length || playlist?.length < 1 ? 'btnDisabled' : ''
                                    }`}
                                    onClick={() => setIsRepeatOne(!isRepeatOne)}
                                    style={{
                                        backgroundColor: isRepeatOne ? '#ffffff' : '',
                                        color: isRepeatOne ? '#000' : '#ffffff',
                                        position: 'relative',
                                    }}
                                    disabled={!playlist?.length || playlist?.length < 1 ? true : false}
                                >
                                    {isRepeatOne && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                backgroundColor: 'transparent',
                                                color: '#000',
                                                fontFamily: 'system-ui',
                                                fontSize: '8px',
                                                fontWeight: '400',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '50%',
                                                padding: '4px 3px',
                                                top: '2px',
                                                right: '4px',
                                            }}
                                        >
                                            1
                                        </span>
                                    )}

                                    <IoRepeatSharp />
                                </button>
                            </div>
                            <div className="btnAutoNextSongContainer">
                                <button
                                    className={`btnAutoNextSong ${
                                        !playlist?.length || playlist?.length < 1 ? 'btnDisabled' : ''
                                    }`}
                                    disabled={!playlist?.length || playlist?.length < 1 ? true : false}
                                    onClick={() => setIsAutoNextSong(!isAutoNextSong)}
                                >
                                    <span className="title">AUTO</span>
                                    <span className="status" style={{ color: isAutoNextSong ? '#2ecc71' : '#d63031' }}>
                                        {isAutoNextSong ? 'ON' : 'OFF'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Music Player đang phát ở Tab khác */}
                {isBlocked && (
                    <div className="musicPlayerBlocked">
                        <div>
                            <div style={{ width: '100%' }}>
                                <div class="boxContainer">
                                    <div class="box box1"></div>
                                    <div class="box box2"></div>
                                    <div class="box box3"></div>
                                    <div class="box box4"></div>
                                    <div class="box box5"></div>
                                </div>
                            </div>
                            <span style={{ display: 'block', width: '100%', color: '#ffffff' }}>
                                Đang phát trên tab khác...
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default MusicPlayer;

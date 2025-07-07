import Hls from 'hls.js';
import { Fragment, useEffect, useRef, useState } from 'react';
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
} from 'react-icons/io5';
import CircumIcon from '@klarr-agency/circum-icons-react';
import Slider from 'react-slick';
import ImageAmbilight from '../ImageAmbilight';
import VideoAmbilight from '../VideoAmbilight';
import { Link } from 'react-router-dom';
import { useMusicPlayer } from '~/hooks/useMusicPlayer';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';

function MusicPlayer() {
    // State
    const [isMusicPlayerMaximized, setIsMusicPlayerMaximized] = useState(false);

    // Context
    const {
        playlist,
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
    } = useMusicPlayer();

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

    return (
        <Fragment>
            <div className="songPlayer">
                {/* top */}
                <div className="top">
                    <span className="title">Song Player</span>
                    <div className="options">
                        {/* Nút phóng to / thu nhỏ trình phát nhạc */}
                        <button className="btnFullSreen tooltip" onClick={handleMaximizeMinimizeMusicPlayer}>
                            {isMusicPlayerMaximized ? (
                                <>
                                    <CircumIcon name="minimize_1" />
                                    <span class="tooltiptext">Thu nhỏ</span>
                                </>
                            ) : (
                                <>
                                    <CircumIcon name="maximize_1" />
                                    <span class="tooltiptext">Phóng to</span>
                                </>
                            )}
                        </button>
                        {/* Nút chế độ hình trong hình */}
                        <button className="btnPicInPic tooltip">
                            <CircumIcon name="minimize_2" />
                            <span class="tooltiptext">Trình phát thu nhỏ</span>
                        </button>
                    </div>
                </div>
                {/* middle */}
                <div className="middle">
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
                        <div className="name">
                            <span
                                id="songNameID"
                                onMouseOver={activeSongNameMarquee}
                                onMouseLeave={turnOffSongNameMarquee}
                            >
                                {currentSong?.name || 'Không có bài nhạc'}
                            </span>
                        </div>
                        <div className="artist">
                            <Link to={`/profile/${currentSong?.User?.userName}`} style={{ textDecoration: 'none' }}>
                                <span>{currentSong?.User?.userName || ''}</span>
                            </Link>
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
                    <div className="progressBarContainer">
                        {/* Progress */}
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            style={{ accentColor: '#ffffff', margin: '0px' }}
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
                                        !playlist?.length || playlist?.length < 1 ? 'btnShuffleDisabled' : ''
                                    }`}
                                    onClick={() => {
                                        shuffle();
                                    }}
                                    style={{
                                        backgroundColor: isShuffle ? '#ffffff' : '',
                                        color: isShuffle ? '#000' : '#ffffff',
                                        position: 'relative',
                                    }}
                                    disabled={!playlist?.length || playlist?.length < 1 ? true : false}
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
                                        !playlist?.length || playlist?.length < 1 ? 'btnDisabled' : ''
                                    }`}
                                    onClick={previous}
                                    disabled={!playlist?.length || playlist?.length < 1 ? true : false}
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
                                    {isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
                                </button>
                            </div>
                            <div className="btnNextSongContainer">
                                <button
                                    className={`btnNextSong ${
                                        !playlist?.length || playlist?.length < 1 ? 'btnDisabled' : ''
                                    }`}
                                    onClick={next}
                                    disabled={!playlist?.length || playlist?.length < 1 ? true : false}
                                >
                                    <IoPlaySkipForwardSharp />
                                </button>
                            </div>
                            <div className="btnRepeatContainer">
                                <button
                                    className={`btnRepeat ${
                                        !playlist?.length || playlist?.length < 1 ? 'btnRepeatDisabled' : ''
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
                            <div className="btnLikeSongContainer">
                                <button
                                    className={`btnLikeSong ${
                                        !playlist?.length || playlist?.length < 1 ? 'btnDisabled' : ''
                                    }`}
                                    disabled={!playlist?.length || playlist?.length < 1 ? true : false}
                                >
                                    <IoSparklesSharp
                                        className="sparkles"
                                        style={{ transform: 'translate(-11px, -7px)' }}
                                    />
                                    <IoHeartSharp />
                                    <IoSparklesSharp
                                        className="sparkles"
                                        style={{ transform: 'translate(8px, 6px)' }}
                                    />
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

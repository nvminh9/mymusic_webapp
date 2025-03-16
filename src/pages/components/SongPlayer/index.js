import { Fragment, useState } from 'react';
import CircumIcon from '@klarr-agency/circum-icons-react';
import Slider from 'react-slick';
import { useRef, useEffect } from 'react';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import Hls from 'hls.js';
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
import swimmingPool from '~/assets/videos/swimmingPool.mp4';
import { Link } from 'react-router-dom';
// import Component
import VideoAmbilight from '../VideoAmbilight';
import ImageAmbilight from '../ImageAmbilight';
// hết import Component

function SongPlayer() {
    // State (useState)
    var [isPlay, setIsPlay] = useState();
    const [isSongLiked, setIsSongLiked] = useState();
    var [isSongMuted, setIsSongMuted] = useState();
    const [isSongPlayerMaximized, setIsSongPlayerMaximized] = useState(false);

    // Ref (useRef)
    const audioHLSRef = useRef(null);
    const btnLikeSong = useRef(null);
    const btnVolumeControl = useRef(null);

    // config slider cho carousel thumbnail (React Slick)
    let sliderRef = useRef(null);
    const settings = {
        dots: true,
        arrows: false,
        infinite: false,
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
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
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
                },
            },
        ],
    };

    // Thumbnails data
    const thumbnails = [
        {
            imageUrl: `https://upload.wikimedia.org/wikipedia/en/4/4b/KendrickLamarSwimmingPools.jpg`,
        },
        {
            videoUrl: swimmingPool,
        },
    ];

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

    // Test HLS
    // test với api file m3u8 trên mạng
    // const videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    // test với file m3u8 trên máy
    // const videoSrc = videoTestHLS;
    // test với file video trên ImageKit.io, dùng thư viện hls.js để phát (lỗi)
    // const videoSrc = `https://ik.imagekit.io/d7q5hnktr/timanhghen.mp4?updatedAt=1734602507871`;
    // const videoHLSRef = useRef(null);
    // var audioHLSFile = `https://mymusic-api-1n5t.onrender.com/music/lutherAudio_master.m3u8`;
    var audioHLSFile = `http://localhost:3700/v1/api/music/swimmingpool_master.m3u8`;
    useEffect(() => {
        const hls = new Hls();
        // TẠM THỜI COMMENT LẠI (DO API SONG CHƯA HOÀN THIỆN)
        // if (Hls.isSupported()) {
        //     hls.loadSource(audioHLSFile);
        //     if (audioHLSRef.current) {
        //         hls.attachMedia(audioHLSRef.current);
        //         // isPlay ? audioHLSRef.current.play() : console.log(audioHLSRef.current);
        //         // Đang lỗi do khi người dùng mới truy cập vào web (hay domain) nếu chưa tương tác với web thì sẽ ko thể autoPlay được
        //         // Vì vậy sẽ xử lý theo cách khác
        //         // audioHLSRef.current.play();
        //     }
        // }
    }, []);

    // Custom Song Progress Bar (Test)
    useEffect(() => {
        var progressBar = document.getElementById('progressBarID');
        var progressed = document.getElementById('progressedID');
        var leftTimeBar = document.getElementById('leftTimeBarID');
        var rightTimeBarID = document.getElementById('rightTimeBarID');

        progressed.style.width =
            (audioHLSRef.current.currentTime * 100) /
                (isNaN(audioHLSRef.current.duration) ? 1 : audioHLSRef.current.duration) +
            '%';
        audioHLSRef.current.ontimeupdate = function (e) {
            progressed.style.width = (audioHLSRef.current.currentTime * 100) / audioHLSRef.current.duration + '%';
            progressBar.onclick = function (e) {
                audioHLSRef.current.currentTime = (e.offsetX / progressBar.offsetWidth) * audioHLSRef.current.duration;
            };
            leftTimeBar.innerText =
                Math.floor(audioHLSRef.current.currentTime / 60) +
                ':' +
                Math.floor(audioHLSRef.current.currentTime % 60);
            if (isNaN(audioHLSRef.current.duration)) {
                rightTimeBarID.innerText = '0:0';
            } else {
                rightTimeBarID.innerText =
                    Math.floor(audioHLSRef.current.duration / 60) + ':' + Math.floor(audioHLSRef.current.duration % 60);
            }
            if ((audioHLSRef.current.currentTime * 100) / audioHLSRef.current.duration == 100) {
                setIsPlay(false);
            }
            // console.log('audioHLSRef Time: ' + `${audioHLSRef.current.currentTime}`);
            // console.log('audioHLSRef Duration: ' + `${audioHLSRef.current.duration}`);
            // console.log(
            //     'audioHLSRef Percent: ' + `${(audioHLSRef.current.currentTime * 100) / audioHLSRef.current.duration}%`,
            // );
        };
    }, []);

    // Config các Keyboard Event
    useEffect(() => {
        document.body.onkeyup = function (e) {
            // if (e.key == ' ' || e.code == 'Space' || e.keyCode == 32) {
            //     if (isPlay) {
            //         audioHLSRef.current.pause();
            //         setIsPlay(false);
            //         isPlay = false;
            //         return;
            //     } else {
            //         audioHLSRef.current.play();
            //         setIsPlay(true);
            //         isPlay = true;
            //         return;
            //     }
            // }
            // if (e.key == 'm' || e.code == 'KeyM' || e.keyCode == 77) {
            //     if (isSongMuted) {
            //         audioHLSRef.current.muted = false;
            //         setIsSongMuted(false);
            //         isSongMuted = false;
            //         return;
            //     } else {
            //         audioHLSRef.current.muted = true;
            //         setIsSongMuted(true);
            //         isSongMuted = true;
            //         return;
            //     }
            // }
        };
    }, []);

    // Function for Top Controls Bar
    // Phóng to / thu nhỏ trình phát nhạc
    const handleMaximizeMinimizeSongPlayer = () => {
        let middleContainer = document.getElementById('middleContainerID');
        let rightContainerID = document.getElementById('rightContainerID');
        if (isSongPlayerMaximized) {
            rightContainerID.classList = 'col l-3 m-0 c-0 rightContainer';
            middleContainer.classList = 'col l-6 m-12 c-12 middleContainer';
            setIsSongPlayerMaximized(false);
        } else {
            rightContainerID.classList = 'col l-12 m-0 c-0 rightContainer';
            middleContainer.classList = 'col l-0 m-12 c-12 middleContainer';
            setIsSongPlayerMaximized(true);
        }
    };
    // Bật / tắt chế độ hình trong hình
    const handlePicInPicSongPlayer = () => {};

    // Function for Song Controls Bar
    // Nút phát/dừng nhạc
    const handlePlayPauseSong = () => {
        if (isPlay) {
            audioHLSRef.current.pause();
            setIsPlay(false);
            return;
        }
        audioHLSRef.current.play();
        setIsPlay(true);
        return;
    };
    // Nút thích nhạc
    const handleBtnLikeSong = () => {
        let sparkles = document.getElementsByClassName('sparkles');
        if (isSongLiked) {
            if (sparkles) {
                sparkles[0].classList.remove('sparklesActived');
                sparkles[1].classList.remove('sparklesActived');
            }
            btnLikeSong.current.classList.remove('btnLikeSongActived');
            setIsSongLiked(false);
            return;
        }
        if (sparkles) {
            sparkles[0].classList.add('sparklesActived');
            sparkles[1].classList.add('sparklesActived');
        }
        btnLikeSong.current.classList.add('btnLikeSongActived');
        setIsSongLiked(true);
        return;
    };
    // Nút điều chỉnh âm lượng
    const handleBtnVolumeControl = () => {
        if (isSongMuted) {
            audioHLSRef.current.muted = false;
            setIsSongMuted(false);
            return;
        }
        audioHLSRef.current.muted = true;
        setIsSongMuted(true);
        return;
    };

    return (
        <Fragment>
            <div className="songPlayer">
                {/* top */}
                <div className="top">
                    <span className="title">Song Player</span>
                    <div className="options">
                        {/* Nút phóng to / thu nhỏ trình phát nhạc */}
                        <button className="btnFullSreen tooltip" onClick={handleMaximizeMinimizeSongPlayer}>
                            {isSongPlayerMaximized ? (
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
                            {thumbnails.map((thumbnail, index) => (
                                <div className="thumbnail" key={index}>
                                    {thumbnail.imageUrl && (
                                        <ImageAmbilight imageSrc={thumbnail.imageUrl}></ImageAmbilight>
                                    )}
                                    {thumbnail.videoUrl && (
                                        <VideoAmbilight videoSrc={thumbnail.videoUrl}></VideoAmbilight>
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
                                Swimming Pool
                            </span>
                        </div>
                        <div className="artist">
                            <Link to={`/profile/kendricklamar`} style={{ textDecoration: 'none' }}>
                                <span>Kendrick Lamar</span>
                            </Link>
                        </div>
                        {/* test với link nhúng (thẻ iframe) có HLS ABS của ImageKit.io * (sử dụng HLS) (iframe này giao diện ko đẹp, khó custom)/}
                        {/* <iframe
                            width="560"
                            height="315"
                            src="https://imagekit.io/player/embed/d7q5hnktr/thuyet_trinh.mp4/ik-master.m3u8?updatedAt=1734597978231&thumbnail=https%3A%2F%2Fik.imagekit.io%2Fd7q5hnktr%2Fthuyet_trinh.mp4%2Fik-thumbnail.jpg%3FupdatedAt%3D1734597978231&updatedAt=1734597978231&tr=sr-240_360_480_720_1080"
                            title="ImageKit video player"
                            frameBorder="0"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; controls"
                            style={{ width: '300px' }}
                        >
                            {' '}
                        </iframe> */}
                        {/* test với link file trên ImageKit.io, gán trực tiếp vào thẻ video */}
                        {/* <video src={videoSrc} id="videoHLS" controls style={{ width: '300px' }}></video> */}
                        {/* test với link file trên ImageKit.io sử dụng thư viện hls.js */}
                        {/* <video ref={videoHLSRef} id="videoHLS" controls style={{ width: '300px' }}></video> */}
                    </div>
                    {/* Audio Test */}
                    <audio ref={audioHLSRef} id="audioHLS"></audio>
                    {/* Progress Bar */}
                    <div className="progressBarContainer">
                        {/* Progress */}
                        <div className="progressBar" id="progressBarID">
                            <div className="progressed" id="progressedID"></div>
                        </div>
                        {/* Time */}
                        <div className="timeBar">
                            <div className="left" id="leftTimeBarID">
                                0:27
                            </div>
                            <div className="right" id="rightTimeBarID">
                                2:57
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
                                <button
                                    className="btnVolumeControl"
                                    ref={btnVolumeControl}
                                    onClick={handleBtnVolumeControl}
                                >
                                    {isSongMuted ? (
                                        <IoVolumeMuteSharp></IoVolumeMuteSharp>
                                    ) : (
                                        <IoVolumeHighSharp></IoVolumeHighSharp>
                                    )}
                                </button>
                            </div>
                            <div className="btnShuffleContainer">
                                <button className="btnShuffle">
                                    <IoShuffleSharp></IoShuffleSharp>
                                </button>
                            </div>
                            <div className="btnPreviousSongContainer">
                                <button className="btnPreviousSong">
                                    <IoPlaySkipBackSharp></IoPlaySkipBackSharp>
                                </button>
                            </div>
                            <div className="btnPlayContainer">
                                <button className="btnPlay" onClick={handlePlayPauseSong}>
                                    {isPlay ? <IoPauseSharp></IoPauseSharp> : <IoPlaySharp></IoPlaySharp>}
                                </button>
                            </div>
                            <div className="btnNextSongContainer">
                                <button className="btnNextSong">
                                    <IoPlaySkipForwardSharp></IoPlaySkipForwardSharp>
                                </button>
                            </div>
                            <div className="btnRepeatContainer">
                                <button className="btnRepeat">
                                    <IoRepeatSharp></IoRepeatSharp>
                                </button>
                            </div>
                            <div className="btnLikeSongContainer">
                                <button className="btnLikeSong" ref={btnLikeSong} onClick={handleBtnLikeSong}>
                                    <IoSparklesSharp
                                        className="sparkles"
                                        style={{ transform: 'translate(-11px, -7px)' }}
                                    ></IoSparklesSharp>
                                    <IoHeartSharp></IoHeartSharp>
                                    <IoSparklesSharp
                                        className="sparkles"
                                        style={{ transform: 'translate(8px, 6px)' }}
                                    ></IoSparklesSharp>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default SongPlayer;

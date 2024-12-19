import { Fragment } from 'react';
import CircumIcon from '@klarr-agency/circum-icons-react';
import videoTest from '~/assets/videos/thuyet_trinh.mp4';
import videoTestHLS from '~/assets/videos/thuyet_trinh_playlist.m3u8';
import imageTest from '~/assets/images/gnxKendrick.jpg';
import audioTest from '~/assets/audio/lutherAudio.mp3';
import coverMySongTest2 from '~/assets/images/timanhghen.jpg';
import Slider from 'react-slick';
import { useRef, useEffect } from 'react';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import Hls from 'hls.js';
import { IKContext, IKVideo } from 'imagekitio-react';
// import Component
import VideoAmbilight from '../VideoAmbilight';
import ImageAmbilight from '../ImageAmbilight';
// hết import Component

function SongPlayer() {
    // Test HLS

    // test với api file m3u8 trên mạng
    // const videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

    // test với file m3u8 trên máy
    // const videoSrc = videoTestHLS;

    // test với file video trên ImageKit.io, dùng thư viện hls.js để phát (lỗi)
    // const videoSrc = `https://ik.imagekit.io/d7q5hnktr/timanhghen.mp4?updatedAt=1734602507871`;

    // const videoHLSRef = useRef(null);

    // useEffect(() => {
    //     const hls = new Hls();
    //     if (Hls.isSupported()) {
    //         hls.loadSource(videoSrc);
    //         if (videoHLSRef.current) {
    //             hls.attachMedia(videoHLSRef.current);
    //         }
    //     }
    // }, []);

    // test (chưa chính thức)
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

    // Thumbnail data test
    const thumbnails = [
        {
            // tên hình
            imageUrl: `timanhghen.jpg`,
        },
        {
            // tên video
            videoUrl: `timanhghen.mp4`,
        },
    ];

    return (
        <Fragment>
            <div className="songPlayer">
                {/* top */}
                <div className="top">
                    <span className="title">Song Player</span>
                    <div className="options">
                        <button className="btnFullSreen">
                            <CircumIcon name="maximize_1" />
                        </button>
                        <button className="btnPicInPic">
                            <CircumIcon name="minimize_2" />
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
                                TIM ANH GHEN (ft. LVK, Dangrangto, TeuYungBoy) [prod. by rev, sleepat6pm]
                            </span>
                        </div>
                        <div className="artist">
                            <span>Wxrdie</span>
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
                </div>
                {/* bottom */}
                <div className="bottom"></div>
            </div>
        </Fragment>
    );
}

export default SongPlayer;

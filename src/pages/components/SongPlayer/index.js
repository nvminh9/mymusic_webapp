import { Fragment } from 'react';
import CircumIcon from '@klarr-agency/circum-icons-react';
import videoTest from '~/assets/videos/timanhghen.mp4';
import imageTest from '~/assets/images/gnxKendrick.jpg';
import audioTest from '~/assets/audio/lutherAudio.mp3';
import coverMySongTest2 from '~/assets/images/timanhghen.jpg';
import Slider from 'react-slick';
import { useRef, useEffect } from 'react';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import Hls from 'hls.js';
// import Component
import VideoAmbilight from '../VideoAmbilight';
import ImageAmbilight from '../ImageAmbilight';
// hết import Component

function SongPlayer() {
    // Test HLS
    const videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const videoHLSRef = useRef(null);

    // const audioSrc =
    //     'https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa-audio-only.m3u8';
    // const audioHLSRef = useRef(null);

    useEffect(() => {
        const hls = new Hls();
        if (Hls.isSupported()) {
            hls.loadSource(videoSrc);
            if (videoHLSRef.current) {
                hls.attachMedia(videoHLSRef.current);
            }
        }
    }, []);

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
            imageUrl: coverMySongTest2,
        },
        {
            videoUrl: videoTest,
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
                                    {/* {thumbnail.videoUrl && (
                                        <VideoAmbilight videoSrc={thumbnail.videoUrl}></VideoAmbilight>
                                    )} */}
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
                        <video ref={videoHLSRef} id="videoHLS" controls style={{ width: '300px' }}></video>
                    </div>
                </div>
                {/* bottom */}
                <div className="bottom"></div>
            </div>
        </Fragment>
    );
}

export default SongPlayer;

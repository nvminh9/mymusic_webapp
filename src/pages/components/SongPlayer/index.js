import { Fragment } from 'react';
import CircumIcon from '@klarr-agency/circum-icons-react';
import videoTest from '~/assets/videos/timanhghen.mp4';
import imageTest from '~/assets/images/gnxKendrick.jpg';
import audioTest from '~/assets/audio/lutherAudio.mp3';
import coverMySongTest2 from '~/assets/images/timanhghen.jpg';
import Slider from 'react-slick';
import { useRef, useEffect } from 'react';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
// import Component
import VideoAmbilight from '../VideoAmbilight';
import ImageAmbilight from '../ImageAmbilight';
// hết import Component

function SongPlayer() {
    // test (chưa chính thức)
    useEffect(() => {
        let songName = document.getElementById('songNameID');
        if (songName && songName.offsetWidth > 300) {
            songName.classList.add('songNameMarqueeActived');
        }
    }, []);

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
                            <span id="songNameID">
                                TIM ANH GHEN (ft. LVK, Dangrangto, TeuYungBoy) [prod. by rev, sleepat6pm]
                            </span>
                        </div>
                        <div className="artist">
                            <span>Wxrdie</span>
                        </div>
                    </div>
                </div>
                {/* bottom */}
                <div className="bottom"></div>
            </div>
        </Fragment>
    );
}

export default SongPlayer;

import { Fragment } from 'react';
import CircumIcon from '@klarr-agency/circum-icons-react';
import videoTest from '~/assets/videos/pain.mp4';
import imageTest from '~/assets/images/gnxKendrick.jpg';
import Slider from 'react-slick';
import { useRef } from 'react';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
// import Component
import VideoAmbilight from '../VideoAmbilight';
import ImageAmbilight from '../ImageAmbilight';
// hết import Component

function SongPlayer() {
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
            imageUrl: imageTest,
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
                                    {thumbnail.imageUrl && <ImageAmbilight imageSrc={imageTest}></ImageAmbilight>}
                                    {thumbnail.videoUrl && <VideoAmbilight videoSrc={videoTest}></VideoAmbilight>}
                                </div>
                            ))}
                        </Slider>
                    </div>
                    {/* Song Info */}
                    <div className="songInfo"></div>
                </div>
                {/* bottom */}
                <div className="bottom"></div>
            </div>
        </Fragment>
    );
}

export default SongPlayer;

import { useEffect, useRef } from 'react';
import aptBanner from '~/assets/images/643564536.jpg';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import { Outlet } from 'react-router-dom';
import { Fragment } from 'react';
import axios from '../../utils/axios.customize';
// import Component
import Carousel from '../components/Carousel';
// hết import Component

function HomePage() {
    // config slider (React Slick)
    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };
    const settings = {
        dots: true,
        Infinity: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        accessibility: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };
    // slide hình mẫu
    const slides = [
        {
            img: `https://static01.nyt.com/images/2024/11/22/arts/22kendrick-album/22kendrick-album-facebookJumbo.jpg`,
        },
        {
            img: aptBanner,
        },
        {
            img: `https://mensfolio.vn/wp-content/uploads/2023/11/20231311_MENSFOLIO_GRAMMY-1.webp`,
        },
        {
            img: `https://img.vietcetera.com/uploads/images/16-oct-2023/feature.jpg`,
        },
        {
            img: `https://i.ytimg.com/vi/eW4AM1539-g/maxresdefault.jpg`,
        },
        {
            img: `https://www.sportshub.com.sg/sites/default/files/2024-05/CAS2025-1200x675-hi-res.png`,
        },
    ];
    // data mẫu cho carousel Dành cho bạn
    const dataMixedForYou = [
        {
            img: `https://al.sndcdn.com/labs-c93bb0af-0-t500x500.jpg?q=YXJ0d29ya190eXBlOiBNRUdBX01JWAp1cm5zOiAic291bmRjbG91ZDp0cmFja3M6MTIyODEyNjc1NiIKdXJuczogInNvdW5kY2xvdWQ6dHJhY2tzOjE1MjIxNzU5ODMiCnVybnM6ICJzb3VuZGNsb3VkOnRyYWNrczoxMTY0NjE3MTcwIgp1cm5zOiAic291bmRjbG91ZDp0cmFja3M6MTcwMDcxOTQ3OSIKdXJuczogInNvdW5kY2xvdWQ6dHJhY2tzOjE1ODY5OTcxOTEiCg%3D%3D`,
            info1: 'Mega Mix',
            info2: `Cảnh Hưng, Tez, naughty kid, Chànq Try Năm Ngoái, Alex`,
            type: 'playlist',
        },
        {
            img: `https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/daily/4/ab6761610000e5eb4b2da0b72cab26ac518f1f0d/vi`,
            info1: 'Daily Mix 4',
            info2: 'Deftones',
            type: 'playlist',
        },
        {
            img: `https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/daily/4/ab6761610000e5eb4b2da0b72cab26ac518f1f0d/vi`,
            info1: 'Daily Mix 4',
            info2: 'Deftones',
            type: 'playlist',
        },
    ];
    // data mẫu cho carousel Âm nhạc thịnh hành
    const dataTrendingMusic = [
        {
            img: `https://static01.nyt.com/images/2024/11/22/arts/22kendrick-album/22kendrick-album-facebookJumbo.jpg`,
            info1: 'GNX',
            info2: 'Kendrick Lamar',
            type: 'song',
        },
        {
            img: aptBanner,
            info1: 'APT',
            info2: 'Rose ft. Bruno Mars',
            type: 'song',
        },
        {
            img: `https://mensfolio.vn/wp-content/uploads/2023/11/20231311_MENSFOLIO_GRAMMY-1.webp`,
            info1: 'Đá tan',
            info2: 'Ngọt',
            type: 'song',
        },
        {
            img: `https://img.vietcetera.com/uploads/images/16-oct-2023/feature.jpg`,
            info1: 'Đánh đổi',
            info2: 'Obito ft. MCK',
            type: 'song',
        },
        {
            img: `https://i.ytimg.com/vi/eW4AM1539-g/maxresdefault.jpg`,
            info1: 'TRỞ VỀ',
            info2: 'Wxrdie ft. JustaTee',
            type: 'song',
        },
        {
            img: `https://www.sportshub.com.sg/sites/default/files/2024-05/CAS2025-1200x675-hi-res.png`,
            info1: 'Cry',
            info2: 'Cigarettes After Sex',
            type: 'song',
        },
    ];
    // data mẫu cho carousel Nhạc Theo thể loại
    const dataSongByGenre = [
        {
            img: `https://i1.sndcdn.com/artworks-405SXVNHbz8mzHNv-5Z35dw-t500x500.jpg`,
            info1: 'Pop',
            info2: 'Genre',
            type: 'playlist',
        },
        {
            img: `https://i1.sndcdn.com/artworks-J5PgDX18TAcCBZMD-7HgRcw-t500x500.jpg`,
            info1: 'Hip Hop & Rap',
            info2: 'Genre',
            type: 'playlist',
        },
        {
            img: `https://i1.sndcdn.com/artworks-hKhAdJqrPFA50ydp-RVWo2Q-t500x500.jpg`,
            info1: 'Rock',
            info2: 'Genre',
            type: 'playlist',
        },
        {
            img: `https://i1.sndcdn.com/artworks-ITaPkyvGgrRMh6zK-9JZ0uw-t500x500.jpg`,
            info1: 'Indie',
            info2: 'Genre',
            type: 'playlist',
        },
        {
            img: `https://i1.sndcdn.com/artworks-KklvPbOcNqis0t72-xKiLAw-t500x500.jpg`,
            info1: 'R&B',
            info2: 'Genre',
            type: 'playlist',
        },
        {
            img: `https://i1.sndcdn.com/artworks-oyBVayO8ytBG3uUG-gwqKXg-t500x500.jpg`,
            info1: 'Electronic',
            info2: 'Genre',
            type: 'playlist',
        },
    ];
    // Đổi title trang
    useEffect(() => {
        document.title = 'Home | mymusic: Music from everyone';
    }, []);

    return (
        <div className="homePage">
            {/* Phần carousel news */}
            <div className="carouselNews" style={{ marginBottom: '20px' }}>
                <Slider
                    ref={(slider) => {
                        sliderRef = slider;
                    }}
                    {...settings}
                >
                    {slides.map((slide, index) => (
                        <Fragment key={index}>
                            <div>
                                <img
                                    src={slide.img}
                                    className="slide-image"
                                    style={{
                                        height: '300px',
                                        width: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                    }}
                                />
                            </div>
                        </Fragment>
                    ))}
                </Slider>
                <button className="btnPrevCarousel" onClick={previous}>
                    <VscChevronLeft />
                </button>
                <button className="btnNextCarousel" onClick={next}>
                    <VscChevronRight />
                </button>
            </div>
            {/* Phần carousel mixed for you */}
            <div className="carouselMixedForYou">
                <div className="title">
                    <span>Dành cho bạn</span>
                </div>
                <Carousel slides={dataMixedForYou}></Carousel>
            </div>
            {/* Phần carousel trending music */}
            <div className="carouselTrendingMusic">
                <div className="title">
                    <span>Âm nhạc thịnh hành</span>
                </div>
                <Carousel slides={dataTrendingMusic}></Carousel>
            </div>
            {/* Phần carousel nhạc theo thể loại */}
            <div className="carouselByGenre">
                <div className="title">
                    <span>Theo thể loại</span>
                </div>
                <Carousel slides={dataSongByGenre}></Carousel>
            </div>
            <div style={{ padding: '8px' }}>
                <h1>
                    <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>Hello</span> World!
                </h1>
                <h1>
                    Hello <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>mymusic</span>!
                </h1>
            </div>
        </div>
    );
}

export default HomePage;

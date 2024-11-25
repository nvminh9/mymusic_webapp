import logo from '~/assets/images/logoNoBackground.png';
import { useEffect, useRef } from 'react';
import aptBanner from '~/assets/images/643564536.jpg';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';

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

    // Đổi title trang
    useEffect(() => {
        document.title = 'Home | mymusic';
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
                    {slides.map((slide) => (
                        <>
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
                        </>
                    ))}
                </Slider>
                <button className="btnPrevCarousel" onClick={previous}>
                    <VscChevronLeft />
                </button>
                <button className="btnNextCarousel" onClick={next}>
                    <VscChevronRight />
                </button>
            </div>
            <div style={{ padding: '8px' }}>
                <h1>
                    <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>Hello</span> World!
                </h1>
                <h1>
                    Hello <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>mymusic</span>!
                </h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
                <h1>Hello World!</h1>
                <h1>Hello mymusic!</h1>
            </div>
        </div>
    );
}

export default HomePage;

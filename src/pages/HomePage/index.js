import { useContext, useEffect, useRef } from 'react';
import news1 from '~/assets/images/news1.png';
import news2 from '~/assets/images/news2.png';
import news3 from '~/assets/images/news3.png';
import news4 from '~/assets/images/news4.png';
import news5 from '~/assets/images/news5.png';
import news6 from '~/assets/images/news6.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import { Fragment } from 'react';
import { getListOfGenreDataApi, getTrendingSongsDataApi } from '~/utils/api';
// import Component
import Carousel from '../components/Carousel';
import { AuthContext } from '~/context/auth.context';
import { useQuery } from '@tanstack/react-query';
// hết import Component

function HomePage() {
    // State (useState)

    // Context (useContext)
    // const { auth, setAuth, isFirstLoading, setIsFirstLoading } = useContext(AuthContext);

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
            img: news1,
        },
        {
            img: news2,
        },
        {
            img: news3,
        },
        {
            img: news4,
        },
        {
            img: news5,
        },
        {
            img: news6,
        },
    ];

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // Đổi title trang
        document.title = 'Home | mymusic: Music from everyone';
    }, []);
    // React Query
    const { data: trendingSongsData, isLoading: isLoadingTrendingSongs } = useQuery({
        queryKey: ['trendingSongs'],
        queryFn: async () => {
            try {
                // Call API Get Trending Songs Data
                // period = weekly, limit = 20, personalized = false
                const res = await getTrendingSongsDataApi('weekly', 20, false);
                //
                return res.data;
            } catch (error) {
                console.log(error);
                return;
            }
        },
    });
    const { data: trendingSongsPersonalizedData, isLoading: isLoadingTrendingSongsPersonalized } = useQuery({
        queryKey: ['trendingSongsPersonalized'],
        queryFn: async () => {
            try {
                // Call API Get Trending Songs Data
                // period = weekly, limit = 20, personalized = true
                const res = await getTrendingSongsDataApi('weekly', 20, true);
                //
                return res.data;
            } catch (error) {
                console.log(error);
                return;
            }
        },
    });
    const { data: listOfGenreData, isLoading: isLoadingListOfGenreData } = useQuery({
        queryKey: ['listOfGenre'],
        queryFn: async () => {
            try {
                // Call API Get List Of Genre Data
                const res = await getListOfGenreDataApi();
                //
                return res.data;
            } catch (error) {
                console.log(error);
                return;
            }
        },
    });

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
                            <div style={{ padding: '8px' }}>
                                <img
                                    src={slide.img}
                                    className="slide-image"
                                    style={{
                                        height: '300px',
                                        width: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        borderRadius: '8px',
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
                {trendingSongsPersonalizedData?.songs?.length > 0 ? (
                    <Carousel
                        key={'carouselTrendingSongsPersonalizedKey'}
                        slides={trendingSongsPersonalizedData?.songs}
                    ></Carousel>
                ) : (
                    <span
                        style={{
                            display: 'block',
                            fontFamily: 'system-ui',
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#2e2e2e',
                            width: '100%',
                            height: '184px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Không có dữ liệu
                    </span>
                )}
            </div>
            {/* Phần carousel trending music */}
            <div className="carouselTrendingMusic">
                <div className="title">
                    <span>Âm nhạc thịnh hành</span>
                </div>
                {trendingSongsData?.songs?.length > 0 ? (
                    <Carousel key={'carouselTrendingSongsKey'} slides={trendingSongsData.songs}></Carousel>
                ) : (
                    <span
                        style={{
                            display: 'block',
                            fontFamily: 'system-ui',
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#2e2e2e',
                            width: '100%',
                            height: '184px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Không có dữ liệu
                    </span>
                )}
            </div>
            {/* Phần carousel nhạc theo thể loại */}
            <div className="carouselByGenre">
                <div className="title">
                    <span>Theo thể loại</span>
                </div>
                {listOfGenreData?.length > 0 ? (
                    <Carousel key={'carouselListOfGenreKey'} slides={listOfGenreData} type={'listOfGenre'}></Carousel>
                ) : (
                    <span
                        style={{
                            display: 'block',
                            fontFamily: 'system-ui',
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#2e2e2e',
                            width: '100%',
                            height: '184px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Không có dữ liệu
                    </span>
                )}
            </div>
            {/* Footer */}
            {/* <div style={{ padding: '8px', display: 'flex', overflow: 'auto', width: 'max-content' }}>
                <div style={{ width: 'max-content' }}>
                    <h1>
                        <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>Hello</span> World!
                    </h1>
                    <h1>
                        Hello <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>mymusic</span>!
                    </h1>
                </div>
                <div style={{ width: 'max-content' }}>
                    <h1>
                        <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>Hello</span> World!
                    </h1>
                    <h1>
                        Hello <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>mymusic</span>!
                    </h1>
                </div>
                <div style={{ width: 'max-content' }}>
                    <h1>
                        <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>Hello</span> World!
                    </h1>
                    <h1>
                        Hello <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>mymusic</span>!
                    </h1>
                </div>
                <div style={{ width: 'max-content' }}>
                    <h1>
                        <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>Hello</span> World!
                    </h1>
                    <h1>
                        Hello <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>mymusic</span>!
                    </h1>
                </div>
            </div> */}
        </div>
    );
}

export default HomePage;

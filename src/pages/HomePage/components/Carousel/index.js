// Component Carousel
// * dùng chung để hiện các danh sách theo ô nằm ngang như danh sách dành cho bạn, nhạc thịnh hành,...
// ---------------------------------------------------------------------------------------------------
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import aptBanner from '~/assets/images/643564536.jpg';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import { useRef } from 'react';
import { Fragment } from 'react';

function Carousel({ slides }) {
    // config carousel (React Slick)
    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };
    const settings = {
        dots: false,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4.5,
        slidesToScroll: 2,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    // slidesToShow: 1,
                    // slidesToScroll: 1,
                    slidesToShow: 2.5,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
        ],
    };
    // data mẫu
    // nếu data không có thì gán bằng mảng rỗng, hoặc bằng mảng data mẫu
    slides || (slides = []);

    return (
        <>
            <div className="carousel">
                <Slider
                    ref={(slider) => {
                        sliderRef = slider;
                    }}
                    {...settings}
                >
                    {slides.map((slide, index) => (
                        <Fragment key={index}>
                            <div
                                className="carouselItem"
                                style={{
                                    display: 'grid',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src={slide.img}
                                    className="slide-image"
                                    style={{
                                        height: '150px',
                                        width: '150px',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        // border: '.5px solid rgba(18, 18, 18, 0.8)',
                                    }}
                                />
                                <div
                                    className="info"
                                    style={{
                                        display: 'grid',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span
                                        className="info1"
                                        style={{
                                            color: '#ffffff',
                                            paddingBottom: '1px',
                                            paddingTop: '5px',
                                            fontSize: '14px',
                                            fontWeight: '400',
                                            width: '115px',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: '1',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {slide.info1}
                                    </span>
                                    <span
                                        className="info2"
                                        style={{
                                            color: 'rgba(119, 119, 119, 0.6666666667)',
                                            fontSize: '14px',
                                            fontWeight: '300',
                                            width: '115px',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: '1',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {slide.info2}
                                    </span>
                                </div>
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
        </>
    );
}

export default Carousel;

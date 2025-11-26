// Component Carousel
// * dùng chung để hiện các danh sách theo ô nằm ngang như danh sách dành cho bạn, nhạc thịnh hành,...
// ---------------------------------------------------------------------------------------------------
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import { useContext, useRef } from 'react';
import { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import noContentImage from '~/assets/images/no_content.jpg';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import popCoverImage from '~/assets/images/pop.png';
import rockCoverImage from '~/assets/images/rock.png';
import jazzCoverImage from '~/assets/images/jazz.png';
import bluesCoverImage from '~/assets/images/blues.png';
import randbsoulCoverImage from '~/assets/images/r&bsoul.png';
import hiphopCoverImage from '~/assets/images/hiphop.png';
import edmCoverImage from '~/assets/images/edm.png';
import { EnvContext } from '~/context/env.context';

function Carousel({ slides, type }) {
    // State

    // Context
    const { env } = useContext(EnvContext);

    // Ref

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

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
        draggable: slides.length > 2 ? true : false,
        slidesToShow: 4.5,
        slidesToScroll: 4,
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

    // type === 'listOfGenre'
    if (type === 'listOfGenre') {
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
                                    onClick={() => {
                                        navigate(`/genre/${slide?.genreId}`);
                                    }}
                                >
                                    <div>
                                        <img
                                            src={
                                                slide?.name === 'Pop'
                                                    ? popCoverImage
                                                    : slide?.name === 'Rock'
                                                    ? rockCoverImage
                                                    : slide?.name === 'Jazz'
                                                    ? jazzCoverImage
                                                    : slide?.name === 'Blues'
                                                    ? bluesCoverImage
                                                    : slide?.name === 'R&B/Soul'
                                                    ? randbsoulCoverImage
                                                    : slide?.name === 'Hip Hop'
                                                    ? hiphopCoverImage
                                                    : slide?.name === 'EDM'
                                                    ? edmCoverImage
                                                    : noContentImage
                                            }
                                            className="slide-image"
                                            style={{
                                                height: '154px',
                                                width: '100%',
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                borderRadius: '5px',
                                                outline: '1px solid rgba(135, 135, 135, 0.15)',
                                                outlineOffset: '-1px',
                                                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                                                // border: '.5px solid rgba(18, 18, 18, 0.8)',
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="info"
                                        style={{
                                            display: 'grid',
                                            alignItems: 'center',
                                            gap: '2px',
                                            paddingTop: '12px',
                                        }}
                                    >
                                        {/* Song Name */}
                                        <span
                                            className="info1"
                                            style={{
                                                color: '#ffffff',
                                                fontFamily: 'system-ui',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                width: '115px',
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: '1',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {slide?.name}
                                        </span>
                                        {/* User */}
                                        <span
                                            className="info2"
                                            style={{
                                                color: 'rgba(119, 119, 119, 0.6666666667)',
                                                fontFamily: 'system-ui',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                width: '115px',
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: '1',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            Thể loại
                                        </span>
                                    </div>
                                </div>
                            </Fragment>
                        ))}
                    </Slider>
                    {slides.length > 2 && (
                        <>
                            <button className="btnPrevCarousel" onClick={previous}>
                                <VscChevronLeft />
                            </button>
                            <button className="btnNextCarousel" onClick={next}>
                                <VscChevronRight />
                            </button>
                        </>
                    )}
                </div>
            </>
        );
    }

    // type default (List Song For You, List Song Trending)
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
                                onClick={() => {
                                    navigate(
                                        slide?.song?.songId || slide?.Song?.songId
                                            ? `/song/${slide?.song?.songId || slide?.Song?.songId}`
                                            : `/playlist/playlistId`,
                                    );
                                }}
                            >
                                <div>
                                    <img
                                        src={
                                            slide?.song?.songImage
                                                ? env?.backend_url + slide?.song?.songImage
                                                : slide?.Song?.songImage
                                                ? env?.backend_url + slide?.Song?.songImage
                                                : noContentImage
                                        }
                                        className="slide-image"
                                        style={{
                                            height: '154px',
                                            width: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            borderRadius: '5px',
                                            outline: '1px solid rgba(135, 135, 135, 0.15)',
                                            outlineOffset: '-1px',
                                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                                            // border: '.5px solid rgba(18, 18, 18, 0.8)',
                                        }}
                                    />
                                </div>
                                <div
                                    className="info"
                                    style={{
                                        display: 'grid',
                                        alignItems: 'center',
                                        gap: '2px',
                                        paddingTop: '12px',
                                    }}
                                >
                                    {/* Song Name */}
                                    <span
                                        className="info1"
                                        style={{
                                            color: '#ffffff',
                                            fontFamily: 'system-ui',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            width: '115px',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: '1',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {slide?.song?.name || slide?.Song?.name}
                                    </span>
                                    {/* User */}
                                    <span
                                        className="info2"
                                        style={{
                                            color: 'rgba(119, 119, 119, 0.6666666667)',
                                            fontFamily: 'system-ui',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            width: '115px',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: '1',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {slide?.song?.user?.userName || slide?.Song?.User?.userName}
                                    </span>
                                </div>
                            </div>
                        </Fragment>
                    ))}
                </Slider>
                {slides.length > 2 && (
                    <>
                        <button className="btnPrevCarousel" onClick={previous}>
                            <VscChevronLeft />
                        </button>
                        <button className="btnNextCarousel" onClick={next}>
                            <VscChevronRight />
                        </button>
                    </>
                )}
            </div>
        </>
    );
}

export default Carousel;

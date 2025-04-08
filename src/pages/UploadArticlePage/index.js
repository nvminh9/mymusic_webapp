import { useState, useEffect, Fragment, useRef, useContext } from 'react';
import { VscChevronLeft, VscChevronRight, VscEllipsis } from 'react-icons/vsc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';

function UploadArticlePage() {
    // State

    // Context
    const { auth } = useContext(AuthContext);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // Config Carousel Media (React Slick)
    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };
    const settings = {
        // dots: feed.feed.media.length > 1 ? true : false,
        dots: true,
        arrows: false,
        // infinite: feed.feed.media.length > 1 ? true : false,
        infinite: true,
        // draggable: feed.feed.media.length > 1 ? true : false,
        draggable: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        accessibility: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    // draggable: feed.feed.media.length > 1 ? true : false,
                    draggable: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    // draggable: feed.feed.media.length > 1 ? true : false,
                    draggable: true,
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
                    // draggable: feed.feed.media.length > 1 ? true : false,
                    draggable: true,
                },
            },
        ],
    };

    // --- HANDLE FUNCTIONS ---

    return (
        <Fragment>
            <div className="uploadArticlePage">
                {/* Thanh chuyển tab */}
                <div className="tabSwitchProfile">
                    <div className="profileUserName">
                        <span>Tạo bài viết mới</span>
                    </div>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div>
                {/* Upload Article */}
                <div className="feedPage">
                    <div className="articleContainer">
                        <div className="article">
                            <div className="left">
                                {/* Avatar */}
                                <div className="userAvatar">
                                    <Link to={`/profile/${auth?.user?.userName}`} style={{ textDecoration: 'none' }}>
                                        <img
                                            src={
                                                auth?.user?.userAvatar
                                                    ? process.env.REACT_APP_BACKEND_URL + auth?.user?.userAvatar
                                                    : defaultAvatar
                                            }
                                        />
                                    </Link>
                                </div>
                            </div>
                            <div className="right">
                                <div className="top">
                                    <div className="articleInfo">
                                        <Link
                                            to={`/profile/${auth?.user?.userName}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <span className="userName">{auth?.user?.userName}</span>
                                        </Link>
                                        {/* <span className="createdAt"></span> */}
                                    </div>
                                    <div className="articleOptions">
                                        <button className="btnArticleOptions">
                                            <VscEllipsis></VscEllipsis>
                                        </button>
                                    </div>
                                </div>
                                <div className="middle">
                                    <div className="content">
                                        {/* <div className="text">Tiêu đề bài viết</div> */}
                                        <textarea
                                            className="text"
                                            placeholder="Nhập nội dung bài viết..."
                                            style={{
                                                background: 'transparent',
                                                borderRadius: '5px',
                                                border: '.5px solid transparent',
                                                fontFamily: "'Funnel Sans', sans-serif",
                                                maxWidth: '100%',
                                                minWidth: '100%',
                                                minHeight: 'max-content',
                                                padding: '0px 0px 8px 0px',
                                            }}
                                        />
                                        <div className="media">
                                            {/* Carousel Media */}
                                            <div className="carouselMedia">
                                                <Slider
                                                    ref={(slider) => {
                                                        sliderRef = slider;
                                                    }}
                                                    {...settings}
                                                >
                                                    {/* {feed.feed.media.map((mediaContent, index) => (
                                                        <Fragment key={index}>
                                                            <div className="mediaContainer">
                                                                <img
                                                                    src={mediaContent.imageUrl}
                                                                    className="slide-image"
                                                                    style={{}}
                                                                />
                                                            </div>
                                                        </Fragment>
                                                    ))} */}
                                                    <Fragment>
                                                        <div className="mediaContainer">
                                                            <img
                                                                src={
                                                                    auth?.user?.userAvatar
                                                                        ? process.env.REACT_APP_BACKEND_URL +
                                                                          auth?.user?.userAvatar
                                                                        : defaultAvatar
                                                                }
                                                                className="slide-image"
                                                                style={{}}
                                                            />
                                                        </div>
                                                    </Fragment>
                                                    <Fragment>
                                                        <div className="mediaContainer">
                                                            <img
                                                                src={`https://upload.wikimedia.org/wikipedia/en/4/4b/KendrickLamarSwimmingPools.jpg`}
                                                                className="slide-image"
                                                                style={{}}
                                                            />
                                                        </div>
                                                    </Fragment>
                                                </Slider>
                                                {2 >= 2 && (
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
                                        </div>
                                    </div>
                                </div>
                                <div className="bottom"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default UploadArticlePage;

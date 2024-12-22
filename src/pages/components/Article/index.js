import { VscEllipsis } from 'react-icons/vsc';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import { useRef } from 'react';
import { Fragment } from 'react';
import Slider from 'react-slick';
import aptBanner from '~/assets/images/643564536.jpg';
// Import Component
// Hết Import Component

function Article({ feed }) {
    // config Carousel Media (React Slick)
    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };
    const settings = {
        dots: feed.feed.media.length > 1 ? true : false,
        arrows: false,
        infinite: feed.feed.media.length > 1 ? true : false,
        draggable: feed.feed.media.length > 1 ? true : false,
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
                    draggable: feed.feed.media.length > 1 ? true : false,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    draggable: feed.feed.media.length > 1 ? true : false,
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
                    draggable: feed.feed.media.length > 1 ? true : false,
                },
            },
        ],
    };
    // slide hình mẫu
    const slides = [
        {
            img: `https://instagram.fsgn2-10.fna.fbcdn.net/v/t39.30808-6/358688705_18381827644044021_1581996213927772092_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3ODQuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=instagram.fsgn2-10.fna.fbcdn.net&_nc_cat=109&_nc_oc=Q6cZ2AGNVxYhZizs5EwmcoI6_Yu27A8s6m6Ccz1qUEuMVeZAsAdcp7l5LPX2QG7fxfVIiNQ&_nc_ohc=MQXs2ZubJCUQ7kNvgGRD3l6&_nc_gid=e87398a44b8b4f36b5d5c41a36d23b7c&edm=AAGeoI8AAAAA&ccb=7-5&ig_cache_key=MzE0MTYyODQ0ODQ3Njk4MzAzOA%3D%3D.3-ccb7-5&oh=00_AYCh7HZAXPvVuk8-sHY4_ledFh1fSJFeiZiHNRdfWgOmXw&oe=676C7FFB&_nc_sid=b0e1a0`,
        },
        {
            img: `https://instagram.fsgn2-10.fna.fbcdn.net/v/t39.30808-6/358490133_18381827653044021_6618674799377661690_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3NTEuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=instagram.fsgn2-10.fna.fbcdn.net&_nc_cat=109&_nc_oc=Q6cZ2AGNVxYhZizs5EwmcoI6_Yu27A8s6m6Ccz1qUEuMVeZAsAdcp7l5LPX2QG7fxfVIiNQ&_nc_ohc=pCWIln3Amh4Q7kNvgGQRNOC&_nc_gid=e87398a44b8b4f36b5d5c41a36d23b7c&edm=AAGeoI8AAAAA&ccb=7-5&ig_cache_key=MzE0MTYyODQ0ODQ5MzU0NTAwNA%3D%3D.3-ccb7-5&oh=00_AYAAHT0HrSfGjB5rTGULRJewf-9oLubMPpcGF7sQW1-iPA&oe=676C62B0&_nc_sid=b0e1a0`,
        },
        {
            img: `https://instagram.fsgn2-10.fna.fbcdn.net/v/t39.30808-6/358458684_18381827638044021_7069309029595049398_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3NTguc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=instagram.fsgn2-10.fna.fbcdn.net&_nc_cat=109&_nc_oc=Q6cZ2AGNVxYhZizs5EwmcoI6_Yu27A8s6m6Ccz1qUEuMVeZAsAdcp7l5LPX2QG7fxfVIiNQ&_nc_ohc=P22ZEXSavNkQ7kNvgGbvrLF&_nc_gid=e87398a44b8b4f36b5d5c41a36d23b7c&edm=AAGeoI8AAAAA&ccb=7-5&ig_cache_key=MzE0MTYyODQ0ODQ3NzAxNTEwMw%3D%3D.3-ccb7-5&oh=00_AYC9knCenWoorXLjtjayzlmjqe7f1vZ_jYmfBWthcUmArw&oe=676C6F98&_nc_sid=b0e1a0`,
        },
        {
            img: `https://preview.redd.it/my-take-on-the-i-am-music-album-cover-v0-w6ctf6ny0olc1.jpeg?width=1080&crop=smart&auto=webp&s=d27077d4209d76ebba96e1355845dcf7d8a73644`,
        },
    ];

    return (
        <div className="article">
            <div className="left">
                {/* Avatar */}
                <div className="userAvatar">
                    <img src={feed.user.avatar} />
                </div>
            </div>
            <div className="right">
                <div className="top">
                    <div className="articleInfo">
                        <span className="userName">{feed.user.userName}</span>
                        <span className="createdAt">{feed.feed.createdAt}</span>
                    </div>
                    <div className="articleOptions">
                        <button className="btnArticleOptions">
                            <VscEllipsis></VscEllipsis>
                        </button>
                    </div>
                </div>
                <div className="middle">
                    <div className="content">
                        <div className="text">{feed.feed.text}</div>
                        <div className="media">
                            {/* Carousel Media */}
                            <div className="carouselMedia">
                                <Slider
                                    ref={(slider) => {
                                        sliderRef = slider;
                                    }}
                                    {...settings}
                                >
                                    {feed.feed.media.map((mediaContent, index) => (
                                        <Fragment key={index}>
                                            <div className="mediaContainer">
                                                <img src={mediaContent.imageUrl} className="slide-image" style={{}} />
                                            </div>
                                        </Fragment>
                                    ))}
                                </Slider>
                                {feed.feed.media.length >= 2 && (
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
    );
}

export default Article;

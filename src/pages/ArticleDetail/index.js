import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { VscChevronLeft, VscChevronRight, VscEllipsis } from 'react-icons/vsc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import {
    IoArrowUpSharp,
    IoChatboxOutline,
    IoChevronDownSharp,
    IoHeartOutline,
    IoSendOutline,
    IoShareSocialOutline,
} from 'react-icons/io5';
import { getArticleApi } from '~/utils/api';

function ArticleDetail() {
    // State
    const [articleData, setArticleData] = useState();

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

    // --- HANDLE FUNCTION ---
    // Call API get article detail
    useEffect(() => {
        const articleID = location.pathname.split('/')[2];
        // Call API Get article detail
        const getArticle = async (articleId) => {
            try {
                const res = await getArticleApi(articleId);
                setArticleData(res?.data);
            } catch (error) {
                console.log(error);
            }
        };
        getArticle(articleID);
    }, []);
    // Format thời gian tạo bài viết
    const timeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const seconds = Math.floor((now - past) / 1000);
        const intervals = [
            { label: 'năm', seconds: 31536000 },
            { label: 'tháng', seconds: 2592000 },
            { label: 'tuần', seconds: 604800 },
            { label: 'ngày', seconds: 86400 },
            { label: 'giờ', seconds: 3600 },
            { label: 'phút', seconds: 60 },
            { label: 'giây', seconds: 1 },
        ];
        for (let i = 0; i < intervals.length; i++) {
            const interval = Math.floor(seconds / intervals[i].seconds);
            if (interval >= 1) {
                return `${interval} ${intervals[i].label} trước`;
            }
        }
        return 'vừa xong';
    };

    return (
        <div className="articleDetailPage">
            {/* Thanh chuyển tab */}
            <div className="tabSwitchProfile">
                <div
                    className="profileUserName"
                    style={{
                        display: 'grid',
                        height: 'fit-content',
                    }}
                >
                    <span
                        style={{
                            display: 'block',
                            fontFamily: 'sans-serif',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'white',
                            textAlign: 'center',
                        }}
                    >
                        thinhngo
                    </span>
                    <span
                        style={{
                            display: 'block',
                            fontFamily: 'sans-serif',
                            fontSize: '13px',
                            fontWeight: '400',
                            color: 'dimgrey',
                            textAlign: 'center',
                        }}
                    >
                        26 phút trước
                    </span>
                </div>
                <div className="btnComeBackBox">
                    <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                        <VscChevronLeft />
                        <span class="tooltiptext">Quay lại</span>
                    </button>
                </div>
            </div>
            {/* Phần chi tiết bài viết */}
            <div className="articleDetail">
                {/* Nội dung bài viết */}
                <div className="article">
                    <div className="left">
                        {/* Avatar */}
                        <div className="userAvatar">
                            <Link to={`/profile/${articleData?.userId}`}>
                                <img
                                    src={
                                        articleData?.User?.userAvatar
                                            ? process.env.REACT_APP_BACKEND_URL + articleData?.User?.userAvatar
                                            : defaultAvatar
                                    }
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="right">
                        <div className="top">
                            <div className="articleInfo">
                                <Link to={`/profile/${articleData?.userId}`} style={{ textDecoration: 'none' }}>
                                    <span className="userName">{articleData?.User?.userName}</span>
                                </Link>
                                <span className="createdAt">{timeAgo(articleData?.createdAt)}</span>
                            </div>
                            <div className="articleOptions">
                                <button className="btnArticleOptions">
                                    <VscEllipsis></VscEllipsis>
                                </button>
                            </div>
                        </div>
                        <div className="middle">
                            <div className="content">
                                <div className="text">{articleData?.textContent}</div>
                                <div className="media">
                                    {/* {articleData} */}
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
                                                        src="https://images.squarespace-cdn.com/content/v1/56bbcc4659827e5156d54504/a481d02a-ef3a-4c3f-abb3-c20294246c1b/DAY+3+SET+TIMES+4X5.jpg"
                                                        className="slide-image"
                                                        style={{}}
                                                    />
                                                </div>
                                            </Fragment>
                                            <Fragment>
                                                <div className="mediaContainer">
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/en/4/4b/KendrickLamarSwimmingPools.jpg"
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
                        <div className="bottom">
                            {/* Các nút tương tác */}
                            <div className="interactiveButtonBox">
                                {/* Nút thích bài viết */}
                                <button type="button" className="btnLike" id="btnLikeID">
                                    <IoHeartOutline /> 10
                                </button>
                                {/* Nút bình luận */}
                                <button type="button" className="btnComment" id="btnCommentID">
                                    <IoChatboxOutline /> 10
                                </button>
                                {/* Nút chia sẻ */}
                                <button type="button" className="btnShare" id="btnShareID">
                                    <IoShareSocialOutline /> 10
                                </button>
                                {/* Nút gửi */}
                                <button type="button" className="btnSend" id="btnSendID">
                                    <IoSendOutline /> 10
                                </button>
                            </div>
                            {/* Nhập bình luận */}
                            <div className="commentBox">
                                <img
                                    className="userAvatar"
                                    src={
                                        auth?.user?.userAvatar
                                            ? process.env.REACT_APP_BACKEND_URL + auth?.user?.userAvatar
                                            : defaultAvatar
                                    }
                                />
                                <form onSubmit="" className="formComment" id="formCommentID" method="POST" noValidate>
                                    <textarea
                                        className="inputComment"
                                        id="inputCommentID"
                                        placeholder="Bình luận..."
                                        type="text"
                                    />
                                    {/* <button type="submit" className="btnPostComment" id="btnPostCommentID">
                                        <IoArrowUpSharp />
                                    </button> */}
                                    <button type="button" className="btnPostComment" id="btnPostCommentID">
                                        <IoArrowUpSharp />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Các bình luận */}
            <div className="articleComments">
                {/* Bình luận */}
                <div className="comment">
                    <div className="left">
                        {/* Avatar */}
                        <div className="userAvatar">
                            <Link to={`/profile/thinhngo`}>
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
                                <Link to={`/profile/thinhngo`} style={{ textDecoration: 'none' }}>
                                    <span className="userName">thinhngo</span>
                                </Link>
                                <span className="createdAt">26 phút trước</span>
                            </div>
                            <div className="articleOptions">
                                {/* <button className="btnArticleOptions">
                                    <VscEllipsis></VscEllipsis>
                                </button> */}
                            </div>
                        </div>
                        <div className="middle">
                            <div className="content">
                                <div className="text">hãy gợi ý cho mình bài nào chill chill buổi tối...</div>
                                <div className="media">{/* Media */}</div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="interactiveButtonBox">
                                {/* Nút thích bài viết */}
                                <button type="button" className="btnLike" id="btnLikeID">
                                    <IoHeartOutline /> 10
                                </button>
                                {/* Nút bình luận */}
                                <button type="button" className="btnComment" id="btnCommentID">
                                    <IoChatboxOutline /> 10
                                </button>
                                {/* Nút xem phản hồi */}
                                <button type="button" className="btnOpenFeedback" id="btnOpenFeedbackID">
                                    Xem phản hồi <IoChevronDownSharp />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bình luận */}
                <div className="comment">
                    <div className="left">
                        {/* Avatar */}
                        <div className="userAvatar">
                            <Link to={`/profile/thanhnguyen`}>
                                <img src={`http://localhost:3700/image/userAvatar-1744049562031-705794721.png`} />
                            </Link>
                        </div>
                    </div>
                    <div className="right">
                        <div className="top">
                            <div className="articleInfo">
                                <Link to={`/profile/thanhnguyen`} style={{ textDecoration: 'none' }}>
                                    <span className="userName">thanhnguyen</span>
                                </Link>
                                <span className="createdAt">26 phút trước</span>
                            </div>
                            <div className="articleOptions">
                                {/* <button className="btnArticleOptions">
                                    <VscEllipsis></VscEllipsis>
                                </button> */}
                            </div>
                        </div>
                        <div className="middle">
                            <div className="content">
                                <div className="text">cc</div>
                                <div className="media">{/* Media */}</div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="interactiveButtonBox">
                                {/* Nút thích bài viết */}
                                <button type="button" className="btnLike" id="btnLikeID">
                                    <IoHeartOutline /> 10
                                </button>
                                {/* Nút bình luận */}
                                <button type="button" className="btnComment" id="btnCommentID">
                                    <IoChatboxOutline /> 10
                                </button>
                                {/* Nút xem phản hồi */}
                                <button type="button" className="btnOpenFeedback" id="btnOpenFeedbackID">
                                    Xem phản hồi <IoChevronDownSharp />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticleDetail;

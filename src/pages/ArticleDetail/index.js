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
    IoGlobeOutline,
    IoHeartOutline,
    IoLockClosedOutline,
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
        dots: articleData?.mediaContent.length > 1 ? true : false,
        arrows: false,
        infinite: articleData?.mediaContent.length > 1 ? true : false,
        draggable: articleData?.mediaContent.length > 1 ? true : false,
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
                    draggable: articleData?.mediaContent.length > 1 ? true : false,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    draggable: articleData?.mediaContent.length > 1 ? true : false,
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
                    draggable: articleData?.mediaContent.length > 1 ? true : false,
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
    // Format thời gian tạo bài viết (timestamp) sang định dạng "dd/mm/yyyy HH:MM"
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day} Tháng ${month}, ${year} lúc ${hours}:${minutes}`;
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
                        {articleData?.User?.userName}
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
                        {timeAgo(articleData?.createdAt)}
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
                                {/* User Name */}
                                <Link to={`/profile/${articleData?.userId}`} style={{ textDecoration: 'none' }}>
                                    <span className="userName">{articleData?.User?.userName}</span>
                                </Link>
                                {/* Privacy */}
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '3px',
                                    }}
                                >
                                    {articleData?.privacy === '0' ? (
                                        <IoGlobeOutline style={{ color: 'dimgray' }} />
                                    ) : (
                                        <IoLockClosedOutline style={{ color: 'dimgray' }} />
                                    )}
                                </span>
                                {/* Created At */}
                                <span className="createdAt tooltip">
                                    {timeAgo(articleData?.createdAt)}
                                    <span class="tooltiptext">{formatTimestamp(articleData?.createdAt)}</span>
                                </span>
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
                                    {/* Render Carousel Media */}
                                    {articleData?.mediaContent.length <= 0 ? (
                                        <></>
                                    ) : (
                                        <>
                                            <div className="carouselMedia">
                                                <Slider
                                                    ref={(slider) => {
                                                        sliderRef = slider;
                                                    }}
                                                    {...settings}
                                                >
                                                    {articleData?.mediaContent.map((media, index) => (
                                                        <Fragment key={index}>
                                                            <div className="mediaContainer">
                                                                {media.type === 'photo' ? (
                                                                    <>
                                                                        <img
                                                                            src={
                                                                                process.env.REACT_APP_BACKEND_URL +
                                                                                media.photoLink
                                                                            }
                                                                            className="slide-image"
                                                                            style={{}}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <video
                                                                        src={
                                                                            process.env.REACT_APP_BACKEND_URL +
                                                                            media.videoLink
                                                                        }
                                                                        style={{}}
                                                                        playsInline
                                                                        controls
                                                                    />
                                                                )}
                                                            </div>
                                                        </Fragment>
                                                    ))}
                                                </Slider>
                                                {articleData?.mediaContent.length >= 2 && (
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
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            {/* Các nút tương tác */}
                            <div className="interactiveButtonBox">
                                {/* Nút thích bài viết */}
                                <button type="button" className="btnLike" id="btnLikeID">
                                    <IoHeartOutline /> {articleData?.LikeArticles?.length}
                                </button>
                                {/* Nút bình luận */}
                                <button type="button" className="btnComment" id="btnCommentID">
                                    <IoChatboxOutline /> {articleData?.Comments?.length}
                                </button>
                                {/* Nút chia sẻ */}
                                <button type="button" className="btnShare" id="btnShareID">
                                    <IoShareSocialOutline /> 0
                                </button>
                                {/* Nút gửi */}
                                <button type="button" className="btnSend" id="btnSendID">
                                    <IoSendOutline /> 0
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
                {/* Render Comments */}
                {articleData?.Comments?.length <= 0 ? (
                    <span
                        style={{
                            textAlign: 'center',
                            color: 'white',
                            fontFamily: 'sans-serif',
                            fontSize: '16px',
                            fontWeight: '400',
                        }}
                    >
                        Chưa có bình luận nào
                    </span>
                ) : (
                    <>
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
                                        <img
                                            src={`http://localhost:3700/image/userAvatar-1744049562031-705794721.png`}
                                        />
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
                    </>
                )}
            </div>
        </div>
    );
}

export default ArticleDetail;

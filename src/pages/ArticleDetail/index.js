import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { VscChevronLeft, VscChevronRight, VscEllipsis } from 'react-icons/vsc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import {
    IoAlertCircleOutline,
    IoArrowUpSharp,
    IoChatboxOutline,
    IoChevronDownSharp,
    IoGlobeOutline,
    IoHeartOutline,
    IoLockClosedOutline,
    IoSendOutline,
    IoShareSocialOutline,
    IoSyncSharp,
} from 'react-icons/io5';
import { createCommentApi, getArticleApi } from '~/utils/api';
import Comment from '../components/Comment';
import { useForm } from 'react-hook-form';

function ArticleDetail() {
    // State
    const [articleData, setArticleData] = useState(); // Dữ liệu chi tiết bài viết
    const [commentsData, setCommentsData] = useState(); // Dữ liệu bình luận của bài viết
    const [createCommentStatus, setCreateCommentStatus] = useState(); // For Loading Comment Animation

    // Context
    const { auth } = useContext(AuthContext);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // React Hook Form (Form Upload Article)
    const formComment = useForm();
    const { register, handleSubmit, formState, watch, setError, clearErrors, setFocus } = formComment;
    const { errors } = formState;

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

    // console.log(commentsData);

    // --- HANDLE FUNCTION ---
    // Call API get article detail
    useEffect(() => {
        const articleID = location.pathname.split('/')[2];
        // Call API Get article detail
        const getArticle = async (articleId) => {
            try {
                const res = await getArticleApi(articleId);
                // set dữ liệu chi tiết bài viết
                setArticleData(res?.data);
                // set bình luận của bài viết
                setCommentsData({ comments: res?.data?.comments, commentCount: res?.data?.commentCount });
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
    // Handle Submit formComment
    const onSubmitFormComment = async (data) => {
        // Start Loading
        setCreateCommentStatus('pending');

        let commentData = {};
        commentData.articleId = articleData?.articleId;
        commentData.content = data.content;
        commentData.parentCommentId = null;

        setTimeout(async () => {
            // Call API tạo bình luận bài viết
            try {
                const res = await createCommentApi(commentData);
                // Kiểm tra
                if (res?.data !== null) {
                    // Set lại commentsData
                    if (res.data?.parentCommentId === null) {
                        // Nếu là bình luận cha thì thêm vào đầu danh sách
                        let newComment = res.data;
                        newComment.replies = []; // Khởi tạo mảng replies rỗng
                        setCommentsData((prev) => ({
                            comments: [newComment, ...prev?.comments],
                            commentCount: prev?.commentCount + 1,
                        }));
                    } else {
                        // Nếu là bình luận con thì tìm bình luận cha và thêm vào replies
                        let newComment = res.data;
                        newComment.replies = []; // Khởi tạo mảng replies rỗng
                        setCommentsData((prev) => {
                            return prev.comments.map((oldComment) => {
                                // Kiểm tra nếu là bình luận cha
                                if (oldComment.commentId === newComment.parentCommentId) {
                                    // Thêm bình luận con vào đầu replies[]
                                    return {
                                        ...oldComment,
                                        replies: [newComment, ...oldComment.replies],
                                    };
                                } else {
                                    return oldComment;
                                }
                            });
                        });
                    }

                    // Reset Form Comment
                    formComment.reset();
                    // Stop Loading with success
                    setCreateCommentStatus('success');
                    console.log('Tạo bình luận thành công');
                } else {
                    // Stop Loading with fail
                    setCreateCommentStatus('fail');
                    console.log('Tạo bình luận không thành công');
                }
            } catch (error) {
                // Stop Loading with fail
                setCreateCommentStatus('fail');
                console.log(error);
            }
        }, 1000);
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
                            <Link to={`/profile/${articleData?.User?.userName}`}>
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
                                <Link to={`/profile/${articleData?.User?.userName}`} style={{ textDecoration: 'none' }}>
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
                                    <IoHeartOutline />{' '}
                                    {articleData?.LikeArticles ? articleData?.LikeArticles?.length : 0}
                                </button>
                                {/* Nút bình luận */}
                                <button type="button" className="btnComment" id="btnCommentID">
                                    <IoChatboxOutline /> {commentsData?.commentCount ? commentsData?.commentCount : 0}
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
                                <form
                                    onSubmit={handleSubmit(onSubmitFormComment)}
                                    className="formComment"
                                    id="formCommentID"
                                    method="POST"
                                    noValidate
                                >
                                    <textarea
                                        className="inputComment"
                                        id="inputCommentID"
                                        placeholder="Bình luận..."
                                        type="text"
                                        {...register('content', {
                                            required: 'Chưa nhập bình luận',
                                            maxLength: {
                                                value: 500,
                                                message: 'Nội dung bình luận không được quá 500 ký tự',
                                            },
                                        })}
                                        style={{
                                            border:
                                                createCommentStatus === 'fail'
                                                    ? '.5px solid rgb(233 20 41 / 54%)'
                                                    : '0.5px solid transparent',
                                        }}
                                    />
                                    {/* Nút bình luận */}
                                    <button type="submit" className="btnPostComment" id="btnPostCommentID">
                                        {createCommentStatus === 'pending' ? (
                                            <>
                                                <div
                                                    style={{
                                                        width: '15px',
                                                        height: '15px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <IoSyncSharp
                                                        className="loadingAnimation"
                                                        style={{ color: 'white' }}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <IoArrowUpSharp />
                                        )}
                                    </button>
                                    {/* <button type="button" className="btnPostComment" id="btnPostCommentID">
                                        <IoArrowUpSharp />
                                    </button> */}
                                </form>
                            </div>
                            {/* Validate Error Comment */}
                            {errors.content?.message ? (
                                <div
                                    className="errorMessage"
                                    style={{
                                        background: '#e91429',
                                        width: 'fit-content',
                                        padding: '5px',
                                        color: 'white',
                                        fontSize: '14px',
                                        fontFamily: 'sans-serif',
                                        margin: '8px 0px',
                                        borderRadius: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '5px',
                                        marginLeft: '42px',
                                    }}
                                >
                                    <IoAlertCircleOutline /> {errors.content?.message}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Check Data */}
            <pre style={{ color: 'red' }} hidden>
                {JSON.stringify(watch(), null, 2)}
            </pre>
            {/* Các bình luận */}
            <div className="articleComments">
                {/* Render Comments */}
                {articleData?.comments?.length <= 0 ? (
                    <span
                        style={{
                            textAlign: 'center',
                            color: 'white',
                            fontFamily: 'sans-serif',
                            fontSize: '16px',
                            fontWeight: '400',
                        }}
                    ></span>
                ) : (
                    <>
                        {/* Title */}
                        <span style={{ color: '#ffffff', padding: '0px 12px 12px 12px', fontFamily: 'system-ui' }}>
                            {commentsData?.commentCount} bình luận
                        </span>
                        {commentsData?.comments.map((comment) => (
                            <Comment key={comment.commentId} comment={comment} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default ArticleDetail;

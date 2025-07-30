import { VscEllipsis } from 'react-icons/vsc';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import { useContext, useEffect, useRef, useState } from 'react';
import { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import UserName from '../UserName';
import {
    IoAlertCircleOutline,
    IoBanOutline,
    IoChatboxOutline,
    IoCloseCircleOutline,
    IoGlobeOutline,
    IoHeartOutline,
    IoLockClosedOutline,
    IoSendOutline,
    IoShareSocialOutline,
} from 'react-icons/io5';
import LikeArticleButton from '../LikeArticleButton';
import ShareArticleButton from '../ShareArticleButton';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { message } from 'antd';
import { deleteArticleApi } from '~/utils/api';

function Article({ articleData }) {
    // State
    // const [articleData, setArticleData] = useState(); // Dữ liệu chi tiết bài viết
    const [commentsData, setCommentsData] = useState(
        articleData?.commentCount > 0
            ? { comments: articleData?.comments, commentCount: articleData?.commentCount }
            : { comments: {}, commentCount: 0 },
    ); // Dữ liệu bình luận của bài viết từ API (type Map)
    // const [isOpenCommentInput, setIsOpenCommentInput] = useState(false); // Đóng/mở input comment
    // const [createCommentStatus, setCreateCommentStatus] = useState(); // For Loading Comment Animation
    const [isOpenArticleOptions, setIsOpenArticleOptions] = useState(false); // đóng/mở Article options
    const [articleOptionsBoxPosition, setArticleOptionsBoxPosition] = useState(); // Article options box position
    const [isOpenDeleteConfirmBox, setIsOpenDeleteConfirmBox] = useState(false); // đóng/mở hộp xác nhận xóa bài viết

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const articleRef = useRef(null); // ref cho bài viết
    const articleOptionsButtonRef = useRef(null); // ref cho nút article options
    const articleOptionsBoxRef = useRef(null); // ref cho article options box

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // Message (Ant Design)
    const [messageApi, contextHolder] = message.useMessage();

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
        // Nếu đã quá 1 tuần thì return chi tiết
        if (seconds >= intervals[2].seconds) {
            return formatTimestamp(timestamp);
        }
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
    // *** PHẦN MENU OPTIONS ***
    // Handle nút đóng/mở article options
    const handleToggleArticleOptions = () => {
        setTimeout(() => {
            setIsOpenArticleOptions(!isOpenArticleOptions);
            // Xác định vị trí hiển thị
            setTimeout(() => {
                if (articleOptionsButtonRef.current && articleOptionsBoxRef.current) {
                    const commentOptionsButton = articleOptionsButtonRef.current.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    if (commentOptionsButton.bottom > windowHeight / 2) {
                        setArticleOptionsBoxPosition('top');
                    } else {
                        setArticleOptionsBoxPosition('bottom');
                    }
                }
            }, 0); // đảm bảo DOM đã render xong
        }, 80);
    };
    // Đóng Article Options khi click ra ngoài
    useEffect(() => {
        const handleClickOutsideArticleOptions = (event) => {
            if (articleOptionsBoxRef.current && !articleOptionsBoxRef.current.contains(event.target)) {
                setIsOpenArticleOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsideArticleOptions);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideArticleOptions);
        };
    }, []);
    // Đóng/mở Hộp xác nhận xóa bài viết
    const handleToggleDeleteArticle = () => {
        // Hiển thị hộp xác nhận xóa bài viết
        setIsOpenArticleOptions(false); // Đóng article options nếu đang mở
        setIsOpenDeleteConfirmBox(!isOpenDeleteConfirmBox);
    };
    // Handle Button Delete Article
    const handleBtnDeleteArticle = async (articleId) => {
        // Xử lý xóa bài viết
        try {
            // Loading ... (Ant Design Message)
            messageApi
                .open({
                    type: 'loading',
                    content: 'Đang xử lý ...',
                    duration: 1.5,
                    style: {
                        color: 'white',
                        marginTop: '58.4px',
                    },
                })
                .then(async () => {
                    // Call API Delete Article
                    const res = await deleteArticleApi(articleId);
                    if (res?.status === 200 && res?.message === 'Xóa bài viết thành công') {
                        // Xóa bài viết thành công
                        message.success({
                            content: 'Xóa bài viết thành công',
                            duration: 1.5,
                            style: {
                                color: 'white',
                                marginTop: '58.4px',
                            },
                        });
                        // Ẩn bài viết
                        // (Hoặc dùng cách xóa article khỏi context data)
                        articleRef.current.style.display = 'none';
                    } else {
                        // Xóa bài viết không thành công
                        message.error({
                            content: 'Có lỗi xảy ra',
                            duration: 1.5,
                            style: {
                                color: 'white',
                                marginTop: '58.4px',
                            },
                        });
                    }
                });
        } catch (error) {
            console.error('Error deleting article:', error);
            return;
        }
    };

    return (
        <>
            {/* Nội dung bài viết */}
            <div className="articleDetailPage">
                {/* Ant Design Message */}
                {contextHolder}
                <div
                    className="articleDetail"
                    ref={articleRef}
                    style={{ position: isOpenDeleteConfirmBox ? 'relative' : '' }}
                >
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
                                    <UserName userName={articleData?.User?.userName} />
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
                                        <span className="tooltiptext">{formatTimestamp(articleData?.createdAt)}</span>
                                    </span>
                                </div>
                                <div className="articleOptions" ref={articleOptionsButtonRef}>
                                    <button
                                        className="btnArticleOptions"
                                        onClick={() => {
                                            handleToggleArticleOptions();
                                        }}
                                    >
                                        <VscEllipsis></VscEllipsis>
                                    </button>
                                    {/* Menu Article Options */}
                                    {isOpenArticleOptions && (
                                        <div
                                            className="articleOptionsBox"
                                            ref={articleOptionsBoxRef}
                                            style={{
                                                bottom: articleOptionsBoxPosition === 'top' ? '100%' : 'auto',
                                            }}
                                        >
                                            {auth?.user?.userName === articleData?.User?.userName && (
                                                <div
                                                    className="forAuthUser"
                                                    style={{
                                                        borderBottom:
                                                            auth?.user?.userName !== articleData?.User?.userName
                                                                ? '0.5px solid #1f1f1f'
                                                                : 'none',
                                                        paddingBottom:
                                                            auth?.user?.userName !== articleData?.User?.userName
                                                                ? '8px'
                                                                : '0px',
                                                        marginBottom:
                                                            auth?.user?.userName !== articleData?.User?.userName
                                                                ? '8px'
                                                                : '0px',
                                                    }}
                                                >
                                                    {/* Nút sửa bài viết */}
                                                    {/* <button className="btnEditArticle" id="btnEditArticleID">
                                                                                                    Sửa <IoCreateOutline />
                                                                                                </button> */}
                                                    {/* Nút xóa bài viết */}
                                                    <button
                                                        className="btnDeleteArticle"
                                                        id="btnDeleteArticleID"
                                                        style={{ color: 'rgb(255, 48, 64)' }}
                                                        onClick={() => {
                                                            handleToggleDeleteArticle();
                                                        }}
                                                    >
                                                        Xóa <IoCloseCircleOutline />
                                                    </button>
                                                </div>
                                            )}
                                            {auth?.user?.userName !== articleData?.User?.userName && (
                                                <>
                                                    {/* Nút chặn người dùng */}
                                                    <button
                                                        className="btnReportArticle"
                                                        id="btnReportArticleID"
                                                        style={{ color: 'rgb(255, 48, 64)' }}
                                                    >
                                                        Chặn <IoBanOutline />
                                                    </button>
                                                    {/* Nút báo cáo bài viết */}
                                                    <button
                                                        className="btnReportArticle"
                                                        id="btnReportArticleID"
                                                        style={{ color: 'rgb(255, 48, 64)' }}
                                                    >
                                                        Báo cáo <IoAlertCircleOutline />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
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
                                                <div
                                                    className="carouselMedia"
                                                    style={{
                                                        marginBottom:
                                                            articleData?.mediaContent.length > 1 ? '14px' : '0px',
                                                        cursor:
                                                            articleData?.mediaContent.length > 1 ? 'grab' : 'pointer',
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.target.style.cursor =
                                                            articleData?.mediaContent.length > 1
                                                                ? 'grabbing'
                                                                : 'pointer';
                                                    }}
                                                    onMouseUp={(e) => {
                                                        e.target.style.cursor =
                                                            articleData?.mediaContent.length > 1 ? 'grab' : 'pointer';
                                                    }}
                                                >
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
                                                                                loading="lazy"
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
                                                                            preload="false"
                                                                            loading="lazy"
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
                                    {articleData ? (
                                        <LikeArticleButton articleData={articleData} />
                                    ) : (
                                        <>
                                            {/* Skeleton Loading */}
                                            <button type="button" className="btnLike" id="btnLikeID" style={{}}>
                                                <IoHeartOutline /> 0
                                            </button>
                                        </>
                                    )}
                                    {/* Nút bình luận */}
                                    <button
                                        type="button"
                                        className="btnComment"
                                        id="btnCommentID"
                                        onClick={() => {
                                            navigate(`/article/${articleData?.articleId}`);
                                        }}
                                    >
                                        <IoChatboxOutline />{' '}
                                        {commentsData?.commentCount ? commentsData?.commentCount : 0}
                                    </button>
                                    {/* Nút chia sẻ */}
                                    {articleData ? (
                                        <ShareArticleButton articleData={articleData} />
                                    ) : (
                                        <>
                                            {/* Skeleton Loading */}
                                            <button type="button" className="btnShare" id="btnShareID">
                                                <IoShareSocialOutline /> 0
                                            </button>
                                        </>
                                    )}
                                    {/* Nút gửi */}
                                    <button type="button" className="btnSend" id="btnSendID">
                                        <IoSendOutline /> 0
                                    </button>
                                </div>
                                {/* Nhập bình luận */}
                                {/* {isOpenCommentInput ? (
                                    <CommentInput
                                        onReplyComment={handleResetCommentsDataOfArticle}
                                        articleData={articleData}
                                    />
                                ) : (
                                    <></>
                                )} */}
                            </div>
                        </div>
                    </div>
                    {/* Hộp xác nhận xóa bài viết */}
                    {isOpenDeleteConfirmBox && (
                        <div className="deleteConfirmBox" style={{ zIndex: '0' }}>
                            <div className="deleteConfirm">
                                <span className="title">Bạn có chắc muốn xóa bài viết này?</span>
                                <div className="btnBox">
                                    <button
                                        className="btnDelete"
                                        onClick={() => {
                                            if (auth?.user?.userName === articleData?.User?.userName) {
                                                handleBtnDeleteArticle(articleData?.articleId);
                                            } else {
                                                console.log('Không có quyền xóa bài viết này !');
                                            }
                                        }}
                                    >
                                        Xóa
                                    </button>
                                    <button
                                        className="btnCancel"
                                        onClick={() => {
                                            setIsOpenDeleteConfirmBox(false);
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Article;

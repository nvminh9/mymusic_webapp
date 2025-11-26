import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { VscChevronLeft, VscChevronRight, VscEllipsis } from 'react-icons/vsc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import {
    IoAlertCircleOutline,
    IoBanOutline,
    IoChatboxOutline,
    IoCloseCircleOutline,
    IoEyeOutline,
    IoGlobeOutline,
    IoHeartOutline,
    IoLockClosedOutline,
    IoSendOutline,
    IoSyncSharp,
} from 'react-icons/io5';
import { deleteSharedArticleApi, getSharedArticleApi } from '~/utils/api';
import { message } from 'antd';
import UserName from '../UserName';
import LikeSharedArticleButton from '../LikeSharedArticleButton';
import { EnvContext } from '~/context/env.context';

function SharedArticle({ sharedArticleData }) {
    // State
    // const [sharedArticleData, setSharedArticleData] = useState(); // Dữ liệu chi tiết bài chia sẻ
    const [commentsData, setCommentsData] = useState(
        sharedArticleData?.commentCount > 0
            ? { comments: sharedArticleData?.comments, commentCount: sharedArticleData?.commentCount }
            : { comments: {}, commentCount: 0 },
    ); // Dữ liệu bình luận của bài chia sẻ từ API (type Map)
    // const [isOpenCommentInput, setIsOpenCommentInput] = useState(false); // Đóng/mở input comment
    // const [createCommentStatus, setCreateCommentStatus] = useState(); // For Loading Comment Animation
    const [isOpenSharedArticleOptions, setIsOpenSharedArticleOptions] = useState(false); // đóng/mở Shared Article options
    const [sharedArticleOptionsBoxPosition, setSharedArticleOptionsBoxPosition] = useState(); // Shared Article options box position
    const [isOpenDeleteConfirmBox, setIsOpenDeleteConfirmBox] = useState(false); // đóng/mở hộp xác nhận xóa bài chia sẻ

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // Ref
    const sharedArticleRef = useRef(null); // ref cho bài chia sẻ
    const sharedArticleOptionsButtonRef = useRef(null); // ref cho nút shared article options
    const sharedArticleOptionsBoxRef = useRef(null); // ref cho shared article options box

    // React Hook Form

    // Message (Ant Design)
    const [messageApi, contextHolder] = message.useMessage();

    // Config Carousel Media (React Slick) (Của bài viết được chia sẻ)
    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };
    const settings = {
        // dots: sharedArticleData?.Article?.mediaContent?.length > 1 ? true : false,
        dots: false,
        arrows: false,
        infinite: sharedArticleData?.Article?.mediaContent?.length > 1 ? true : false,
        draggable: sharedArticleData?.Article?.mediaContent?.length > 1 ? true : false,
        // draggable: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        accessibility: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    draggable: sharedArticleData?.Article?.mediaContent?.length > 1 ? true : false,
                    // draggable: false,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    draggable: sharedArticleData?.Article?.mediaContent?.length > 1 ? true : false,
                    // draggable: false,
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
                    draggable: sharedArticleData?.Article?.mediaContent?.length > 1 ? true : false,
                    // draggable: false,
                },
            },
        ],
    };

    // --- HANDLE FUNCTION ---
    // Format thời gian tạo bài chia sẻ
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
    // Format thời gian tạo bài chia sẻ (timestamp) sang định dạng "dd/mm/yyyy HH:MM"
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
    // Handle nút đóng/mở shared article options
    const handleToggleSharedArticleOptions = () => {
        setTimeout(() => {
            setIsOpenSharedArticleOptions(!isOpenSharedArticleOptions);
            // Xác định vị trí hiển thị
            setTimeout(() => {
                if (sharedArticleOptionsButtonRef.current && sharedArticleOptionsBoxRef.current) {
                    const commentOptionsButton = sharedArticleOptionsButtonRef.current.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    if (commentOptionsButton.bottom > windowHeight / 2) {
                        setSharedArticleOptionsBoxPosition('top');
                    } else {
                        setSharedArticleOptionsBoxPosition('bottom');
                    }
                }
            }, 0); // đảm bảo DOM đã render xong
        }, 80);
    };
    // Đóng Shared Article Options khi click ra ngoài
    useEffect(() => {
        const handleClickOutsideSharedArticleOptions = (event) => {
            if (sharedArticleOptionsBoxRef.current && !sharedArticleOptionsBoxRef.current.contains(event.target)) {
                setIsOpenSharedArticleOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsideSharedArticleOptions);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSharedArticleOptions);
        };
    }, []);
    // Đóng/mở Hộp xác nhận xóa bài chia sẻ
    const handleToggleDeleteSharedArticle = () => {
        // Hiển thị hộp xác nhận xóa bài chia sẻ
        setIsOpenSharedArticleOptions(false); // Đóng shared article options nếu đang mở
        setIsOpenDeleteConfirmBox(!isOpenDeleteConfirmBox);
    };
    // Handle Button Delete Shared Article
    const handleBtnDeleteSharedArticle = async (sharedArticleId) => {
        // Xử lý xóa bài chia sẻ
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
                    // Call API Delete Shared Article
                    const res = await deleteSharedArticleApi(sharedArticleId);
                    if (res?.status === 200 && res?.message === 'Xóa bài chia sẻ thành công') {
                        // Xóa bài chia sẻ thành công
                        message.success({
                            content: 'Xóa bài chia sẻ thành công',
                            duration: 1.5,
                            style: {
                                color: 'white',
                                marginTop: '58.4px',
                            },
                        });
                        // Ẩn bài chia sẻ
                        sharedArticleRef.current.style.display = 'none';
                    } else {
                        // Xóa bài chia sẻ không thành công
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
            console.error('Error deleting shared article:', error);
            return;
        }
    };

    return (
        <>
            {/* Article Detail */}
            <div className="articleDetailPage">
                {/* Ant Design Message */}
                {contextHolder}
                {/* Bài chia sẻ */}
                <div
                    className="articleDetail"
                    ref={sharedArticleRef}
                    style={{ position: isOpenDeleteConfirmBox ? 'relative' : '' }}
                >
                    {/* Nội dung bài viết */}
                    <div className="article">
                        <div className="left">
                            {/* Avatar */}
                            <div className="userAvatar">
                                <Link to={`/profile/${sharedArticleData?.User?.userName}`}>
                                    <img
                                        src={
                                            sharedArticleData?.User?.userAvatar
                                                ? env?.backend_url + sharedArticleData?.User?.userAvatar
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
                                    <UserName userName={sharedArticleData?.User?.userName} />
                                    {/* Privacy */}
                                    <span
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '3px',
                                        }}
                                    >
                                        {sharedArticleData?.privacy === '0' ? (
                                            <IoGlobeOutline style={{ color: 'dimgray' }} />
                                        ) : (
                                            <IoLockClosedOutline style={{ color: 'dimgray' }} />
                                        )}
                                    </span>
                                    {/* Created At */}
                                    <span className="createdAt tooltip">
                                        {timeAgo(sharedArticleData?.createdAt)}
                                        <span className="tooltiptext">
                                            {formatTimestamp(sharedArticleData?.createdAt)}
                                        </span>
                                    </span>
                                </div>
                                <div className="articleOptions" ref={sharedArticleOptionsButtonRef}>
                                    <button
                                        className="btnArticleOptions"
                                        onClick={() => {
                                            handleToggleSharedArticleOptions();
                                        }}
                                    >
                                        <VscEllipsis></VscEllipsis>
                                    </button>
                                    {/* Menu Article Options */}
                                    {isOpenSharedArticleOptions && (
                                        <div
                                            className="articleOptionsBox"
                                            ref={sharedArticleOptionsBoxRef}
                                            style={{
                                                bottom: sharedArticleOptionsBoxPosition === 'top' ? '100%' : 'auto',
                                            }}
                                        >
                                            {auth?.user?.userName === sharedArticleData?.User?.userName && (
                                                <div
                                                    className="forAuthUser"
                                                    style={{
                                                        borderBottom:
                                                            auth?.user?.userName !== sharedArticleData?.User?.userName
                                                                ? '0.5px solid #1f1f1f'
                                                                : 'none',
                                                        paddingBottom:
                                                            auth?.user?.userName !== sharedArticleData?.User?.userName
                                                                ? '8px'
                                                                : '0px',
                                                        marginBottom:
                                                            auth?.user?.userName !== sharedArticleData?.User?.userName
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
                                                            handleToggleDeleteSharedArticle();
                                                        }}
                                                    >
                                                        Xóa <IoCloseCircleOutline />
                                                    </button>
                                                </div>
                                            )}
                                            {auth?.user?.userName !== sharedArticleData?.User?.userName && (
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
                                    <div className="text">{sharedArticleData?.sharedTextContent}</div>
                                    {/* Bài viết được chia sẻ (Bài viết gốc) */}
                                    <div
                                        // className="articleDetail sharedArticleDetail"
                                        className="articleDetail"
                                        style={{
                                            backgroundColor: '#1f1f1f',
                                            border: '0.5px solid rgba(243, 245, 247, 0.08)',
                                            borderRadius: '25px',
                                            // paddingBottom: '0px',
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Nội dung bài viết */}
                                        <div className="article">
                                            <div className="left">
                                                {/* Avatar */}
                                                <div className="userAvatar">
                                                    <Link to={`/profile/${sharedArticleData?.Article?.User?.userName}`}>
                                                        <img
                                                            src={
                                                                sharedArticleData?.Article?.User?.userAvatar
                                                                    ? env?.backend_url +
                                                                      sharedArticleData?.Article?.User?.userAvatar
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
                                                        <UserName
                                                            userName={sharedArticleData?.Article?.User?.userName}
                                                        />
                                                        {/* Privacy */}
                                                        <span
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginRight: '3px',
                                                            }}
                                                        >
                                                            {sharedArticleData?.Article?.privacy === '0' ? (
                                                                <IoGlobeOutline style={{ color: 'dimgray' }} />
                                                            ) : (
                                                                <IoLockClosedOutline style={{ color: 'dimgray' }} />
                                                            )}
                                                        </span>
                                                        {/* Created At */}
                                                        <span className="createdAt tooltip">
                                                            {timeAgo(sharedArticleData?.Article?.createdAt)}
                                                            <span className="tooltiptext">
                                                                {formatTimestamp(sharedArticleData?.Article?.createdAt)}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className="articleOptions">{/*  */}</div>
                                                </div>
                                                <div className="middle">
                                                    <div className="content">
                                                        <div
                                                            className="text"
                                                            style={{
                                                                paddingBottom:
                                                                    sharedArticleData?.Article?.mediaContent?.length ===
                                                                    0
                                                                        ? '0px'
                                                                        : '8px',
                                                            }}
                                                        >
                                                            {sharedArticleData?.Article?.textContent}
                                                        </div>
                                                        <div className="media">
                                                            {/* Render Carousel Media */}
                                                            {sharedArticleData?.Article?.mediaContent.length <= 0 ? (
                                                                <></>
                                                            ) : (
                                                                <>
                                                                    <div
                                                                        className="carouselMedia"
                                                                        style={{
                                                                            marginBottom:
                                                                                sharedArticleData?.Article?.mediaContent
                                                                                    ?.length > 1
                                                                                    ? '0px'
                                                                                    : '0px',
                                                                            cursor:
                                                                                sharedArticleData?.Article?.mediaContent
                                                                                    ?.length > 1
                                                                                    ? 'grab'
                                                                                    : 'pointer',
                                                                        }}
                                                                        onMouseDown={(e) => {
                                                                            e.target.style.cursor =
                                                                                sharedArticleData?.Article?.mediaContent
                                                                                    ?.length > 1
                                                                                    ? 'grabbing'
                                                                                    : 'pointer';
                                                                        }}
                                                                        onMouseUp={(e) => {
                                                                            e.target.style.cursor =
                                                                                sharedArticleData?.Article?.mediaContent
                                                                                    ?.length > 1
                                                                                    ? 'grab'
                                                                                    : 'pointer';
                                                                        }}
                                                                    >
                                                                        <Slider
                                                                            ref={(slider) => {
                                                                                sliderRef = slider;
                                                                            }}
                                                                            {...settings}
                                                                        >
                                                                            {sharedArticleData?.Article?.mediaContent.map(
                                                                                (media, index) => (
                                                                                    <Fragment key={index}>
                                                                                        <div className="mediaContainer">
                                                                                            {media.type === 'photo' ? (
                                                                                                <>
                                                                                                    <img
                                                                                                        src={
                                                                                                            env?.backend_url +
                                                                                                            media.photoLink
                                                                                                        }
                                                                                                        className="slide-image"
                                                                                                        style={{}}
                                                                                                    />
                                                                                                </>
                                                                                            ) : (
                                                                                                <video
                                                                                                    src={
                                                                                                        env?.backend_url +
                                                                                                        media.videoLink
                                                                                                    }
                                                                                                    style={{}}
                                                                                                    playsInline
                                                                                                    controls
                                                                                                />
                                                                                            )}
                                                                                        </div>
                                                                                    </Fragment>
                                                                                ),
                                                                            )}
                                                                        </Slider>
                                                                        {sharedArticleData?.Article?.mediaContent
                                                                            .length >= 2 && (
                                                                            <>
                                                                                <button
                                                                                    className="btnPrevCarousel"
                                                                                    onClick={previous}
                                                                                    type="button"
                                                                                >
                                                                                    <VscChevronLeft />
                                                                                </button>
                                                                                <button
                                                                                    className="btnNextCarousel"
                                                                                    onClick={next}
                                                                                    type="button"
                                                                                >
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
                                                {/* <div className="bottom"></div> */}
                                            </div>
                                        </div>
                                        {/* Nút xem chi tiết bài viết được chia sẻ */}
                                        <button
                                            className="btnToArticleDetail"
                                            onClick={() => {
                                                navigate(`/article/${sharedArticleData?.Article?.articleId}`);
                                            }}
                                        >
                                            <IoEyeOutline />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom">
                                {/* Các nút tương tác */}
                                <div className="interactiveButtonBox">
                                    {/* Nút thích bài viết */}
                                    {sharedArticleData ? (
                                        <LikeSharedArticleButton sharedArticleData={sharedArticleData} />
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
                                            navigate(`/article/shared/${sharedArticleData?.sharedArticleId}`);
                                        }}
                                    >
                                        <IoChatboxOutline />{' '}
                                        {commentsData?.commentCount ? commentsData?.commentCount : 0}
                                    </button>
                                    {/* Nút gửi */}
                                    <button type="button" className="btnSend" id="btnSendID">
                                        <IoSendOutline /> 0
                                    </button>
                                </div>
                                {/* Nhập bình luận */}
                                {/* {isOpenCommentInput ? (
                                    <CommentInput
                                        onReplyComment={handleResetCommentsDataOfArticle}
                                        sharedArticleData={sharedArticleData}
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
                                            handleBtnDeleteSharedArticle(sharedArticleData?.sharedArticleId);
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

export default SharedArticle;

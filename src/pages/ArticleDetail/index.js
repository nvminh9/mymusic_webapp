import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
    IoGlobeOutline,
    IoHeartOutline,
    IoLockClosedOutline,
    IoSendOutline,
    IoShareSocialOutline,
    IoSyncSharp,
} from 'react-icons/io5';
import { deleteArticleApi, getArticleApi } from '~/utils/api';
import CommentList from '../components/CommentList';
import CommentInput from '../components/CommentInput';
import LikeArticleButton from '../components/LikeArticleButton';
import UserName from '../components/UserName';
import { message } from 'antd';
import ShareArticleButton from '../components/ShareArticleButton';
import { EnvContext } from '~/context/env.context';

function ArticleDetail() {
    // State
    const [articleData, setArticleData] = useState(); // Dữ liệu chi tiết bài viết
    const [commentsData, setCommentsData] = useState(); // Dữ liệu bình luận của bài viết từ API (type Map)
    const [isOpenCommentInput, setIsOpenCommentInput] = useState(false); // Đóng/mở input comment
    // const [createCommentStatus, setCreateCommentStatus] = useState(); // For Loading Comment Animation
    const [isOpenArticleOptions, setIsOpenArticleOptions] = useState(false); // đóng/mở Article options
    const [articleOptionsBoxPosition, setArticleOptionsBoxPosition] = useState(); // Article options box position
    const [isOpenDeleteConfirmBox, setIsOpenDeleteConfirmBox] = useState(false); // đóng/mở hộp xác nhận xóa bài viết

    // Context
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // Ref
    const articleRef = useRef(null); // ref cho bài viết
    const articleOptionsButtonRef = useRef(null); // ref cho nút article options
    const articleOptionsBoxRef = useRef(null); // ref cho article options box

    // React Hook Form

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

    console.log('Rerender ArticleDetail');

    // *** Call API GET ARTICLE DETAIL ***
    useEffect(() => {
        const articleID = location.pathname.split('/')[2];
        // Call API Get article detail
        const getArticle = async (articleId) => {
            try {
                const res = await getArticleApi(articleId);
                // set dữ liệu chi tiết bài viết
                setTimeout(() => {
                    setArticleData(res?.data);
                }, 200);
                // setArticleData(res?.data);
                // Set state bình luận của bài viết
                // Thêm isLikedByAuthor vào từng bình luận trong res và Set State commentsData
                setCommentsData({
                    comments: recursiveAddIsLikedByAuthor(res?.data?.comments, res?.data),
                    commentCount: res?.data?.commentCount,
                });
                // set document title
                document.title = `${res?.data?.textContent} | ${res?.data?.User?.userName}`;
            } catch (error) {
                console.log(error);
            }
        };
        getArticle(articleID);
    }, []);

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
    // CÁC THAO TÁC CỦA COMMENT (Tạo, Xóa, Thích, Options)
    // *** PHẦN CREATE COMMENT ***
    // Handle Reset Comments Data ** CHO COMMENT ** (Callback) (Tạm OK, có thể tối ưu hơn)
    // Hàm này thực hiện cập nhật lại state commentsData để BÌNH LUẬN CON được tạo hiện ra giao diện
    const handleResetCommentsData = (newReplyComment) => {
        let replyComment = newReplyComment;
        replyComment.replies = {}; // Khởi tạo replies rỗng
        replyComment.likes = {}; // Khởi tạo likes rỗng
        // Set lại state commentsData
        setCommentsData((prev) => {
            let newComments = prev.comments;
            let newReplyCommentMap = {};
            // Tạo map cho replyComment
            newReplyCommentMap[replyComment.commentId] = replyComment;
            // Thêm vào replies của comment cha tương ứng
            newComments[replyComment.parentCommentId].replies = {
                ...newReplyCommentMap,
                ...newComments[replyComment.parentCommentId].replies,
            };
            // return kết quả
            return {
                comments: { ...newComments },
                commentCount: prev?.commentCount + 1,
            };
        });
        return;
    };
    // Handle Reset Comments Data ** CHO ARTICLE ** (Callback) (Tạm thời, có thể sẽ hợp thành 1 hàm reset commentsData duy nhất)
    // Hàm này thực hiện cập nhật lại state commentsData để BÌNH LUẬN CHA được tạo hiện ra giao diện
    const handleResetCommentsDataOfArticle = (newReplyComment) => {
        // Thêm bình luận cha vào danh sách
        let newComment = newReplyComment;
        newComment.replies = {}; // Khởi tạo replies rỗng
        newComment.likes = {}; // Khởi tạo likes rỗng
        // Set state commentsData
        setCommentsData((prev) => {
            let newCommentMap = {};
            // Tạo map cho comment
            newCommentMap[newComment.commentId] = newComment;
            // return kết quả
            return {
                comments: { ...newCommentMap, ...prev?.comments },
                commentCount: prev?.commentCount + 1,
            };
        });
    };
    // Handle lấy thông tin của bình luận được trả lời
    const handleGetRespondedComment = ({ parentCommentId, respondedCommentId }) => {
        console.log('handleGetRespondedComment');
        // Tìm bình luận cha với parentCommentId truyền vào
        // Sau đó tìm bình luận nào có id là respondedCommentId trong replies của bình luận cha đó
        // return bình luận tìm thấy
    };
    // *** PHẦN DELETE COMMENT ***
    // Handle Reset Comments Data (Callback) khi có bình luận nào bị XÓA
    // Đếm toàn bộ số bình luận con (trong replies)
    const countCommentsRecursive = (comment) => {
        let count = 1; // tính chính nó
        const replies = comment.replies || {};
        //
        for (const replyId in replies) {
            count += countCommentsRecursive(replies[replyId]);
        }
        return count;
    };
    // Hàm xóa bình luận khỏi danh sách bình luận (Đệ quy)
    // comments (type Map)
    const removeCommentById = (comments, commentId) => {
        let deletedCount = 0;

        const recursiveRemove = (commentsList) => {
            const updated = {};
            //
            for (const id in commentsList) {
                const comment = commentsList[id];
                // Check xem có phải comment cần xóa không
                if (id === commentId) {
                    // Tính số lượng comment xóa (cả comment con nếu có)
                    deletedCount += countCommentsRecursive(comment);
                    continue; // Bỏ qua comment này (để xóa)
                }
                // Đệ quy trong replies
                const updatedReplies = recursiveRemove(comment.replies || {});
                updated[id] = {
                    ...comment,
                    replies: updatedReplies,
                };
            }
            // return
            return updated;
        };

        const newComments = recursiveRemove(comments);
        return {
            newComments,
            deletedCount,
        };
    };
    // Hàm cập nhật lại state commentsData để xóa bình luận khỏi danh sách bình luận
    const handleResetCommentsDataWhenDelete = (commentId) => {
        setCommentsData((prev) => {
            const updatedComments = removeCommentById(prev?.comments, commentId);
            // Gán vào state commentsData
            return {
                comments: updatedComments.newComments,
                commentCount: prev?.commentCount - updatedComments.deletedCount,
            };
        });
    };
    // *** PHẦN LIKE COMMENT ***
    // Thêm isLikedByAuthor vào các comment trong commentsData (Đệ quy)
    const recursiveAddIsLikedByAuthor = (comments, articleData) => {
        const updatedComments = {};

        for (const commentId in comments) {
            const comment = comments[commentId];

            // likes là object nên cần check từng key
            const likes = comment.likes || {};
            const isLiked = Object.values(likes).some((like) => like.userId === articleData?.userId);

            // Gán isLikedByAuthor (nếu có thì là User object, nếu không thì false)
            comment.isLikedByAuthor = isLiked ? articleData?.User : false;

            // Đệ quy replies
            if (comment.replies && Object.keys(comment.replies).length > 0) {
                comment.replies = recursiveAddIsLikedByAuthor(comment.replies, articleData);
            }

            updatedComments[commentId] = comment;
        }

        return updatedComments;
    };
    // Handle Callback cập nhật thay đổi cho event like
    // Handle thêm/xóa Like cho Comment tương ứng trong State commentsData (Callback) (Chưa coi lại)
    const handleAddLikeComment = (likeCommentData, action) => {
        // Cập nhật lại state commentsData để thêm like hoặc xóa like của bình luận
        if (action === 'unlike') {
            // Và giảm likeCount của comment, đổi likeStatus thành false
            // Và đổi isLikedByAuthor thành false nếu là author bấm nút, không thì giữ nguyên
            setCommentsData((prev) => {
                let updatedComment = !likeCommentData?.parentCommentId
                    ? prev?.comments[likeCommentData.commentId]
                    : prev?.comments[likeCommentData.parentCommentId].replies[likeCommentData.commentId];
                let updatedComments = prev?.comments;
                // Check xem phải author article ko và cập nhật tương ứng
                if (auth?.user?.userId === articleData?.userId) {
                    updatedComment = {
                        ...updatedComment,
                        likeCount: updatedComment?.likeCount - 1,
                        likeStatus: false,
                        isLikedByAuthor: false,
                    };
                } else {
                    updatedComment = { ...updatedComment, likeCount: updatedComment?.likeCount - 1, likeStatus: false };
                }
                // Tìm và cập nhật comment đó trong commentsData
                if (!likeCommentData?.parentCommentId) {
                    updatedComments[likeCommentData?.commentId] = { ...updatedComment };
                } else {
                    updatedComments[likeCommentData?.parentCommentId].replies[likeCommentData?.commentId] = {
                        ...updatedComment,
                    };
                }
                // return kết quả commentsData
                return {
                    comments: { ...updatedComments },
                    commentCount: prev?.commentCount,
                };
            });
        } else if (action === 'like') {
            // Và tăng likeCount của comment, đổi likeStatus thành true
            // Và đổi isLikedByAuthor thành Object User nếu là author bấm nút, không thì giữ nguyên
            setCommentsData((prev) => {
                let updatedComment = !likeCommentData?.parentCommentId
                    ? prev?.comments[likeCommentData.commentId]
                    : prev?.comments[likeCommentData.parentCommentId].replies[likeCommentData.commentId];
                let updatedComments = prev?.comments;
                // Check xem phải author article ko và cập nhật tương ứng
                if (auth?.user?.userId === articleData?.userId) {
                    updatedComment = {
                        ...updatedComment,
                        likeCount: updatedComment?.likeCount + 1,
                        likeStatus: true,
                        isLikedByAuthor: articleData?.User,
                    };
                } else {
                    updatedComment = { ...updatedComment, likeCount: updatedComment?.likeCount + 1, likeStatus: true };
                }
                // Tìm và cập nhật comment đó trong commentsData
                if (!likeCommentData?.parentCommentId) {
                    updatedComments[likeCommentData?.commentId] = { ...updatedComment };
                } else {
                    updatedComments[likeCommentData?.parentCommentId].replies[likeCommentData?.commentId] = {
                        ...updatedComment,
                    };
                }
                // return kết quả commentsData
                return {
                    comments: { ...updatedComments },
                    commentCount: prev?.commentCount,
                };
            });
        }
        return;
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
                        // Navigate quay về (Tạm thời)
                        navigate(-1);
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
            {/* Article Detail */}
            <div className="articleDetailPage">
                {/* Ant Design Message */}
                {contextHolder}
                {/* Thanh chuyển tab */}
                <div className="tabSwitchProfile">
                    <div
                        className="profileUserName"
                        style={{
                            display: 'grid',
                            height: 'fit-content',
                        }}
                    >
                        {articleData ? (
                            <>
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
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div>
                {/* Phần chi tiết bài viết */}
                {articleData ? (
                    <>
                        <div className="articleDetail" ref={articleRef}>
                            {/* Nội dung bài viết */}
                            <div className="article">
                                <div className="left">
                                    {/* Avatar */}
                                    <div className="userAvatar">
                                        <Link to={`/profile/${articleData?.User?.userName}`}>
                                            <img
                                                src={
                                                    articleData?.User?.userAvatar
                                                        ? env?.backend_url + articleData?.User?.userAvatar
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
                                                <span class="tooltiptext">
                                                    {formatTimestamp(articleData?.createdAt)}
                                                </span>
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
                                                                ))}
                                                            </Slider>
                                                            {articleData?.mediaContent.length >= 2 && (
                                                                <>
                                                                    <button
                                                                        className="btnPrevCarousel"
                                                                        onClick={previous}
                                                                    >
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
                                                    setIsOpenCommentInput(!isOpenCommentInput);
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
                                        {isOpenCommentInput ? (
                                            <CommentInput
                                                onReplyComment={handleResetCommentsDataOfArticle}
                                                articleData={articleData}
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Hộp xác nhận xóa bài viết */}
                            {isOpenDeleteConfirmBox && (
                                <div className="deleteConfirmBox">
                                    <div className="deleteConfirm">
                                        <span className="title">Bạn có chắc muốn xóa bài viết này?</span>
                                        <div className="btnBox">
                                            <button
                                                className="btnDelete"
                                                onClick={() => {
                                                    handleBtnDeleteArticle(articleData?.articleId);
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
                    </>
                ) : (
                    <>
                        {/* Skeleton Article */}
                        <div className="articleSkeleton">
                            {/* Nội dung bài viết */}
                            <div className="article">
                                <div className="left">
                                    {/* Avatar */}
                                    <div className="userAvatar"></div>
                                </div>
                                <div className="right">
                                    <div className="top">
                                        <div className="articleInfo">
                                            {/* User Name */}
                                            <span className="userName"></span>
                                            {/* Created At */}
                                            <span className="createdAt tooltip"></span>
                                        </div>
                                    </div>
                                    <div className="middle">
                                        <div className="content">
                                            <div className="text"></div>
                                            <div className="media">
                                                {/* Carousel Media */}
                                                <div className="carouselMedia">
                                                    <div className="mediaContainer"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bottom">
                                        {/* Các nút tương tác */}
                                        <div className="interactiveButtonBox"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* Các bình luận */}
                {articleData ? (
                    <>
                        <div className="articleComments">
                            {/* Comment List Component */}
                            {commentsData ? (
                                <CommentList
                                    commentListData={commentsData}
                                    onReplyComment={handleResetCommentsData}
                                    onDeleteComment={handleResetCommentsDataWhenDelete}
                                    getRespondedComment={handleGetRespondedComment}
                                    onLikeComment={handleAddLikeComment}
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    </>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '30px 0px',
                        }}
                    >
                        <IoSyncSharp
                            className="loadingAnimation"
                            style={{ color: 'white', width: '19px', height: '19px' }}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default ArticleDetail;

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
import CommentList from '../components/CommentList';
import CommentInput from '../components/CommentInput';
import UserName from '../components/UserName';
import { message } from 'antd';
import LikeSharedArticleButton from '../components/LikeSharedArticleButton';
import { EnvContext } from '~/context/env.context';

function SharedArticleDetail() {
    // State
    const [sharedArticleData, setSharedArticleData] = useState(); // Dữ liệu chi tiết bài chia sẻ
    const [commentsData, setCommentsData] = useState(); // Dữ liệu bình luận của bài chia sẻ từ API (type Map)
    const [isOpenCommentInput, SetIsOpenCommentInput] = useState(false); // Đóng/mở input comment
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

    console.log('Rerender SharedArticleDetail');

    // *** Call API GET SHARED ARTICLE DETAIL ***
    useEffect(() => {
        const sharedArticleID = location.pathname.split('/')[3];
        // Call API Get shared article detail
        const getSharedArticle = async (sharedArticleID) => {
            try {
                const res = await getSharedArticleApi(sharedArticleID);
                // Set dữ liệu chi tiết bài chia sẻ
                // setTimeout(() => {
                //     setSharedArticleData(res?.data);
                // }, 200);
                setSharedArticleData(res?.data);
                // Set state bình luận của bài viết
                // Thêm isLikedByAuthor vào từng bình luận trong res và Set State commentsData
                setCommentsData({
                    comments: recursiveAddIsLikedByAuthor(res?.data?.comments, res?.data),
                    commentCount: res?.data?.commentCount,
                });
                // set document title
                document.title = `${res?.data?.sharedTextContent ? res?.data?.sharedTextContent : '...'} | ${
                    res?.data?.User?.userName
                }`;
            } catch (error) {
                console.log(error);
            }
        };
        getSharedArticle(sharedArticleID);
    }, []);

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
    // Handle Reset Comments Data ** CHO SHARED ARTICLE ** (Callback) (Tạm thời, có thể sẽ hợp thành 1 hàm reset commentsData duy nhất)
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
    const recursiveAddIsLikedByAuthor = (comments, sharedArticleData) => {
        const updatedComments = {};

        for (const commentId in comments) {
            const comment = comments[commentId];

            // likes là object nên cần check từng key
            const likes = comment.likes || {};
            const isLiked = Object.values(likes).some((like) => like.userId === sharedArticleData?.userId);

            // Gán isLikedByAuthor (nếu có thì là User object, nếu không thì false)
            comment.isLikedByAuthor = isLiked ? sharedArticleData?.User : false;

            // Đệ quy replies
            if (comment.replies && Object.keys(comment.replies).length > 0) {
                comment.replies = recursiveAddIsLikedByAuthor(comment.replies, sharedArticleData);
            }

            updatedComments[commentId] = comment;
        }

        return updatedComments;
    };
    // Handle Callback cập nhật thay đổi cho event like
    // Handle thêm/xóa Like cho Comment tương ứng trong State commentsData (Callback)
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
                if (auth?.user?.userId === sharedArticleData?.userId) {
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
                if (auth?.user?.userId === sharedArticleData?.userId) {
                    updatedComment = {
                        ...updatedComment,
                        likeCount: updatedComment?.likeCount + 1,
                        likeStatus: true,
                        isLikedByAuthor: sharedArticleData?.User,
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
                        // Navigate quay về (Tạm thời)
                        navigate(-1);
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
                {/* Thanh chuyển tab */}
                <div className="tabSwitchProfile">
                    <div
                        className="profileUserName"
                        style={{
                            display: 'grid',
                            height: 'fit-content',
                        }}
                    >
                        {sharedArticleData ? (
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
                                    {sharedArticleData?.User?.userName}
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
                                    {timeAgo(sharedArticleData?.createdAt)}
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span className="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div>
                {/* Phần chi tiết bài viết */}
                {sharedArticleData ? (
                    <>
                        <div className="articleDetail" ref={sharedArticleRef}>
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
                                                        bottom:
                                                            sharedArticleOptionsBoxPosition === 'top' ? '100%' : 'auto',
                                                    }}
                                                >
                                                    {auth?.user?.userName === sharedArticleData?.User?.userName && (
                                                        <div
                                                            className="forAuthUser"
                                                            style={{
                                                                borderBottom:
                                                                    auth?.user?.userName !==
                                                                    sharedArticleData?.User?.userName
                                                                        ? '0.5px solid #1f1f1f'
                                                                        : 'none',
                                                                paddingBottom:
                                                                    auth?.user?.userName !==
                                                                    sharedArticleData?.User?.userName
                                                                        ? '8px'
                                                                        : '0px',
                                                                marginBottom:
                                                                    auth?.user?.userName !==
                                                                    sharedArticleData?.User?.userName
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
                                            {/* Article was shared */}
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
                                                            <Link
                                                                to={`/profile/${sharedArticleData?.Article?.User?.userName}`}
                                                            >
                                                                <img
                                                                    src={
                                                                        sharedArticleData?.Article?.User?.userAvatar
                                                                            ? env?.backend_url +
                                                                              sharedArticleData?.Article?.User
                                                                                  ?.userAvatar
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
                                                                    userName={
                                                                        sharedArticleData?.Article?.User?.userName
                                                                    }
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
                                                                        <IoLockClosedOutline
                                                                            style={{ color: 'dimgray' }}
                                                                        />
                                                                    )}
                                                                </span>
                                                                {/* Created At */}
                                                                <span className="createdAt tooltip">
                                                                    {timeAgo(sharedArticleData?.Article?.createdAt)}
                                                                    <span className="tooltiptext">
                                                                        {formatTimestamp(
                                                                            sharedArticleData?.Article?.createdAt,
                                                                        )}
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
                                                                            sharedArticleData?.Article?.mediaContent
                                                                                ?.length === 0
                                                                                ? '0px'
                                                                                : '8px',
                                                                    }}
                                                                >
                                                                    {sharedArticleData?.Article?.textContent}
                                                                </div>
                                                                <div className="media">
                                                                    {/* Render Carousel Media */}
                                                                    {sharedArticleData?.Article?.mediaContent.length <=
                                                                    0 ? (
                                                                        <></>
                                                                    ) : (
                                                                        <>
                                                                            <div
                                                                                className="carouselMedia"
                                                                                style={{
                                                                                    marginBottom:
                                                                                        sharedArticleData?.Article
                                                                                            ?.mediaContent?.length > 1
                                                                                            ? '0px'
                                                                                            : '0px',
                                                                                    cursor:
                                                                                        sharedArticleData?.Article
                                                                                            ?.mediaContent?.length > 1
                                                                                            ? 'grab'
                                                                                            : 'pointer',
                                                                                }}
                                                                                onMouseDown={(e) => {
                                                                                    e.target.style.cursor =
                                                                                        sharedArticleData?.Article
                                                                                            ?.mediaContent?.length > 1
                                                                                            ? 'grabbing'
                                                                                            : 'pointer';
                                                                                }}
                                                                                onMouseUp={(e) => {
                                                                                    e.target.style.cursor =
                                                                                        sharedArticleData?.Article
                                                                                            ?.mediaContent?.length > 1
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
                                                                                                    {media.type ===
                                                                                                    'photo' ? (
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
                                                                                {sharedArticleData?.Article
                                                                                    ?.mediaContent.length >= 2 && (
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
                                                        <div className="bottom">{/*  */}</div>
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
                                                    SetIsOpenCommentInput(!isOpenCommentInput);
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
                                        {isOpenCommentInput ? (
                                            <CommentInput
                                                onReplyComment={handleResetCommentsDataOfArticle}
                                                sharedArticleData={sharedArticleData}
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
                {sharedArticleData ? (
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

export default SharedArticleDetail;

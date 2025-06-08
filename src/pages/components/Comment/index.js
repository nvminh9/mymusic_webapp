import { use, useContext, useEffect, useRef, useState } from 'react';
import {
    IoAlertCircleOutline,
    IoBanOutline,
    IoCaretForwardSharp,
    IoChatboxOutline,
    IoChevronDownSharp,
    IoChevronUpSharp,
    IoCloseCircleOutline,
    IoCreateOutline,
    IoHeart,
    IoHeartOutline,
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { AuthContext } from '~/context/auth.context';
import CommentInput from '../CommentInput';
import UserTag from '../UserTag';
import UserName from '../UserName';
import LikeArticleButton from '../LikeArticleButton';
import LikeCommentButton from '../LikeCommentButton';
import { VscEllipsis } from 'react-icons/vsc';
import { set } from 'lodash';
import { deleteCommentApi } from '~/utils/api';

function Comment({ comment, onReplyComment, onDeleteComment, getRespondedComment, onLikeComment }) {
    // State
    const [isOpenRepliesBox, setIsOpenRepliesBox] = useState(false); // đóng/mở hộp xem phản hồi
    const [isOpenRepliesInput, setIsOpenRepliesInput] = useState(false); // đóng/mở input nhập phản hồi
    const [isOpenCommentOptions, setIsOpenCommentOptions] = useState(false); // đóng/mở comment options
    const [commentOptionsBoxPosition, setCommentOptionsBoxPosition] = useState(); // comment options box position
    const [isOpenDeleteConfirmBox, setIsOpenDeleteConfirmBox] = useState(false); // đóng/mở hộp xác nhận xóa bình luận

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const commentRef = useRef(null); // ref cho comment
    const commentOptionsButtonRef = useRef(null); // ref cho nút comment options
    const commentOptionsBoxRef = useRef(null); // ref cho comment options box

    // React Hook Form

    // --- Handle Functions ---
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
    // Handle nút xem phản hồi ở các bình luận
    const handleToggleReplies = () => {
        setIsOpenRepliesBox(!isOpenRepliesBox);
        // Nếu sau khi show thì scroll xuống
        // if (!isOpenRepliesBox && repliesRef.current) {
        //     // Delay 1 chút để đảm bảo UI render xong
        //     setTimeout(() => {
        //         repliesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        //     }, 1000);
        // }
    };
    // Handle nút đóng/mở input phản hồi
    const handleBtnReplyComment = () => {
        setTimeout(() => {
            if (!isOpenRepliesInput) {
                // console.log('Focus input');
                // Focus vào input
                document.getElementById(`inputCommentID${comment?.commentId}`).focus();
                // Scroll vào comment được mở input
                let offset = 70; // Height của tabSwitchProfile
                let y =
                    document.getElementById(`commentID${comment?.commentId}`).getBoundingClientRect().top +
                    window.scrollY -
                    offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
                return;
            } else {
                // console.log('Unfocus input');
                return;
            }
        }, 100);
        setIsOpenRepliesInput(!isOpenRepliesInput); // Set trạng thái đóng/mở input
    };
    // Handle Format Comment Content (chuyển tag @ thành link)
    const handleFormatCommentContent = (content) => {
        // Regex để tách các phần bắt đầu bằng @username hoặc text thường
        const regex = /(@[a-zA-Z0-9_]+)|([^@]+)/g;
        const parts = Array.from(content.matchAll(regex)).map((match, index) => {
            const [fullMatch, tag, text] = match;
            if (tag) {
                const userName = tag.slice(1);
                return (
                    <UserTag key={index} userName={userName}>
                        {tag}
                    </UserTag>
                );
            } else {
                return (
                    <span key={index} style={{ marginLeft: '5px' }}>
                        {text}
                    </span>
                );
            }
        });
        //
        return parts;
    };
    // Handle nút đóng/mở comment options
    const handleToggleCommentOptions = () => {
        setTimeout(() => {
            setIsOpenCommentOptions(!isOpenCommentOptions);
            // Xác định vị trí hiển thị
            setTimeout(() => {
                if (commentOptionsButtonRef.current && commentOptionsBoxRef.current) {
                    const commentOptionsButton = commentOptionsButtonRef.current.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    if (commentOptionsButton.bottom > windowHeight / 2) {
                        setCommentOptionsBoxPosition('top');
                    } else {
                        setCommentOptionsBoxPosition('bottom');
                    }
                }
            }, 0); // đảm bảo DOM đã render xong
        }, 80);
    };
    // Đóng Comment Options khi click ra ngoài
    useEffect(() => {
        const handleClickOutsideCommentOptions = (event) => {
            if (commentOptionsBoxRef.current && !commentOptionsBoxRef.current.contains(event.target)) {
                setIsOpenCommentOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsideCommentOptions);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideCommentOptions);
        };
    }, []);
    // Đóng/mở Hộp xác nhận xóa bình luận
    const handleToggleDeleteComment = () => {
        // Hiển thị hộp xác nhận xóa bình luận
        setIsOpenCommentOptions(false); // Đóng comment options nếu đang mở
        setIsOpenDeleteConfirmBox(!isOpenDeleteConfirmBox);
    };
    // Handle Button Delete Comment
    const handleBtnDeleteComment = async (commentId) => {
        // Xử lý xóa bình luận
        try {
            // Call API delete comment
            const res = await deleteCommentApi(commentId);
            // Kiểm tra
            if (res?.status === 200 && res?.message === 'Xóa bình luận thành công') {
                console.log('Xóa bình luận thành công');
                // Đóng hộp xác nhận xóa bình luận
                setIsOpenDeleteConfirmBox(false);
                // Gọi hàm onDeleteComment để cập nhật lại danh sách bình luận
                onDeleteComment(commentId);
            } else {
                console.error('Xóa bình luận không thành công:', res?.message);
                return;
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            return;
        }
    };

    return (
        <>
            {/* Bình luận */}
            <div
                ref={commentRef}
                id={`commentID${comment?.commentId}`}
                className={`commentWrapper ${comment?.parentCommentId ? 'reply' : ''}`}
            >
                <div className="comment">
                    <div className="left">
                        {/* Avatar */}
                        <div className="userAvatar">
                            <Link to={`/profile/${comment?.User?.userName}`}>
                                <img
                                    src={
                                        comment?.User?.userAvatar
                                            ? process.env.REACT_APP_BACKEND_URL + comment?.User?.userAvatar
                                            : defaultAvatar
                                    }
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="right">
                        <div className="top">
                            <div className="articleInfo">
                                {/* Component UserName */}
                                <UserName userName={comment?.User?.userName} />
                                {/* Trả lời bình luận của ai đó */}
                                {comment?.respondedComment && comment?.respondedCommentId !== null ? (
                                    <span className="replyTo">
                                        <IoCaretForwardSharp />
                                        {/* Component UserName */}
                                        {comment?.respondedComment ? (
                                            <UserName userName={comment?.respondedComment?.User?.userName} />
                                        ) : (
                                            ''
                                        )}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                <span className="createdAt tooltip">
                                    {timeAgo(comment?.createdAt)}
                                    <span class="tooltiptext">{formatTimestamp(comment?.createdAt)}</span>
                                </span>
                                {/* Được thích bởi người đăng */}
                                {comment?.isLikedByAuthor && (
                                    <span className="isLikedByAuthor">
                                        <img
                                            src={
                                                comment?.isLikedByAuthor?.userAvatar
                                                    ? process.env.REACT_APP_BACKEND_URL +
                                                      comment?.isLikedByAuthor?.userAvatar
                                                    : defaultAvatar
                                            }
                                        />
                                        <IoHeart />
                                    </span>
                                )}
                            </div>
                            <div className="articleOptions">
                                <button
                                    className="btnArticleOptions"
                                    onClick={() => {
                                        handleToggleCommentOptions();
                                    }}
                                    ref={commentOptionsButtonRef}
                                >
                                    <VscEllipsis />
                                </button>
                                {/* Menu Comment Options */}
                                {isOpenCommentOptions && (
                                    <div
                                        className="commentOptionsBox"
                                        ref={commentOptionsBoxRef}
                                        style={{
                                            bottom: commentOptionsBoxPosition === 'top' ? '100%' : 'auto',
                                        }}
                                    >
                                        {auth?.user?.userName === comment?.User?.userName && (
                                            <div
                                                className="forAuthUser"
                                                style={{
                                                    borderBottom:
                                                        auth?.user?.userName !== comment?.User?.userName
                                                            ? '0.5px solid #1f1f1f'
                                                            : 'none',
                                                    paddingBottom:
                                                        auth?.user?.userName !== comment?.User?.userName
                                                            ? '8px'
                                                            : '0px',
                                                    marginBottom:
                                                        auth?.user?.userName !== comment?.User?.userName
                                                            ? '8px'
                                                            : '0px',
                                                }}
                                            >
                                                {/* Nút sửa bình luận */}
                                                {/* <button className="btnEditComment" id="btnEditCommentID">
                                                    Sửa <IoCreateOutline />
                                                </button> */}
                                                {/* Nút xóa bình luận */}
                                                <button
                                                    className="btnDeleteComment"
                                                    id="btnDeleteCommentID"
                                                    style={{ color: 'rgb(255, 48, 64)' }}
                                                    onClick={() => {
                                                        handleToggleDeleteComment();
                                                    }}
                                                >
                                                    Xóa <IoCloseCircleOutline />
                                                </button>
                                            </div>
                                        )}
                                        {auth?.user?.userName !== comment?.User?.userName && (
                                            <>
                                                {/* Nút chặn người bình luận */}
                                                <button
                                                    className="btnReportComment"
                                                    id="btnReportCommentID"
                                                    style={{ color: 'rgb(255, 48, 64)' }}
                                                >
                                                    Chặn <IoBanOutline />
                                                </button>
                                                {/* Nút báo cáo bình luận */}
                                                <button
                                                    className="btnReportComment"
                                                    id="btnReportCommentID"
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
                                {/* <div className="text">{comment?.content}</div> */}
                                <div className="text">{handleFormatCommentContent(comment?.content)}</div>
                                <div className="media">{/* Media */}</div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="interactiveButtonBox">
                                {/* Nút thích bài viết */}
                                <LikeCommentButton commentData={comment} onLikeComment={onLikeComment} />
                                {/* Nút bình luận */}
                                <button
                                    type="button"
                                    className="btnComment"
                                    id="btnCommentID"
                                    onClick={() => {
                                        handleBtnReplyComment();
                                    }}
                                >
                                    <IoChatboxOutline /> {comment?.replies.length ? comment?.replies.length : 0}
                                </button>
                                {/* Nút xem phản hồi */}
                                {comment?.replies.length > 0 && (
                                    <button
                                        type="button"
                                        className="btnOpenFeedback"
                                        id="btnOpenFeedbackID"
                                        onClick={() => {
                                            handleToggleReplies();
                                        }}
                                    >
                                        {isOpenRepliesBox ? (
                                            <>
                                                Ẩn phản hồi <IoChevronUpSharp />
                                            </>
                                        ) : (
                                            <>
                                                Xem {comment?.replies.length} phản hồi <IoChevronDownSharp />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            {/* Input Phản hồi */}
                            {isOpenRepliesInput ? (
                                <>
                                    {/* Comment Input Component */}
                                    <CommentInput
                                        comment={comment}
                                        onReplyComment={onReplyComment}
                                        setIsOpenRepliesBox={setIsOpenRepliesBox}
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                            {/* Hộp bình luận phản hồi */}
                            {isOpenRepliesBox && comment?.replies && comment?.replies.length > 0 ? (
                                <>
                                    {/* <div ref={repliesRef}> */}
                                    {comment?.replies.map((reply) => (
                                        <Comment
                                            key={reply.commentId}
                                            comment={reply}
                                            onReplyComment={onReplyComment}
                                            onDeleteComment={onDeleteComment}
                                        />
                                    ))}
                                    {/* </div> */}
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
                {/* Hộp xác nhận xóa bình luận */}
                {isOpenDeleteConfirmBox && (
                    <div className="deleteConfirmBox">
                        <div className="deleteConfirm">
                            <span className="title">Bạn có chắc muốn xóa bình luận này?</span>
                            <div className="btnBox">
                                <button
                                    className="btnDelete"
                                    onClick={() => {
                                        handleBtnDeleteComment(comment?.commentId);
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
    );
}

export default Comment;

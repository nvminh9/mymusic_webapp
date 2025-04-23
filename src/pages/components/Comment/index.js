import { useRef, useState } from 'react';
import { IoChatboxOutline, IoChevronDownSharp, IoChevronUpSharp, IoHeartOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';

function Comment({ comment }) {
    // State
    const [isOpenRepliesBox, SetIsOpenRepliesBox] = useState(false);

    // Context

    // Ref
    const repliesRef = useRef(null);

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
        SetIsOpenRepliesBox(!isOpenRepliesBox);
        // Nếu sau khi show thì scroll xuống
        // if (!isOpenRepliesBox && repliesRef.current) {
        //     // Delay 1 chút để đảm bảo UI render xong
        //     setTimeout(() => {
        //         repliesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        //     }, 1000);
        // }
    };

    return (
        <>
            {/* Bình luận */}
            <div className={`commentWrapper ${comment?.parentCommentId ? 'reply' : ''}`}>
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
                                <Link to={`/profile/${comment?.User?.userName}`} style={{ textDecoration: 'none' }}>
                                    <span className="userName">{comment?.User?.userName}</span>
                                </Link>
                                <span className="createdAt tooltip">
                                    {timeAgo(comment?.createdAt)}
                                    <span class="tooltiptext">{formatTimestamp(comment?.createdAt)}</span>
                                </span>
                            </div>
                            <div className="articleOptions">
                                {/* <button className="btnArticleOptions">
                                        <VscEllipsis></VscEllipsis>
                                    </button> */}
                            </div>
                        </div>
                        <div className="middle">
                            <div className="content">
                                <div className="text">{comment?.content}</div>
                                <div className="media">{/* Media */}</div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="interactiveButtonBox">
                                {/* Nút thích bài viết */}
                                <button type="button" className="btnLike" id="btnLikeID">
                                    <IoHeartOutline /> 0
                                </button>
                                {/* Nút bình luận */}
                                <button type="button" className="btnComment" id="btnCommentID">
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
                        </div>
                    </div>
                </div>
                {/* Bình luận phản hồi */}
                {isOpenRepliesBox && comment?.replies && comment?.replies.length > 0 ? (
                    <>
                        {/* <div ref={repliesRef}> */}
                        {comment?.replies.map((reply) => (
                            <Comment key={reply.commentId} comment={reply} />
                        ))}
                        {/* </div> */}
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}

export default Comment;

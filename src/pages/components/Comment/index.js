import { useContext, useRef, useState } from 'react';
import {
    IoCaretForwardSharp,
    IoChatboxOutline,
    IoChevronDownSharp,
    IoChevronUpSharp,
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

function Comment({ comment, onReplyComment, getRespondedComment }) {
    // State
    const [isOpenRepliesBox, setIsOpenRepliesBox] = useState(false); // đóng/mở hộp xem phản hồi
    const [isOpenRepliesInput, setIsOpenRepliesInput] = useState(false); // đóng/mở input nhập phản hồi

    // Context
    const { auth } = useContext(AuthContext);

    // Ref

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

    return (
        <>
            {/* Bình luận */}
            <div
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
                            </div>
                            <div className="articleOptions">
                                {/* <button className="btnArticleOptions">
                                        <VscEllipsis></VscEllipsis>
                                    </button> */}
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
                                {/* <button type="button" className="btnLike" id="btnLikeID">
                                    <IoHeartOutline /> 0
                                </button> */}
                                <LikeCommentButton />
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
            </div>
        </>
    );
}

export default Comment;

import { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    IoAlertCircleOutline,
    IoArrowUpSharp,
    IoChatboxOutline,
    IoChevronDownSharp,
    IoChevronUpSharp,
    IoHeartOutline,
    IoSyncSharp,
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { AuthContext } from '~/context/auth.context';
import { createCommentApi } from '~/utils/api';

function Comment({ comment }) {
    // State
    const [isOpenRepliesBox, setIsOpenRepliesBox] = useState(false); // đóng/mở hộp xem phản hồi
    const [isOpenRepliesInput, setIsOpenRepliesInput] = useState(false); // đóng/mở input nhập phản hồi
    const [replyCommentStatus, setReplyCommentStatus] = useState(); // For Loading Reply Comment Animation
    const [commentData, setCommentData] = useState(comment); // Comment Data

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const repliesRef = useRef(null);

    // React Hook Form (Form Upload Article)
    const formReplyComment = useForm();
    const { register, handleSubmit, formState, watch, setError, clearErrors, setFocus } = formReplyComment;
    const { errors } = formState;

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
        setIsOpenRepliesInput(!isOpenRepliesInput);
    };
    // Handle Submit formReplyComment
    const onSubmitFormReplyComment = async (data) => {
        // console.log('data', data);
        // console.log('commentId', commentData?.commentId);
        // Start Loading
        setReplyCommentStatus('pending');

        let replyCommentData = {};
        replyCommentData.articleId = commentData?.articleId;
        replyCommentData.content = data.content;
        replyCommentData.parentCommentId = commentData?.commentId; // ID của bình luận cha

        setTimeout(async () => {
            // Call API tạo bình luận
            try {
                const res = await createCommentApi(replyCommentData);
                // Kiểm tra
                if (res?.data !== null) {
                    // Set lại comment
                    if (res.data?.parentCommentId !== null) {
                        // Nếu là bình luận con thì thêm vào replies
                        let newReplyComment = res.data;
                        newReplyComment.replies = []; // Khởi tạo mảng replies rỗng
                        setCommentData((prev) => ({ ...prev, replies: [newReplyComment, ...prev.replies] }));
                    }

                    // Reset Form Reply Comment
                    formReplyComment.reset();
                    // Stop Loading with success
                    setReplyCommentStatus('success');
                    // Open Replies Box
                    setIsOpenRepliesBox(true);
                    console.log('Trả lời bình luận thành công');
                } else {
                    // Stop Loading with fail
                    setReplyCommentStatus('fail');
                    console.log('Trả lời bình luận không thành công');
                }
            } catch (error) {
                // Stop Loading with fail
                setReplyCommentStatus('fail');
                console.log(error);
            }
        }, 1000);
    };

    return (
        <>
            {/* Bình luận */}
            <div className={`commentWrapper ${commentData?.parentCommentId ? 'reply' : ''}`}>
                <div className="comment">
                    <div className="left">
                        {/* Avatar */}
                        <div className="userAvatar">
                            <Link to={`/profile/${commentData?.User?.userName}`}>
                                <img
                                    src={
                                        commentData?.User?.userAvatar
                                            ? process.env.REACT_APP_BACKEND_URL + commentData?.User?.userAvatar
                                            : defaultAvatar
                                    }
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="right">
                        <div className="top">
                            <div className="articleInfo">
                                <Link to={`/profile/${commentData?.User?.userName}`} style={{ textDecoration: 'none' }}>
                                    <span className="userName">{commentData?.User?.userName}</span>
                                </Link>
                                <span className="createdAt tooltip">
                                    {timeAgo(commentData?.createdAt)}
                                    <span class="tooltiptext">{formatTimestamp(commentData?.createdAt)}</span>
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
                                <div className="text">{commentData?.content}</div>
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
                                <button
                                    type="button"
                                    className="btnComment"
                                    id="btnCommentID"
                                    onClick={() => {
                                        handleBtnReplyComment();
                                    }}
                                >
                                    <IoChatboxOutline /> {commentData?.replies.length ? commentData?.replies.length : 0}
                                </button>
                                {/* Nút xem phản hồi */}
                                {commentData?.replies.length > 0 && (
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
                                                Xem {commentData?.replies.length} phản hồi <IoChevronDownSharp />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            {/* Input Phản hồi */}
                            {isOpenRepliesInput ? (
                                <>
                                    <div className="commentBox" style={{ marginBottom: '10px' }}>
                                        <img
                                            className="userAvatar"
                                            src={
                                                auth?.user?.userAvatar
                                                    ? process.env.REACT_APP_BACKEND_URL + auth?.user?.userAvatar
                                                    : defaultAvatar
                                            }
                                        />
                                        <form
                                            onSubmit={handleSubmit(onSubmitFormReplyComment)}
                                            className="formComment"
                                            id="formCommentID"
                                            method="POST"
                                            noValidate
                                        >
                                            <textarea
                                                className="inputComment"
                                                id="inputCommentID"
                                                placeholder={`Trả lời ${commentData?.User?.userName}...`}
                                                type="text"
                                                {...register('content', {
                                                    required: 'Chưa nhập nội dung',
                                                    maxLength: {
                                                        value: 500,
                                                        message: 'Nội dung không được quá 500 ký tự',
                                                    },
                                                })}
                                                style={{
                                                    border:
                                                        replyCommentStatus === 'fail'
                                                            ? '.5px solid rgb(233 20 41 / 54%)'
                                                            : '0.5px solid transparent',
                                                }}
                                            />
                                            <button type="submit" className="btnPostComment" id="btnPostCommentID">
                                                {replyCommentStatus === 'pending' ? (
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
                                </>
                            ) : (
                                <></>
                            )}
                            {/* Bình luận phản hồi */}
                            {isOpenRepliesBox && commentData?.replies && commentData?.replies.length > 0 ? (
                                <>
                                    {/* <div ref={repliesRef}> */}
                                    {commentData?.replies.map((reply) => (
                                        <Comment key={reply.commentId} comment={reply} />
                                    ))}
                                    {/* </div> */}
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
                {/* Check Data */}
                <pre style={{ color: 'red' }} hidden>
                    {JSON.stringify(watch(), null, 2)}
                </pre>
            </div>
        </>
    );
}

export default Comment;

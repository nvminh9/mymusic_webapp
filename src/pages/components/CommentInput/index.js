import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoAlertCircleOutline, IoArrowUpSharp, IoSyncSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { AuthContext } from '~/context/auth.context';
import { createCommentApi } from '~/utils/api';

function CommentInput({ comment, onReplyComment, setIsOpenRepliesBox }) {
    // State
    const [value, setValue] = useState('');
    const [highlightedValue, setHighlightedValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [tagStartIndex, setTagStartIndex] = useState(null);
    const textareaRef = useRef(null);
    const [replyCommentStatus, setReplyCommentStatus] = useState(); // For Loading Reply Comment Animation

    // Context
    const { auth } = useContext(AuthContext);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // Ref

    // React Hook Form (Form Upload Article)
    const formReplyComment = useForm();
    const { register, handleSubmit, formState, watch, setError, clearErrors, setFocus } = formReplyComment;
    const { errors } = formState;

    // --- HANDLE FUNCTIONS ---
    useEffect(() => {
        // Khởi tạo tag
        const tag = `@${comment?.User?.userName} `;
        let prevContent = formReplyComment.getValues('content') || ''; // Nội dung của input trước khi tag
        let tagContent = prevContent.startsWith(tag) ? prevContent : tag + prevContent; // Kiểm tra và thêm tag
        formReplyComment.setValue('content', tagContent);
    }, []);
    // Handle Submit formReplyComment
    const onSubmitFormReplyComment = async (data) => {
        // Start Loading
        setReplyCommentStatus('pending');
        // Data
        let replyCommentData = {};
        replyCommentData.articleId = comment?.articleId;
        replyCommentData.content = data.content;
        replyCommentData.parentCommentId =
            comment?.parentCommentId === null ? comment?.commentId : comment?.parentCommentId; // ID của bình luận cha (Bình luận trả lời bài viết)
        replyCommentData.respondedCommentId = comment?.commentId; // ID của bình luận được trả lời
        //
        setTimeout(async () => {
            // Call API tạo bình luận
            try {
                const res = await createCommentApi(replyCommentData);
                // Kiểm tra
                if (res?.data !== null) {
                    // Gọi callback để cập nhật lại state commentsData ở component cha (component ArticleDetail),
                    // để hiển thị bình luận mới ra luôn
                    if (res.data?.parentCommentId !== null) {
                        onReplyComment(res.data);
                    }
                    // Reset Form Reply Comment
                    formReplyComment.reset();
                    // Stop Loading with success
                    setReplyCommentStatus('success');

                    // callback from Comment Component (Component Cha)
                    // Open Replies Box
                    setIsOpenRepliesBox(true);

                    console.log('Trả lời bình luận thành công');
                    // Highlight vào comment mới được thêm
                    const scrollToNewCommentTimeout = setTimeout(() => {
                        // Scroll vào comment
                        let offset = 70; // Height của tabSwitchProfile
                        let y =
                            document.getElementById(`commentID${res.data?.commentId}`).getBoundingClientRect().top +
                            window.scrollY -
                            offset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                        // Highlight vào comment
                        document.getElementById(`commentID${res.data?.commentId}`).classList.add('highlight');
                    }, 200);
                    return () => {
                        // Clear timeout
                        clearTimeout(scrollToNewCommentTimeout);
                    };
                } else {
                    // Stop Loading with fail
                    setReplyCommentStatus('fail');
                    console.log('Trả lời bình luận không thành công');
                    return;
                }
            } catch (error) {
                // Stop Loading with fail
                setReplyCommentStatus('fail');
                console.log(error);
                return;
            }
        }, 1000);
    };

    return (
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
                        id={`inputCommentID${comment?.commentId}`}
                        placeholder={`Trả lời ${comment?.User?.userName}...`}
                        type="text"
                        spellCheck="false"
                        rows={1}
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
                    {/* Check Data */}
                    <pre style={{ color: 'red' }} hidden>
                        {JSON.stringify(watch(), null, 2)}
                    </pre>
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
                                    <IoSyncSharp className="loadingAnimation" style={{ color: 'white' }} />
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
    );
}

export default CommentInput;

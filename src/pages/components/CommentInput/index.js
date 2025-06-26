import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoAlertCircleOutline, IoArrowUpSharp, IoSyncSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { AuthContext } from '~/context/auth.context';
import { createCommentApi, createCommentSharedArticleApi, getFollowsApi } from '~/utils/api';
import { debounce } from 'lodash';

// Component CommentInput
// comment: Nếu gọi ở Comment thì truyền data của comment
// articleData: Nếu gọi ở ArticleDetail thì truyền data của articleData
// onReplyComment: hàm reset state danh sách comment (cần truyền)
// setIsOpenRepliesBox: hàm set state isOpenRepliesBox (truyền khi gọi ở Comment Component)
function CommentInput({ comment, articleData, sharedArticleData, onReplyComment, setIsOpenRepliesBox }) {
    // State
    const [value, setValue] = useState(); // Nội dung trong textarea
    const [highlightedValue, setHighlightedValue] = useState(); //
    const [suggestions, setSuggestions] = useState(); // Danh sách user được gợi ý từ API
    const [showSuggestions, setShowSuggestions] = useState(false); // Có đang hiển thị danh sách gợi ý không
    const [tagStartIndex, setTagStartIndex] = useState(null); // Vị trí bắt đầu của tag (dấu @)
    const [replyCommentStatus, setReplyCommentStatus] = useState(); // For Loading Reply Comment Animation

    // Context
    const { auth } = useContext(AuthContext);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // Ref
    const textareaRef = useRef(null); // Ref của textarea

    // React Hook Form (Form Upload Article)
    const formReplyComment = useForm();
    const { register, handleSubmit, formState, watch, setError, clearErrors, setFocus } = formReplyComment;
    const { errors } = formState;

    // --- HANDLE FUNCTIONS ---
    useEffect(() => {
        if (comment) {
            // Nếu có comment (Component CommentInput trong Component Comment) thì add tag
            handleAutoAddTag();
        }
    }, []);
    // Handle auto add tag when open comment input
    const handleAutoAddTag = () => {
        // Khởi tạo tag
        const tag = `@${comment?.User?.userName} `;
        let prevContent = formReplyComment.getValues('content') || ''; // Nội dung của input trước khi tag
        let tagContent = prevContent.startsWith(tag) ? prevContent : tag + prevContent; // Kiểm tra và thêm tag
        formReplyComment.setValue('content', tagContent);
    };
    // Handle Submit formReplyComment
    const onSubmitFormReplyComment = async (data) => {
        // Kiểm tra content
        const trimmedContent = data?.content.trim();
        const isNotValid = /^[\s@]+$/.test(trimmedContent);
        if (trimmedContent === '' || isNotValid) {
            // Stop Loading with fail
            setReplyCommentStatus('fail');
            // Tắt show suggestions
            setShowSuggestions(false);
            setError('content', { type: 'required', message: 'Chưa nhập nội dung' });
            return;
        }
        // Start Loading
        setReplyCommentStatus('pending');
        // Data Prepare
        let replyCommentData = {};
        // Nếu Component này được gọi ở...
        // Comment Component
        if (comment) {
            if (comment?.articleId) {
                // Nếu trả lời Comment của Article
                replyCommentData.articleId = comment?.articleId;
            } else if (comment?.sharedArticleId) {
                // Nếu trả lời Comment của Shared Article
                replyCommentData.sharedArticleId = comment?.sharedArticleId;
            }
            replyCommentData.content = data.content;
            replyCommentData.parentCommentId =
                comment?.parentCommentId === null ? comment?.commentId : comment?.parentCommentId; // ID của bình luận cha (Bình luận trả lời bài viết)
            replyCommentData.respondedCommentId = comment?.commentId; // ID của bình luận được trả lời
        }
        // ArticleDetail Component
        if (articleData) {
            replyCommentData.articleId = articleData?.articleId;
            replyCommentData.content = data.content;
            replyCommentData.parentCommentId = null;
        }
        // SharedArticleDetail Component
        if (sharedArticleData) {
            replyCommentData.sharedArticleId = sharedArticleData?.sharedArticleId;
            replyCommentData.content = data.content;
            replyCommentData.parentCommentId = null;
        }

        setTimeout(async () => {
            // Call API tạo bình luận
            try {
                let res;
                //  Nếu CommentInput được gọi ở SharedArticleDetail Component
                if (sharedArticleData || comment?.sharedArticleId) {
                    res = await createCommentSharedArticleApi(replyCommentData);
                } else if (articleData || comment?.articleId) {
                    res = await createCommentApi(replyCommentData);
                }
                // Kiểm tra response
                if (res?.data !== null) {
                    // Gọi callback để cập nhật lại state commentsData ở component cha (component ArticleDetail),
                    // để hiển thị bình luận mới ra luôn
                    if (res.data?.parentCommentId !== null) {
                        onReplyComment(res.data);
                    }
                    // để hiện thị bình luận cha ra luôn (tạm thời)
                    if (res.data?.parentCommentId === null) {
                        onReplyComment(res.data);
                    }
                    // Reset Form Reply Comment
                    formReplyComment.reset();
                    // Stop Loading with success
                    setReplyCommentStatus('success');

                    // callback from Comment Component (Component Cha)
                    // Open Replies Box
                    if (setIsOpenRepliesBox) {
                        setIsOpenRepliesBox(true);
                    }
                    // Tắt show suggestions
                    setShowSuggestions(false);
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
                    // Tắt show suggestions
                    setShowSuggestions(false);
                    console.log('Trả lời bình luận không thành công');
                    return;
                }
            } catch (error) {
                // Stop Loading with fail
                setReplyCommentStatus('fail');
                // Tắt show suggestions
                setShowSuggestions(false);
                console.log(error);
                return;
            }
        }, 1000);
    };
    // Handle fetch users for autocomplete (Debounce)
    const handleFetchUsers = useCallback(
        debounce(async (query) => {
            try {
                // Call API Lấy danh sách đang theo dõi
                const res = await getFollowsApi(auth?.user?.userName);
                // Set state suggestions user (Tạm để setTimeout 300ms)
                const setSuggestionsTimeout = setTimeout(() => {
                    setSuggestions(res?.data?.rows);
                }, 300);
                // Set state show suggestions
                setShowSuggestions(true);
                //
                // Scroll vào comment đang mở Hộp suggestions user được mở
                let offset = 70; // Height của tabSwitchProfile
                let y =
                    document.getElementById(`commentID${comment?.commentId}`).getBoundingClientRect().top +
                    window.scrollY -
                    offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
                return () => {
                    clearTimeout(setSuggestionsTimeout);
                };
            } catch (error) {
                console.log('Error fetching users: ', error);
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }
        }, 400),
        [],
    );
    // Handle change (Comment Input value)
    const handleChange = (e) => {
        // newValue
        const newValue = e.target.value;
        setValue(newValue);
        // console.log(newValue);

        const cursorIndex = e.target.selectionStart;
        const lastAt = newValue.lastIndexOf('@', cursorIndex - 1);
        const spaceAfterAt = newValue.indexOf(' ', lastAt);

        if (lastAt !== -1 && (spaceAfterAt === -1 || spaceAfterAt >= cursorIndex)) {
            // tagQuery là nội dung đang gõ ngay sau dấu @
            const tagQuery = newValue.slice(lastAt + 1, cursorIndex);
            // console.log('tagQuery: ', tagQuery);
            if (tagQuery.length >= 0) {
                // Call API với tagQuery (đồng thời mở suggestionsList)
                handleFetchUsers(tagQuery);
                setTagStartIndex(lastAt); // Lưu vị trí bắt đầu để chèn username
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }
    };
    // Handle select (Chọn user từ autocomplete)
    const handleSelect = (user) => {
        // textarea dom
        let textareaRef = document.getElementById(`inputCommentID${comment?.commentId ? comment?.commentId : ''}`);
        // Nếu chưa có vị trí bắt đầu chèn thì không làm gì
        if (tagStartIndex === null) {
            return;
        }

        const before = value.slice(0, tagStartIndex);
        const after = value.slice(textareaRef.selectionStart);
        const inserted = `@${user.userName} `;
        const newVal = before + inserted + after; // Value mới có tag user

        setValue(newVal);
        formReplyComment.setValue('content', newVal);
        setShowSuggestions(false);
        textareaRef.focus();
        setTimeout(() => {
            const pos = before.length + inserted.length;
            textareaRef.setSelectionRange(pos, pos);
        }, 30);
    };

    return (
        <>
            <div className="commentBox" style={{}}>
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
                        id={`inputCommentID${comment?.commentId ? comment?.commentId : ''}`}
                        placeholder={comment ? `Trả lời ${comment?.User?.userName}...` : `Bình luận...`}
                        type="text"
                        spellCheck="false"
                        rows={1}
                        {...register('content', {
                            required: 'Chưa nhập nội dung',
                            maxLength: {
                                value: 500,
                                message: 'Nội dung không được quá 500 ký tự',
                            },
                            onChange: handleChange,
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
            {/* Suggestions Box For User Tag */}
            {showSuggestions && (
                <ul
                    className="tagSuggestionsList"
                    id={`tag${comment?.commentId ? comment?.commentId : articleData?.articleId}`}
                    style={{ height: suggestions?.length > 3 ? '184.8px' : 'max-content' }}
                >
                    {suggestions?.length > 0 ? (
                        <>
                            {suggestions?.map((user) => (
                                <li
                                    className="tag"
                                    key={user?.followingUser?.userId}
                                    onClick={() => handleSelect(user)}
                                >
                                    {/* Avatar */}
                                    <img
                                        className="tagAvatar"
                                        src={`${
                                            user?.followingUser?.userAvatar
                                                ? process.env.REACT_APP_BACKEND_URL + user?.followingUser?.userAvatar
                                                : defaultAvatar
                                        }`}
                                    />
                                    {/* Thông tin */}
                                    <div className="tagInfo">
                                        <span className="userName">{user?.followingUser?.userName}</span>
                                        <span className="name">{user?.followingUser?.name}</span>
                                    </div>
                                </li>
                            ))}
                        </>
                    ) : (
                        <div
                            style={{
                                width: '230px',
                                textAlign: 'center',
                                padding: '20px 0px',
                            }}
                        >
                            <IoSyncSharp
                                className="loadingAnimation"
                                style={{ color: 'white', width: '15px', height: '15px' }}
                            />
                        </div>
                    )}
                </ul>
            )}
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

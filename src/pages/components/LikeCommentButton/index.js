import { useCallback, useContext, useEffect, useState } from 'react';
import { IoHeart, IoHeartOutline, IoSparklesSharp } from 'react-icons/io5';
import {
    createLikeCommentApi,
    createLikeCommentSharedArticleApi,
    unLikeCommentApi,
    unLikeCommentSharedArticleApi,
} from '~/utils/api';
import { debounce } from 'lodash';
import { AuthContext } from '~/context/auth.context';

// commentData: được truyền khi gọi dùng ở Component Comment
function LikeCommentButton({ commentData, onLikeComment }) {
    // State
    const [liked, setLiked] = useState(() => (commentData?.likeStatus ? commentData?.likeStatus : false)); // Xác định người dùng đã thích bình luận hay chưa
    const [likesCount, setLikesCount] = useState(() => (commentData?.likeCount ? commentData?.likeCount : 0)); // Tổng số lượt thích của bình luận
    // const [loading, setLoading] = useState(); // Trạng thái loading, nếu API thích bình luận (Debounce) đang được gọi

    // Context
    const { auth } = useContext(AuthContext);

    // Ref

    // --- HANDLE FUNCTION ---
    // Set likesCount, liked State khi render
    useEffect(() => {
        // set likesCount
        // setLikesCount(articleData?.likeCount);
        // set liked
    });
    // Hàm gọi API thích bình luận (Debounce)
    const debouncedLikeComment = useCallback(
        debounce(async (newLiked) => {
            try {
                if (newLiked) {
                    // Nếu thích Comment của SharedArticle
                    if (commentData?.sharedArticleId) {
                        const res = await createLikeCommentSharedArticleApi(commentData?.commentId); // Nếu chưa like thì gọi API like
                    } else {
                        const res = await createLikeCommentApi(commentData?.commentId); // Nếu chưa like thì gọi API like
                    }
                    // Call onLikeComment với 'unlike'
                    // onLikeComment({ commentId: commentData?.commentId, userId: auth?.user?.userId, status: 0 }, 'like');
                    onLikeComment(commentData, 'like');
                } else {
                    // Nếu hủy thích Comment của SharedArticle
                    if (commentData?.sharedArticleId) {
                        const res = await unLikeCommentSharedArticleApi(commentData?.commentId); // Nếu like rồi thì gọi API unlike
                    } else {
                        const res = await unLikeCommentApi(commentData?.commentId); // Nếu like rồi thì gọi API unlike
                    }
                    // Call onLikeComment với 'unlike'
                    onLikeComment(commentData, 'unlike');
                }
            } catch (error) {
                console.error('Error updating like status', error);
            }
        }, 300), // Tạm thời Debounce từ 500ms -> 300ms (do debounce 500ms có thể lỗi, khi test bấm nút like liên tục ở
        // Comment CON và đóng HỘP XEM Comment CON lại
        // thì lúc mở ra likeCount sẽ bị lỗi do lúc đóng HỘP thì debounce mời bắt đầu thực hiện)
        // Debounce càng ít thời gian (ms) thì sẽ càng ít khả năng lỗi nhưng...
        // sẽ gọi API liên tục khi bấm nút like liên tục (ảnh hưởng đến server)
        [],
    );
    // Handle nút thích bình luận
    const handleLikeCommentButton = async () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount((prev) => prev + (newLiked ? 1 : -1));
        // // Call onLikeComment (cập nhật likeCount, likeStatus, isLikedByAuthor của bình luận đó trong commentsData)
        // if (newLiked) {
        //     onLikeComment(commentData, 'like');
        // } else {
        //     onLikeComment(commentData, 'unlike');
        // }
        // Call API (debounce)
        debouncedLikeComment(newLiked);
    };

    return (
        <button
            type="button"
            className={`btnLike ${liked ? 'btnLikeArticleActived' : ''}`}
            id="btnLikeID"
            onClick={handleLikeCommentButton}
        >
            {/* Hiệu ứng */}
            {/* <IoSparklesSharp
                className={`sparkles ${liked ? 'sparklesActived' : ''}`}
                style={{ transform: 'translate(-14px, -7px)' }}
            ></IoSparklesSharp> */}
            {liked ? <IoHeart /> : <IoHeartOutline />} {likesCount}
            {/* Hiệu ứng */}
            {/* <IoSparklesSharp
                className={`sparkles ${liked ? 'sparklesActived' : ''}`}
                style={{ transform: 'translate(5px, 6px)' }}
            ></IoSparklesSharp> */}
        </button>
    );
}

export default LikeCommentButton;

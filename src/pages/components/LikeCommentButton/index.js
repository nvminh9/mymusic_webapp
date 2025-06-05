import { useCallback, useEffect, useState } from 'react';
import { IoHeart, IoHeartOutline, IoSparklesSharp } from 'react-icons/io5';
import { createLikeCommentApi, unLikeCommentApi } from '~/utils/api';
import { debounce } from 'lodash';

// commentData: được truyền khi gọi dùng ở Component Comment
function LikeCommentButton({ commentData }) {
    // State
    const [liked, setLiked] = useState(() => (commentData?.likeStatus ? commentData?.likeStatus : false)); // Xác định người dùng đã thích bình luận hay chưa
    const [likesCount, setLikesCount] = useState(() => (commentData?.likeCount ? commentData?.likeCount : 0)); // Tổng số lượt thích của bình luận
    // const [loading, setLoading] = useState(); // Trạng thái loading, nếu API thích bình luận (Debounce) đang được gọi

    // Context

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
                    const res = await createLikeCommentApi(commentData?.commentId); // Nếu chưa like thì gọi API like
                } else {
                    const res = await unLikeCommentApi(commentData?.commentId); // Nếu like rồi thì gọi API unlike
                }
            } catch (error) {
                console.error('Error updating like status', error);
            }
        }, 500), // Debounce 500ms
        [commentData?.commentId],
    );
    // Handle nút thích bình luận
    const handleLikeCommentButton = async () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount((prev) => prev + (newLiked ? 1 : -1));
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

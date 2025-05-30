import { useCallback, useEffect, useState } from 'react';
import { IoHeart, IoHeartOutline, IoSparklesSharp } from 'react-icons/io5';
import { createLikeArticleApi, unLikeArticleApi } from '~/utils/api';
import { debounce } from 'lodash';

// articleData: được truyền khi gọi dùng ở Component ArticleDetail
function LikeCommentButton({ articleData }) {
    // State
    const [liked, setLiked] = useState(articleData?.likeStatus); // Xác định người dùng đã thích bài viết chưa
    const [likesCount, setLikesCount] = useState(articleData?.likeCount); // Tổng số lượt thích của bài viết
    // const [loading, setLoading] = useState(); // Trạng thái loading, nếu API thích bài viết (Debounce) đang được gọi

    // Context

    // Ref

    // --- HANDLE FUNCTION ---
    // Set likesCount, liked State khi render
    useEffect(() => {
        // set likesCount
        // setLikesCount(articleData?.likeCount);
        // set liked
    });
    // Hàm gọi API thích bài viết (Debounce)
    const debouncedLikeArticle = useCallback(
        debounce(async (newLiked) => {
            try {
                if (newLiked) {
                    const res = await createLikeArticleApi(articleData?.articleId); // Nếu chưa like thì gọi API like
                } else {
                    const res = await unLikeArticleApi(articleData?.articleId); // Nếu like rồi thì gọi API unlike
                }
            } catch (error) {
                console.error('Error updating like status', error);
            }
        }, 500), // Debounce 500ms
        [articleData?.articleId],
    );
    // Handle nút thích bài viết
    const handleLikeArticleButton = async () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount((prev) => prev + (newLiked ? 1 : -1));
        // Call API (debounce)
        debouncedLikeArticle(newLiked);
        // try {
        //     // Nếu liked true thì set liked false và ngược lại
        //     setLiked((prev) => !prev);
        //     // Nếu đã thích trước đó thì khi bấm sẽ -1 likesCount và ngược lại thì +1
        //     setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
        //     // Call API (Debounce)
        // } catch (error) {
        //     // rollback nếu lỗi
        //     setLiked((prev) => !prev);
        //     setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
        //     console.error(error);
        // }
    };

    return (
        <button
            type="button"
            className={`btnLike ${liked ? 'btnLikeArticleActived' : ''}`}
            id="btnLikeID"
            onClick={handleLikeArticleButton}
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

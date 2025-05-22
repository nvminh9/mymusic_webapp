import { useState } from 'react';
import { IoHeartOutline } from 'react-icons/io5';
import { createLikeArticleApi, unLikeArticleApi } from '~/utils/api';

// articleData: được truyền khi gọi dùng ở Component ArticleDetail
function LikeArticleButton({ articleData }) {
    // State
    const [liked, setLiked] = useState(); // Xác định người dùng đã thích bài viết chưa
    const [likesCount, setLikesCount] = useState(articleData?.likeCount); // Tổng số lượt thích của bài viết
    const [loading, setLoading] = useState(false); // Trạng thái loading, nếu API Debounce thích bài viết đang được gọi

    // Context

    // Ref

    // --- HANDLE FUNCTION ---
    const handleLikeArticleButton = async () => {
        // Disable nút like nếu API chưa phản hồi (Chặn Spam)
        if (loading) {
            return;
        }
        setLoading(true);
        //
        try {
            //
            setLiked((prev) => !prev);
            setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

            // Call API
            if (!liked) {
                // Nếu chưa like thì gọi API like
                const res = await createLikeArticleApi(articleData?.articleId);
            } else {
                // Nếu like rồi thì gọi API unlike
                const res = await unLikeArticleApi(articleData?.articleId);
            }
        } catch (error) {
            // rollback nếu lỗi
            setLiked((prev) => !prev);
            setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            className="btnLike"
            id="btnLikeID"
            disabled={loading}
            onClick={handleLikeArticleButton}
            style={{ cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: liked ? 'pink' : 'transparent' }}
        >
            <IoHeartOutline style={{ color: liked ? 'red' : '#dfdfdf' }} /> {likesCount}
        </button>
    );
}

export default LikeArticleButton;

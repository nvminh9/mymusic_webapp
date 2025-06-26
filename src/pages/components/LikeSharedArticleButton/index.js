import { useCallback, useEffect, useState } from 'react';
import { IoHeart, IoHeartOutline, IoSparklesSharp } from 'react-icons/io5';
import {
    createLikeArticleApi,
    createLikeSharedArticleApi,
    unLikeArticleApi,
    unLikeSharedArticleApi,
} from '~/utils/api';
import { debounce } from 'lodash';

// sharedArticleData: được truyền khi gọi dùng ở Component SharedArticleDetail
function LikeSharedArticleButton({ sharedArticleData }) {
    // State
    const [liked, setLiked] = useState(sharedArticleData?.likeStatus); // Xác định người dùng đã thích bài chia sẻ chưa
    const [likesCount, setLikesCount] = useState(sharedArticleData?.likeCount); // Tổng số lượt thích của bài chia sẻ
    // const [loading, setLoading] = useState(); // Trạng thái loading, nếu API thích bài chia sẻ (Debounce) đang được gọi

    // Context

    // Ref

    // --- HANDLE FUNCTION ---
    // Set likesCount, liked State khi render
    useEffect(() => {
        // set likesCount
        // setLikesCount(sharedArticleData?.likeCount);
        // set liked
    });
    // Hàm gọi API thích bài chia sẻ (Debounce)
    const debouncedLikeSharedArticle = useCallback(
        debounce(async (newLiked) => {
            try {
                if (newLiked) {
                    const res = await createLikeSharedArticleApi(sharedArticleData?.sharedArticleId); // Nếu chưa like thì gọi API like
                } else {
                    const res = await unLikeSharedArticleApi(sharedArticleData?.sharedArticleId); // Nếu like rồi thì gọi API unlike
                }
            } catch (error) {
                console.error('Error updating like status', error);
            }
        }, 500), // Debounce 500ms
        [sharedArticleData?.sharedArticleId],
    );
    // Handle nút thích bài chia sẻ
    const handleLikeSharedArticleButton = async () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount((prev) => prev + (newLiked ? 1 : -1));
        // Call API (debounce)
        debouncedLikeSharedArticle(newLiked);
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
            onClick={handleLikeSharedArticleButton}
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

export default LikeSharedArticleButton;

import { useCallback, useEffect, useState } from 'react';
import { IoHeart, IoHeartOutline, IoSparklesSharp } from 'react-icons/io5';
import { createLikeArticleApi, unLikeArticleApi } from '~/utils/api';
import { debounce } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';

// articleData: được truyền khi gọi dùng ở Component ArticleDetail
function LikeArticleButton({ articleData }) {
    // State
    const [liked, setLiked] = useState(articleData?.likeStatus); // Xác định người dùng đã thích bài viết chưa
    const [likesCount, setLikesCount] = useState(articleData?.likeCount); // Tổng số lượt thích của bài viết
    // const [loading, setLoading] = useState(); // Trạng thái loading, nếu API thích bài viết (Debounce) đang được gọi

    // Context

    // Ref

    // React-query (tanstack)
    const queryClient = useQueryClient();

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
                    // Cập nhật cache của feed trong query client (React-query)
                    queryClient.setQueryData(['feed'], (oldData) => {
                        if (!oldData) {
                            return oldData;
                        }
                        // Tìm article và cập nhật tương ứng
                        return {
                            ...oldData,
                            pages: oldData.pages.map((page) => ({
                                ...page,
                                data: page.data.map((feedItem) =>
                                    //
                                    (feedItem.data.sharedArticleId ? null : feedItem.data.articleId) ===
                                    articleData?.articleId
                                        ? {
                                              data: {
                                                  ...feedItem.data,
                                                  likeStatus: true,
                                                  likeCount: feedItem.data.likeCount + 1,
                                              },
                                              type: feedItem.type,
                                          }
                                        : feedItem,
                                ),
                            })),
                        };
                    });
                } else {
                    const res = await unLikeArticleApi(articleData?.articleId); // Nếu like rồi thì gọi API unlike
                    // Cập nhật cache của feed trong query client (React-query)
                    queryClient.setQueryData(['feed'], (oldData) => {
                        if (!oldData) {
                            return oldData;
                        }
                        // Tìm article và cập nhật tương ứng
                        return {
                            ...oldData,
                            pages: oldData.pages.map((page) => ({
                                ...page,
                                data: page.data.map((feedItem) =>
                                    //
                                    (feedItem.data.sharedArticleId ? null : feedItem.data.articleId) ===
                                    articleData?.articleId
                                        ? {
                                              data: {
                                                  ...feedItem.data,
                                                  likeStatus: false,
                                                  likeCount:
                                                      feedItem.data.likeCount === 0
                                                          ? feedItem.data.likeCount
                                                          : feedItem.data.likeCount - 1,
                                              },
                                              type: feedItem.type,
                                          }
                                        : feedItem,
                                ),
                            })),
                        };
                    });
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

export default LikeArticleButton;

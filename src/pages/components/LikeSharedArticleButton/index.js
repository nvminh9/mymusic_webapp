import { useCallback, useEffect, useState } from 'react';
import { IoHeart, IoHeartOutline, IoSparklesSharp } from 'react-icons/io5';
import {
    createLikeArticleApi,
    createLikeSharedArticleApi,
    unLikeArticleApi,
    unLikeSharedArticleApi,
} from '~/utils/api';
import { debounce } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';

// sharedArticleData: được truyền khi gọi dùng ở Component SharedArticleDetail
function LikeSharedArticleButton({ sharedArticleData }) {
    // State
    const [liked, setLiked] = useState(sharedArticleData?.likeStatus); // Xác định người dùng đã thích bài chia sẻ chưa
    const [likesCount, setLikesCount] = useState(sharedArticleData?.likeCount); // Tổng số lượt thích của bài chia sẻ
    // const [loading, setLoading] = useState(); // Trạng thái loading, nếu API thích bài chia sẻ (Debounce) đang được gọi

    // Context

    // Ref

    // React-query (tanstack)
    const queryClient = useQueryClient();

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
                    // Cập nhật cache của feed trong query client (React-query)
                    queryClient.setQueryData(['feed'], (oldData) => {
                        if (!oldData) {
                            return oldData;
                        }
                        // Tìm sharedArticle và cập nhật tương ứng
                        return {
                            ...oldData,
                            pages: oldData.pages.map((page) => ({
                                ...page,
                                data: page.data.map((feedItem) =>
                                    feedItem.data.sharedArticleId === sharedArticleData?.sharedArticleId
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
                    const res = await unLikeSharedArticleApi(sharedArticleData?.sharedArticleId); // Nếu like rồi thì gọi API unlike
                    // Cập nhật cache của feed trong query client (React-query)
                    queryClient.setQueryData(['feed'], (oldData) => {
                        if (!oldData) {
                            return oldData;
                        }
                        // Tìm sharedArticle và cập nhật tương ứng
                        return {
                            ...oldData,
                            pages: oldData.pages.map((page) => ({
                                ...page,
                                data: page.data.map((feedItem) =>
                                    feedItem.data.sharedArticleId === sharedArticleData?.sharedArticleId
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
        [sharedArticleData?.sharedArticleId],
    );
    // Handle nút thích bài chia sẻ
    const handleLikeSharedArticleButton = async () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount((prev) => prev + (newLiked ? 1 : -1));
        // Call API (debounce)
        debouncedLikeSharedArticle(newLiked);
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

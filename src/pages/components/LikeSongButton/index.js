import { useCallback, useEffect, useState } from 'react';
import { IoHeart, IoHeartOutline, IoHeartSharp, IoSparklesSharp } from 'react-icons/io5';
import { createLikeArticleApi, createLikeSongApi, unLikeArticleApi, unLikeSongApi } from '~/utils/api';
import { debounce } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';

// songData: dữ liệu của bài nhạc đang phát
function LikeSongButton({ songData, playlist, setPlaylist }) {
    // State
    const [liked, setLiked] = useState(songData?.likeStatus); // Xác định người dùng đã thích bài nhạc này chưa
    const [likesCount, setLikesCount] = useState(songData?.likeCount); // Tổng số lượt thích của bài nhạc
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
    // Hàm gọi API thích bài nhạc (Debounce)
    const debouncedLikeSong = useCallback(
        debounce(async (newLiked) => {
            try {
                if (newLiked) {
                    const res = await createLikeSongApi(songData?.songId); // Nếu chưa like thì gọi API like
                    // Cập nhật cache của feed trong query client (React-query) (Hiện ở feed chưa có song nên chưa cập nhật)
                    // queryClient.setQueryData(['feed'], (oldData) => {
                    //     if (!oldData) {
                    //         return oldData;
                    //     }
                    //     // Tìm song và cập nhật tương ứng
                    //     return {
                    //         ...oldData,
                    //         pages: oldData.pages.map((page) => ({
                    //             ...page,
                    //             data: page.data.map((feedItem) =>
                    //                 //
                    //                 (feedItem.data.sharedArticleId ? null : feedItem.data.articleId) ===
                    //                 articleData?.articleId
                    //                     ? {
                    //                           data: {
                    //                               ...feedItem.data,
                    //                               likeStatus: true,
                    //                               likeCount: feedItem.data.likeCount + 1,
                    //                           },
                    //                           type: feedItem.type,
                    //                       }
                    //                     : feedItem,
                    //             ),
                    //         })),
                    //     };
                    // });
                    // Cập nhật like status của Song trong playlist
                    setPlaylist((prev) => {
                        const newPlaylist = []; // array object song
                        prev.forEach((item) => {
                            if (item?.songId !== songData?.songId) {
                                newPlaylist.push(item);
                            } else {
                                const itemTemp = item;
                                itemTemp.likeStatus = true;
                                itemTemp.likeCount = item.likeCount + 1;
                                // itemTemp.likes = ...
                                newPlaylist.push(itemTemp);
                            }
                        });
                        return newPlaylist;
                    });
                    // Cập nhật trong like của bài này trong local storage
                    // Local Storage (Bài cuối nghe trước khi thoát)
                    const currentSong = songData;
                    currentSong.likeStatus = true;
                    currentSong.likeCount = currentSong.likeCount + 1;
                    // currentSong.likes = ...
                    localStorage.setItem('pl', JSON.stringify([{ ...currentSong }]));
                } else {
                    const res = await unLikeSongApi(songData?.songId); // Nếu like rồi thì gọi API unlike
                    // Cập nhật cache của feed trong query client (React-query) (Hiện ở feed chưa có song nên chưa cập nhật)
                    // queryClient.setQueryData(['feed'], (oldData) => {
                    //     if (!oldData) {
                    //         return oldData;
                    //     }
                    //     // Tìm article và cập nhật tương ứng
                    //     return {
                    //         ...oldData,
                    //         pages: oldData.pages.map((page) => ({
                    //             ...page,
                    //             data: page.data.map((feedItem) =>
                    //                 //
                    //                 (feedItem.data.sharedArticleId ? null : feedItem.data.articleId) ===
                    //                 articleData?.articleId
                    //                     ? {
                    //                           data: {
                    //                               ...feedItem.data,
                    //                               likeStatus: false,
                    //                               likeCount:
                    //                                   feedItem.data.likeCount === 0
                    //                                       ? feedItem.data.likeCount
                    //                                       : feedItem.data.likeCount - 1,
                    //                           },
                    //                           type: feedItem.type,
                    //                       }
                    //                     : feedItem,
                    //             ),
                    //         })),
                    //     };
                    // });
                    // Cập nhật like status của Song trong playlist
                    setPlaylist((prev) => {
                        const newPlaylist = []; // array object song
                        prev.forEach((item) => {
                            if (item?.songId !== songData?.songId) {
                                newPlaylist.push(item);
                            } else {
                                const itemTemp = item;
                                itemTemp.likeStatus = false;
                                itemTemp.likeCount = item.likeCount > 0 ? item.likeCount - 1 : item.likeCount;
                                // itemTemp.likes = ...
                                newPlaylist.push(itemTemp);
                            }
                        });
                        return newPlaylist;
                    });
                    // Cập nhật trong like của bài này trong local storage
                    // Local Storage (Bài cuối nghe trước khi thoát)
                    const currentSong = songData;
                    currentSong.likeStatus = false;
                    currentSong.likeCount =
                        currentSong.likeCount > 0 ? currentSong.likeCount - 1 : currentSong.likeCount;
                    // currentSong.likes = ...
                    localStorage.setItem('pl', JSON.stringify([{ ...currentSong }]));
                }
            } catch (error) {
                console.error('Error updating like status', error);
            }
        }, 500), // Debounce 500ms
        [songData?.songId],
    );
    // Handle nút thích bài nhạc
    const handleLikeSongButton = async () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount((prev) => prev + (newLiked ? 1 : -1));
        // Call API (debounce)
        debouncedLikeSong(newLiked);
    };

    return (
        <>
            <div className="btnLikeSongContainer">
                <button
                    className={`btnLikeSong ${!playlist?.length || playlist?.length < 1 ? 'btnDisabled' : ''}`}
                    disabled={!playlist?.length || playlist?.length < 1 ? true : false}
                    onClick={() => {
                        handleLikeSongButton();
                    }}
                >
                    {/* <IoSparklesSharp
                        className={`sparkles ${liked ? 'sparklesActived' : ''}`}
                        style={{ transform: 'translate(-11px, -7px)' }}
                    /> */}
                    {liked ? (
                        <>
                            <IoHeartSharp style={{ color: '#d63031' }} />
                            {/* {likesCount} */}
                        </>
                    ) : (
                        <>
                            <IoHeartOutline />
                            {/* {likesCount} */}
                        </>
                    )}
                    {/* <IoSparklesSharp
                        className={`sparkles ${liked ? 'sparklesActived' : ''}`}
                        style={{ transform: 'translate(8px, 6px)' }}
                    /> */}
                </button>
            </div>
        </>
    );
}

export default LikeSongButton;

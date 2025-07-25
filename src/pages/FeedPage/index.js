import feedsData from '~/database/feeds.json';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import Article from '../components/Article';
import { getFeedDataApi } from '~/utils/api';
import FeedItem from '../components/FeedItem';
import { IoSyncSharp } from 'react-icons/io5';

// Hàm lấy dữ liệu cho trang Feed
const fetchFeed = async ({ pageParam = new Date().toISOString() }) => {
    try {
        // Call API Get Feed Data
        // limit 5
        const res = await getFeedDataApi(pageParam, 5);
        // Kiểm tra
        // if (!res.ok) throw new Error('Failed to fetch feed');
        return res;
    } catch (error) {
        console.log(error);
    }
};

function FeedPage() {
    // State

    // Context

    // Ref
    const loadMoreRef = useRef();

    // React-query (Tanstack)
    // useQueryClient
    const queryClient = useQueryClient();
    // console.log(queryClient.getQueryData(['feed']));
    // useInfiniteQuery
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } = useInfiniteQuery({
        queryKey: ['feed'],
        queryFn: fetchFeed,
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    });
    const allItems = data?.pages.flatMap((page) => page.data) || [];
    // console.log(data);
    // console.log(allItems);

    // --- HANDLE FUNCTION ---
    // Intersection Observer (để auto load thêm)
    useEffect(() => {
        // Đổi title trang
        document.title = 'Home | mymusic: Music from everyone';
        //
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                fetchNextPage();
            }
        });
        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => {
            if (loadMoreRef.current) observer.disconnect();
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    // Return
    // Nếu là lần tải dữ liệu đầu tiên
    if (status === 'pending')
        return (
            <>
                {/* Skeleton Article */}
                <div className="articleSkeleton">
                    {/* Nội dung bài viết */}
                    <div className="article">
                        <div className="left">
                            {/* Avatar */}
                            <div className="userAvatar"></div>
                        </div>
                        <div className="right">
                            <div className="top">
                                <div className="articleInfo">
                                    {/* User Name */}
                                    <span className="userName"></span>
                                    {/* Created At */}
                                    <span className="createdAt tooltip"></span>
                                </div>
                            </div>
                            <div className="middle">
                                <div className="content">
                                    <div className="text"></div>
                                    <div className="media">
                                        {/* Carousel Media */}
                                        <div className="carouselMedia">
                                            <div className="mediaContainer"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom">
                                {/* Các nút tương tác */}
                                <div className="interactiveButtonBox"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Skeleton Article */}
                <div className="articleSkeleton">
                    {/* Nội dung bài viết */}
                    <div className="article">
                        <div className="left">
                            {/* Avatar */}
                            <div className="userAvatar"></div>
                        </div>
                        <div className="right">
                            <div className="top">
                                <div className="articleInfo">
                                    {/* User Name */}
                                    <span className="userName"></span>
                                    {/* Created At */}
                                    <span className="createdAt tooltip"></span>
                                </div>
                            </div>
                            <div className="middle">
                                <div className="content">
                                    <div className="text"></div>
                                    <div className="media">
                                        {/* Carousel Media */}
                                        <div className="carouselMedia">
                                            <div className="mediaContainer"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom">
                                {/* Các nút tương tác */}
                                <div className="interactiveButtonBox"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Skeleton Article */}
                <div className="articleSkeleton">
                    {/* Nội dung bài viết */}
                    <div className="article">
                        <div className="left">
                            {/* Avatar */}
                            <div className="userAvatar"></div>
                        </div>
                        <div className="right">
                            <div className="top">
                                <div className="articleInfo">
                                    {/* User Name */}
                                    <span className="userName"></span>
                                    {/* Created At */}
                                    <span className="createdAt tooltip"></span>
                                </div>
                            </div>
                            <div className="middle">
                                <div className="content">
                                    <div className="text"></div>
                                    <div className="media">
                                        {/* Carousel Media */}
                                        <div className="carouselMedia">
                                            <div className="mediaContainer"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom">
                                {/* Các nút tương tác */}
                                <div className="interactiveButtonBox"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    // Nếu tải dữ liệu bị lỗi
    if (status === 'error')
        return (
            <p style={{ display: 'block', color: 'white', width: '100%', height: '200px', textAlign: 'center' }}>
                Lỗi: {error.message}
            </p>
        );
    // Tải dữ liệu thành công
    return (
        <>
            <div className="feedPage">
                {/* Render Feed Item */}
                {allItems.map((item, index) => (
                    <FeedItem key={`${item.type}-${item.data.articleId || item.data.sharedArticleId}`} item={item} />
                ))}
                {/* Load More */}
                <div ref={loadMoreRef} style={{ color: 'white' }}>
                    {isFetchingNextPage ? (
                        <>
                            {/* Đang tải thêm */}
                            {/* Skeleton Article */}
                            <div className="articleSkeleton">
                                {/* Nội dung bài viết */}
                                <div className="article">
                                    <div className="left">
                                        {/* Avatar */}
                                        <div className="userAvatar"></div>
                                    </div>
                                    <div className="right">
                                        <div className="top">
                                            <div className="articleInfo">
                                                {/* User Name */}
                                                <span className="userName"></span>
                                                {/* Created At */}
                                                <span className="createdAt tooltip"></span>
                                            </div>
                                        </div>
                                        <div className="middle">
                                            <div className="content">
                                                <div className="text"></div>
                                                <div className="media">
                                                    {/* Carousel Media */}
                                                    <div className="carouselMedia">
                                                        <div className="mediaContainer"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bottom">
                                            {/* Các nút tương tác */}
                                            <div className="interactiveButtonBox"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : hasNextPage ? (
                        <>
                            {/* Cuộn để xem thêm */}
                            <div style={{ padding: '8px', color: '#000' }}>
                                <div style={{ width: 'max-content', margin: '0 auto' }}>
                                    <div
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <IoSyncSharp className="loadingAnimation" style={{ color: 'white' }} />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Hết dữ liệu */}
                            <div style={{ padding: '8px', color: '#000' }}>
                                <div style={{ width: 'max-content', margin: '0 auto' }}>
                                    <h1 style={{ margin: '0px' }}>
                                        <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>Out of</span>{' '}
                                        mymusic
                                    </h1>
                                    <h1 style={{ margin: '0px' }}>
                                        Hello <span style={{ background: '#1f1f1f', color: 'whitesmoke' }}>data</span>!
                                    </h1>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default FeedPage;

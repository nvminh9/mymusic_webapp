import feedsData from '~/database/feeds.json';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import Article from '../components/Article';
import { getFeedDataApi } from '~/utils/api';
import FeedItem from '../components/FeedItem';

const fetchFeed = async ({ pageParam = new Date().toISOString() }) => {
    try {
        // Call API Get Feed Data
        // limit 5
        const res = await getFeedDataApi(pageParam, 5);
        // Kiểm tra
        // if (!res.ok) throw new Error('Failed to fetch feed');
        //
        return res;
    } catch (error) {
        console.log(error);
    }
};

function FeedPage() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } = useInfiniteQuery({
        queryKey: ['feed'],
        queryFn: fetchFeed,
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    });

    const allItems = data?.pages.flatMap((page) => page.data) || [];

    console.log(allItems);

    // Intersection Observer (để auto load thêm)
    const loadMoreRef = useRef();

    useEffect(() => {
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

    if (status === 'pending') return <p>Đang tải...</p>;
    if (status === 'error') return <p>Lỗi: {error.message}</p>;

    // useEffect(() => {
    //     document.title = 'Home | mymusic: Music from everyone';
    // }, []);

    return (
        <>
            <div className="feedPage">
                {/* {feedsData.feeds.length > 0 ? (
                    feedsData.feeds.map((feed, index) => {
                        return (
                            <div className="articleContainer" key={index}>
                                <Article feed={feed}></Article>
                            </div>
                        );
                    })
                ) : (
                    <>
                        <h1 style={{ color: '#ffffff', margin: '0' }}>Loading...</h1>
                    </>
                )} */}

                {allItems.map((item, index) => (
                    <FeedItem key={`${item.type}-${item.data.articleId || item.data.sharedArticleId}`} item={item} />
                ))}

                <div ref={loadMoreRef} style={{ color: 'white' }}>
                    {isFetchingNextPage ? 'Đang tải thêm...' : hasNextPage ? 'Cuộn xuống để tải thêm' : 'Hết dữ liệu'}
                </div>
            </div>
        </>
    );
}

export default FeedPage;

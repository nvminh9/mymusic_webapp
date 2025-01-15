import feedsData from '~/database/feeds.json';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Import Component
import Article from '../components/Article';
// hết Import Component

function FeedPage() {
    // useEffect(() => {}, []);

    // check feedsData
    console.log(feedsData);

    // Đổi title trang
    useEffect(() => {
        document.title = 'Home | mymusic: Music from everyone';
    }, []);

    return (
        <>
            <div className="feedPage">
                {feedsData.feeds.length > 0 ? (
                    feedsData.feeds.map((feed, index) => {
                        return (
                            <div className="articleContainer" key={index}>
                                {/* <Link to={`/article/DE0KIYdSAL8`}>
                                    <Article feed={feed}></Article>
                                </Link> */}
                                <Article feed={feed}></Article>
                            </div>
                        );
                    })
                ) : (
                    <>
                        <h1 style={{ color: '#ffffff', margin: '0' }}>Loading...</h1>
                    </>
                )}
            </div>
        </>
    );
}

export default FeedPage;

import { useLocation, useNavigate } from 'react-router-dom';
import Article from '../Article';
import SharedArticle from '../SharedArticle';
import Playlist from '../Playlist';

function FeedItem({ item }) {
    // State

    // Context

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // Ref

    const { type, data } = item;

    // console.log(item);

    // Return

    // Nếu type là Article
    if (type === 'article') {
        return (
            <div
                className="feedItemArticle"
                // onClick={() => {
                //     navigate(`/article/${data?.articleId}`);
                // }}
            >
                {data && <Article articleData={data}></Article>}
            </div>
        );
    }

    // Nếu type là Shared Article
    if (type === 'sharedArticle') {
        return (
            <div
                className="feedItemSharedArticle"
                // onClick={() => {
                //     navigate(`/article/${data?.articleId}`);
                // }}
            >
                {data && <SharedArticle sharedArticleData={data}></SharedArticle>}
            </div>
        );
    }

    // Nếu type là Playlist
    if (type === 'playlist') {
        return <div className="feedItemPlaylist">{data && <Playlist data={data} type={'atFeedPage'} />}</div>;
    }

    return null;
}

export default FeedItem;

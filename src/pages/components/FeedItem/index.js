import Article from '../Article';

function FeedItem({ item }) {
    // State

    // Context

    // Ref

    const { type, data } = item;

    // Return
    // Nếu type là Article
    if (type === 'article') {
        return <>{data && <Article articleData={data}></Article>}</>;
    }
    // Nếu type là Shared Article
    if (type === 'sharedArticle') {
        return (
            <h4
                style={{
                    margin: '0',
                    width: '100%',
                    color: 'white',
                    borderBottom: '.5px solid #1f1f1f',
                }}
            >
                {type}
                {data?.sharedArticleId}
                {data?.sharedTextContent}
            </h4>
        );
    }
    return null;
}

export default FeedItem;

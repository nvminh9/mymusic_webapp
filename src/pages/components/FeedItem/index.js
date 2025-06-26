function FeedItem({ item }) {
    const { type, data } = item;
    //
    if (type === 'article') {
        return (
            <h4
                style={{
                    display: 'block',
                    width: '100%',
                    height: '300px',
                    color: 'white',
                    border: '.5px solid #1f1f1f',
                }}
            >
                {type}
                {data?.articleId}
                {data?.textContent}
            </h4>
        );
    }

    if (type === 'sharedArticle') {
        return (
            <h4
                style={{
                    display: 'block',
                    width: '100%',
                    height: '300px',
                    color: 'white',
                    border: '.5px solid #1f1f1f',
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

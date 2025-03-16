import { IoHeartSharp, IoChatbubbleSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

function ArticleProfile({ article }) {
    return (
        <>
            {/* Article */}
            <Link to={`/article/${article.articleId}`} className="col l-4 m-4 c-4">
                <div className="thumbnail">
                    <img src={article?.Photos?.[0]?.photoLink} alt="thumbnail" />
                    {/* Phần hiển thị khi hover vào thumbnail */}
                    <div className="thumbnailHover">
                        {/* Lượt thích */}
                        <IoHeartSharp></IoHeartSharp> <span className="likes">{article?.LikeArticles?.length}</span>
                        {/* Lượt bình luận */}
                        <IoChatbubbleSharp></IoChatbubbleSharp>{' '}
                        <span className="comments">{article?.Comments?.length}</span>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default ArticleProfile;

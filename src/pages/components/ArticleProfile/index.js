import { IoHeartSharp, IoChatbubbleSharp, IoDocumentTextSharp, IoReader, IoImages, IoFilm } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';

function ArticleProfile({ article, user }) {
    // State

    // Context

    // -- HANDLE FUNCTIONS --
    const timeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const seconds = Math.floor((now - past) / 1000);
        const intervals = [
            { label: 'năm', seconds: 31536000 },
            { label: 'tháng', seconds: 2592000 },
            { label: 'tuần', seconds: 604800 },
            { label: 'ngày', seconds: 86400 },
            { label: 'giờ', seconds: 3600 },
            { label: 'phút', seconds: 60 },
            { label: 'giây', seconds: 1 },
        ];
        for (let i = 0; i < intervals.length; i++) {
            const interval = Math.floor(seconds / intervals[i].seconds);
            if (interval >= 1) {
                return `${interval} ${intervals[i].label} trước`;
            }
        }
        return 'vừa xong';
    };

    return (
        <>
            {/* Article */}
            <Link to={`/article/${article.articleId}`} className="col l-4 m-4 c-4">
                <div className="thumbnail">
                    {article?.mediaContent.length > 0 ? (
                        <>
                            {article?.mediaContent?.[0]?.type === 'photo' ? (
                                <>
                                    <IoImages
                                        style={{
                                            position: 'absolute',
                                            right: '6',
                                            top: '6',
                                            color: 'white',
                                            fontSize: '18px',
                                        }}
                                    />
                                    {/* Hình thumbnail */}
                                    <img
                                        src={process.env.REACT_APP_BACKEND_URL + article?.mediaContent?.[0]?.photoLink}
                                        alt="thumbnail"
                                    />
                                </>
                            ) : (
                                <>
                                    <IoFilm
                                        style={{
                                            position: 'absolute',
                                            right: '6',
                                            top: '6',
                                            color: 'white',
                                            fontSize: '18px',
                                        }}
                                    />
                                    {/* Video Thumbnail */}
                                    <video
                                        src={process.env.REACT_APP_BACKEND_URL + article?.mediaContent?.[0]?.videoLink}
                                        muted
                                        loop
                                        onMouseOver={(e) => {
                                            e.target.play();
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.pause();
                                        }}
                                        alt="thumbnail"
                                    />
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <IoReader
                                style={{
                                    position: 'absolute',
                                    right: '6',
                                    top: '6',
                                    color: 'white',
                                    fontSize: '18px',
                                }}
                            />
                            <div
                                className=""
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    backgroundColor: '#1f1f1f',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    padding: '6px',
                                }}
                            >
                                <div className="" style={{ display: 'flex', alignItems: 'center' }}>
                                    {/* Avatar */}
                                    <img
                                        src={
                                            user?.userAvatar
                                                ? process.env.REACT_APP_BACKEND_URL + user?.userAvatar
                                                : defaultAvatar
                                        }
                                        style={{
                                            height: '17%',
                                            width: '17%',
                                            // borderRadius: '50%',
                                            // objectFit: 'cover',
                                            // objectPosition: 'center',
                                        }}
                                    />
                                    <div className="" style={{ marginLeft: '8px' }}>
                                        {/* User Name */}
                                        <span
                                            className="userName"
                                            style={{
                                                color: 'white',
                                                fontWeight: '600',
                                                fontFamily: 'sans-serif',
                                                fontSize: '16px',
                                            }}
                                        >
                                            {user?.userName}
                                        </span>
                                        <br />
                                        <span
                                            className="createdAt"
                                            style={{
                                                color: 'dimgrey',
                                                fontWeight: '400',
                                                fontFamily: 'sans-serif',
                                                fontSize: '13px',
                                            }}
                                        >
                                            {timeAgo(article?.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                {/* Text Content */}
                                <span className="textContent">{article?.textContent}</span>
                            </div>
                        </>
                    )}

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

import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { IoHeartSharp, IoChatbubbleSharp } from 'react-icons/io5';

function ListArticle() {
    // chuyển path
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="listArticle">
            {/* List Articles */}
            <div className="row">
                <Link to={`/article/DE0KIYdSAL8`} className="col l-4 m-4 c-4">
                    <div className="thumbnail">
                        <img
                            src={`https://i.pinimg.com/736x/bb/d3/bc/bbd3bc3fc939bc50cf8f3bc018aa0dd7.jpg`}
                            alt="thumbnail"
                        />
                        {/* Phần hiển thị khi hover vào thumbnail */}
                        <div className="thumbnailHover">
                            {/* Lượt thích */}
                            <IoHeartSharp></IoHeartSharp> <span className="likes">21,6 N</span>
                            {/* Lượt bình luận */}
                            <IoChatbubbleSharp></IoChatbubbleSharp> <span className="comments">189</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default ListArticle;

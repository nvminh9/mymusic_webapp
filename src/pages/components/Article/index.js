import { VscEllipsis } from 'react-icons/vsc';
// Import Component
// Hết Import Component

function Article() {
    return (
        <div className="article">
            <div className="left">
                {/* Avatar */}
                <div className="userAvatar">
                    <img src="https://preview.redd.it/my-take-on-the-i-am-music-album-cover-v0-w6ctf6ny0olc1.jpeg?width=1080&crop=smart&auto=webp&s=d27077d4209d76ebba96e1355845dcf7d8a73644" />
                </div>
            </div>
            <div className="right">
                <div className="top">
                    <div className="articleInfo">
                        <span className="userName">I AM MUSIC</span>
                        <span className="createdAt">1 ngày</span>
                    </div>
                    <div className="articleOptions">
                        <button className="btnArticleOptions">
                            <VscEllipsis></VscEllipsis>
                        </button>
                    </div>
                </div>
                <div className="middle"></div>
                <div className="bottom"></div>
            </div>
        </div>
    );
}

export default Article;

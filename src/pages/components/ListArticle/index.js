import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoBowlingBallOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { getUserArticlesApi } from '~/utils/api';
import ArticleProfile from '../ArticleProfile';

function ListArticle() {
    // State (useState)
    const [listArticleData, setListArticleData] = useState();

    // Context (useContext)

    // chuyển path
    const location = useLocation();
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---
    // Handle Call API
    useEffect(() => {
        const userName = location.pathname.split('/')[2];
        // Call API Lấy danh sách bài viết
        const getUserArticles = async (userName) => {
            try {
                const res = await getUserArticlesApi(userName);
                if (res.data !== null) {
                    // setTimeout(() => {
                    //     setListArticleData(res?.data?.articles?.rows);
                    // }, 3000);
                    setListArticleData(res?.data?.articles?.rows);
                } else {
                    setListArticleData([]);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getUserArticles(userName);
    }, [location.pathname.split('/')[2]]);

    return (
        <div className="listArticle">
            {/* List Articles */}
            <div className="row">
                {listArticleData?.length === 0 ? (
                    <>
                        <h1 style={{ color: 'white' }}>Chưa có bài viết</h1>
                    </>
                ) : (
                    <>
                        {listArticleData ? (
                            <>
                                {listArticleData.map((article, index) => (
                                    <>
                                        {/* Article */}
                                        <ArticleProfile key={index} article={article} />
                                    </>
                                ))}
                            </>
                        ) : (
                            <>
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: '50px',
                                    }}
                                >
                                    <IoBowlingBallOutline className="loadingAnimation" />
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ListArticle;

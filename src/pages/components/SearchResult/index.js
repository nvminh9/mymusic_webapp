import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Article from '../Article';
import ArticleProfile from '../ArticleProfile';
import { getSearchResultDataApi } from '~/utils/api';
import { AuthContext } from '~/context/auth.context';
import MusicCard from '../MusicCard';
import UserCard from '../UserCard';
import { IoSyncSharp } from 'react-icons/io5';

function SearchResult({}) {
    // State
    const [resultTab, setResultTab] = useState(0);
    const [searchResultData, setSearchResultData] = useState();

    // Context
    const { auth } = useContext(AuthContext);

    // Ref

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        //
        setResultTab(0);
        // Get Search Result Data
        const getSearchResultData = async () => {
            try {
                const query = searchParams.get('q');
                // Call API Get Search Result
                const res = await getSearchResultDataApi(query, `article,song,user`, 12, auth?.user?.userId);
                //
                if (res?.status === 200 && res?.message === 'Kết quả tìm kiếm') {
                    // Set Search Result Data
                    setSearchResultData(res?.data);
                } else {
                    console.log('API Search Result Error');
                }
            } catch (error) {
                console.log('Search Result Error:', error);
                return;
            }
        };
        getSearchResultData();
    }, [searchParams.get('q')]);

    return (
        <>
            <div className="searchResult">
                {/* Tab Navigation Bar */}
                <div className="navigationBar">
                    <button
                        className="btnTabAll"
                        style={{
                            backgroundColor: resultTab === 0 ? '#dfdfdf' : '',
                            color: resultTab === 0 ? '#000' : '',
                        }}
                        onClick={() => {
                            setResultTab(0);
                        }}
                    >
                        Tất cả
                    </button>
                    <button
                        className="btnTabUser"
                        style={{
                            backgroundColor: resultTab === 1 ? '#dfdfdf' : '',
                            color: resultTab === 1 ? '#000' : '',
                        }}
                        onClick={() => {
                            setResultTab(1);
                        }}
                    >
                        Người dùng
                    </button>
                    <button
                        className="btnTabArticle"
                        style={{
                            backgroundColor: resultTab === 2 ? '#dfdfdf' : '',
                            color: resultTab === 2 ? '#000' : '',
                        }}
                        onClick={() => {
                            setResultTab(2);
                        }}
                    >
                        Bài viết
                    </button>
                    <button
                        className="btnTabSong"
                        style={{
                            backgroundColor: resultTab === 3 ? '#dfdfdf' : '',
                            color: resultTab === 3 ? '#000' : '',
                        }}
                        onClick={() => {
                            setResultTab(3);
                        }}
                    >
                        Nhạc
                    </button>
                </div>
                {/* Result */}
                <div className="resultContent">
                    <div className="row">
                        {/* Render Item */}
                        {searchResultData && (
                            <>
                                {/* Tab All */}
                                {resultTab === 0 &&
                                    searchResultData?.results?.map((item) => (
                                        <>
                                            {/* Article */}
                                            {item?.articleId && (
                                                <ArticleProfile
                                                    key={item?.articleId}
                                                    article={item}
                                                    type={'mediumArticleProfileCard'}
                                                />
                                            )}
                                            {/* Song */}
                                            {item?.songId && (
                                                <MusicCard songData={item} typeMusicCard={'SearchResult'} />
                                            )}
                                            {/* User */}
                                            {item?.userName && <UserCard userData={item} type={'atSearchResult'} />}
                                            {/* ... */}
                                        </>
                                    ))}
                                {/* Tab User */}
                                {resultTab === 1 &&
                                    searchResultData?.results?.map((item) => (
                                        <>
                                            {/* User */}
                                            {item?.userName && <UserCard userData={item} type={'atSearchResult'} />}
                                        </>
                                    ))}
                                {/* Tab Article */}
                                {resultTab === 2 &&
                                    searchResultData?.results?.map((item) => (
                                        <>
                                            {/* Article */}
                                            {item?.articleId && (
                                                <ArticleProfile
                                                    key={item?.articleId}
                                                    article={item}
                                                    type={'mediumArticleProfileCard'}
                                                />
                                            )}
                                        </>
                                    ))}
                                {/* Tab Song */}
                                {resultTab === 3 &&
                                    searchResultData?.results?.map((item) => (
                                        <>
                                            {/* Song */}
                                            {item?.songId && (
                                                <MusicCard songData={item} typeMusicCard={'SearchResult'} />
                                            )}
                                        </>
                                    ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchResult;

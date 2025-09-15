import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Article from '../Article';
import ArticleProfile from '../ArticleProfile';
import { getSearchResultDataApi } from '~/utils/api';
import { AuthContext } from '~/context/auth.context';
import MusicCard from '../MusicCard';
import UserCard from '../UserCard';
import { IoSyncSharp } from 'react-icons/io5';
import PlaylistCard from '../PlaylistCard';

function SearchResult({}) {
    // State
    // const [resultTab, setResultTab] = useState(0);
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
        // Get Search Result Data
        const getSearchResultData = async () => {
            try {
                const query = searchParams.get('q');
                const queryTypes = searchParams.get('types');
                // Call API Get Search Result
                const res = await getSearchResultDataApi(query, queryTypes, 12, auth?.user?.userId);
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
    }, [searchParams.get('q'), searchParams.get('types')]);

    return (
        <>
            <div className="searchResult">
                {/* Tab Navigation Bar */}
                <div className="navigationBar">
                    <button
                        className="btnTabAll"
                        style={{
                            backgroundColor:
                                searchParams.get('types') === 'article,song,playlist,user' ? '#dfdfdf' : '',
                            color: searchParams.get('types') === 'article,song,playlist,user' ? '#000' : '',
                        }}
                        onClick={() => {
                            // Set Search Params
                            if (searchParams.get('types') !== 'article,song,playlist,user') {
                                setSearchParams((prev) => ({
                                    ...prev,
                                    q: prev.get('q'),
                                    types: 'article,song,playlist,user',
                                }));
                            }
                        }}
                    >
                        Tất cả
                    </button>
                    <button
                        className="btnTabUser"
                        style={{
                            backgroundColor: searchParams.get('types') === 'user' ? '#dfdfdf' : '',
                            color: searchParams.get('types') === 'user' ? '#000' : '',
                        }}
                        onClick={() => {
                            // Set Search Params
                            if (searchParams.get('types') !== 'user') {
                                setSearchParams((prev) => ({
                                    ...prev,
                                    q: prev.get('q'),
                                    types: 'user',
                                }));
                            }
                        }}
                    >
                        Người dùng
                    </button>
                    <button
                        className="btnTabArticle"
                        style={{
                            backgroundColor: searchParams.get('types') === 'article' ? '#dfdfdf' : '',
                            color: searchParams.get('types') === 'article' ? '#000' : '',
                        }}
                        onClick={() => {
                            // Set Search Params
                            if (searchParams.get('types') !== 'article') {
                                setSearchParams((prev) => ({
                                    ...prev,
                                    q: prev.get('q'),
                                    types: 'article',
                                }));
                            }
                        }}
                    >
                        Bài viết
                    </button>
                    <button
                        className="btnTabSong"
                        style={{
                            backgroundColor: searchParams.get('types') === 'song' ? '#dfdfdf' : '',
                            color: searchParams.get('types') === 'song' ? '#000' : '',
                        }}
                        onClick={() => {
                            // Set Search Params
                            if (searchParams.get('types') !== 'song') {
                                setSearchParams((prev) => ({
                                    ...prev,
                                    q: prev.get('q'),
                                    types: 'song',
                                }));
                            }
                        }}
                    >
                        Nhạc
                    </button>
                    <button
                        className="btnTabSong"
                        style={{
                            backgroundColor: searchParams.get('types') === 'playlist' ? '#dfdfdf' : '',
                            color: searchParams.get('types') === 'playlist' ? '#000' : '',
                        }}
                        onClick={() => {
                            // Set Search Params
                            if (searchParams.get('types') !== 'playlist') {
                                setSearchParams((prev) => ({
                                    ...prev,
                                    q: prev.get('q'),
                                    types: 'playlist',
                                }));
                            }
                        }}
                    >
                        Danh sách phát
                    </button>
                </div>
                {/* Result */}
                <div className="resultContent">
                    <div className="row">
                        {/* Render Item */}
                        {searchResultData && (
                            <>
                                {/* Tab All */}
                                {/* {resultTab === 0 &&
                                    searchResultData?.results?.map((item) => (
                                        <>                                            
                                            {item?.articleId && (
                                                <ArticleProfile
                                                    key={item?.articleId}
                                                    article={item}
                                                    type={'mediumArticleProfileCard'}
                                                />
                                            )}
                                            {item?.songId && (
                                                <MusicCard songData={item} typeMusicCard={'SearchResult'} />
                                            )}
                                            {item?.userName && <UserCard userData={item} type={'atSearchResult'} />}
                                            {item?.playlistId && (
                                                <PlaylistCard
                                                    key={`searchResult${item?.playlistId}`}
                                                    playlistData={item}
                                                    typePlaylistCard={'SearchResult'}
                                                />
                                            )}
                                        </>
                                    ))} */}
                                {/* Tab User */}
                                {/* {resultTab === 1 &&
                                    searchResultData?.results?.map((item) => (
                                        <>
                                            {item?.userName && <UserCard userData={item} type={'atSearchResult'} />}
                                        </>
                                    ))} */}
                                {/* Tab Article */}
                                {/* {resultTab === 2 &&
                                    searchResultData?.results?.map((item) => (
                                        <>
                                            
                                            {item?.articleId && (
                                                <ArticleProfile
                                                    key={item?.articleId}
                                                    article={item}
                                                    type={'mediumArticleProfileCard'}
                                                />
                                            )}
                                        </>
                                    ))} */}
                                {/* Tab Song */}
                                {/* {resultTab === 3 &&
                                    searchResultData?.results?.map((item) => (
                                        <>
                                            {item?.songId && (
                                                <MusicCard songData={item} typeMusicCard={'SearchResult'} />
                                            )}
                                        </>
                                    ))} */}
                                {/* Tab Playlist */}
                                {/* {resultTab === 4 &&
                                    searchResultData?.results?.map((item) => (
                                        <>
                                            {item?.playlistId && (
                                                <PlaylistCard
                                                    key={`searchResult${item?.playlistId}`}
                                                    playlistData={item}
                                                    typePlaylistCard={'SearchResult'}
                                                />
                                            )}
                                        </>
                                    ))} */}
                            </>
                        )}
                        {searchResultData ? (
                            <>
                                {searchResultData?.results?.map((item) => (
                                    <>
                                        {item?.articleId && (
                                            <ArticleProfile
                                                key={item?.articleId}
                                                article={item}
                                                type={'mediumArticleProfileCard'}
                                            />
                                        )}
                                        {item?.songId && <MusicCard songData={item} typeMusicCard={'SearchResult'} />}
                                        {item?.userName && <UserCard userData={item} type={'atSearchResult'} />}
                                        {item?.playlistId && (
                                            <PlaylistCard
                                                key={`searchResult${item?.playlistId}`}
                                                playlistData={item}
                                                typePlaylistCard={'SearchResult'}
                                            />
                                        )}
                                    </>
                                ))}
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchResult;

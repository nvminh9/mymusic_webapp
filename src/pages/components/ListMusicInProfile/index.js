import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserSongsApi } from '~/utils/api';
import { IoBowlingBallOutline } from 'react-icons/io5';

function ListMusicInProfile() {
    // State (useState)
    const [listMusicData, setListMusicData] = useState();

    // Context (useContext)

    // Navigate (useNavigate)
    const navigate = useNavigate();
    const location = useLocation();

    // --- HANDLE FUNCTION ---
    // Handle Call API lấy danh sách bài nhạc của user
    useEffect(() => {
        // userName của profile
        const userName = location.pathname.split('/')[2];
        // Call API Lấy danh sách bài nhạc
        const getUserSongs = async (userName) => {
            try {
                const res = await getUserSongsApi(userName);
                if (res?.status === 200 && res?.data !== null) {
                    setListMusicData(res?.data?.Songs);
                } else {
                    setListMusicData([]);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getUserSongs(userName);
    }, []);

    return (
        <div className="listMusicInProfile">
            {/* List Musics */}
            <div className="row">
                {listMusicData?.length === 0 ? (
                    <>
                        <span
                            style={{
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '500',
                                textAlign: 'center',
                                display: 'block',
                                width: '100%',
                                padding: '50px 0px',
                            }}
                        >
                            Chưa có bài nhạc
                        </span>
                    </>
                ) : (
                    <>
                        {listMusicData ? (
                            <>
                                {listMusicData.map((song, index) => (
                                    <>
                                        {/* Article */}
                                        {/* <ArticleProfile key={index} article={article} /> */}
                                        <span key={index}>{song.name}</span> <br />
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

export default ListMusicInProfile;

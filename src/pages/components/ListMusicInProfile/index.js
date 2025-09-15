import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserSongsApi } from '~/utils/api';
import { IoBowlingBallOutline, IoSyncSharp } from 'react-icons/io5';
import MusicCard from '../MusicCard';
import PlaylistCard from '../PlaylistCard';

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
        // Call API Lấy danh sách bài nhạc của người dùnga
        const getUserSongs = async (userName) => {
            try {
                const res = await getUserSongsApi(userName);
                if (res?.status === 200 && res?.data !== null) {
                    setListMusicData(res?.data);
                } else {
                    setListMusicData([]);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getUserSongs(userName);
    }, [location.pathname.split('/')[2]]);

    return (
        <div className="listMusicInProfile">
            {/* List Musics */}
            <div className="row">
                {/* Danh sách phát */}
                <div className="musicsContainer">
                    <span className="title">Danh sách phát</span>
                    <div className="musics">
                        {listMusicData ? (
                            <>
                                {listMusicData?.playlists?.length > 0 ? (
                                    <>
                                        {listMusicData?.playlists?.map((playlist, index) => (
                                            <>
                                                <PlaylistCard
                                                    key={`userPlaylist${playlist.playlistId}`}
                                                    playlistData={playlist}
                                                    order={index + 1}
                                                    typePlaylistCard={'atProfileMusics'}
                                                />
                                            </>
                                        ))}
                                    </>
                                ) : (
                                    <span
                                        style={{
                                            color: 'rgba(255, 255, 255, 0.64)',
                                            fontSize: '17px',
                                            fontWeight: '500',
                                            fontFamily: 'sans-serif',
                                            textAlign: 'center',
                                            display: 'block',
                                            width: '100%',
                                            padding: '50px 0px',
                                        }}
                                    >
                                        Chưa có danh sách phát
                                    </span>
                                )}
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
                                    <IoSyncSharp className="loadingAnimation" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {/* Bài nhạc */}
                <div className="musicsContainer">
                    <span className="title">Bài nhạc</span>
                    <div className="musics">
                        {listMusicData ? (
                            <>
                                {listMusicData?.songs?.length > 0 ? (
                                    <>
                                        {listMusicData?.songs?.map((song, index) => (
                                            <>
                                                <MusicCard
                                                    key={`userSong${song.songId}`}
                                                    songData={song}
                                                    order={index + 1}
                                                    typeMusicCard={'Playlist'}
                                                />
                                            </>
                                        ))}
                                    </>
                                ) : (
                                    <span
                                        style={{
                                            color: 'rgba(255, 255, 255, 0.64)',
                                            fontSize: '17px',
                                            fontWeight: '500',
                                            fontFamily: 'sans-serif',
                                            textAlign: 'center',
                                            display: 'block',
                                            width: '100%',
                                            padding: '50px 0px',
                                        }}
                                    >
                                        Chưa có bài nhạc
                                    </span>
                                )}
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
                                    <IoSyncSharp className="loadingAnimation" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListMusicInProfile;

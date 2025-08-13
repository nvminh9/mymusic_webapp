import { useContext, useState } from 'react';
import { CgPlayList } from 'react-icons/cg';
import { IoChevronDownSharp, IoChevronUpSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/auth.context';
import MusicCard from '../MusicCard';

function Playlist({ data, currentIndex, type }) {
    // State
    const [isOpenPlaylist, setIsOpenPlaylist] = useState(false);

    // Context
    const { auth } = useContext(AuthContext);

    // Ref

    // Navigation
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---
    const handleOpenPlaylist = () => {
        setIsOpenPlaylist(!isOpenPlaylist);
        //
        const middleMusicPlayer = document.getElementById('middleMusicPlayerID');
        if (!isOpenPlaylist) {
            const middleMusicPlayerScrollTimeout = setTimeout(() => {
                middleMusicPlayer.scrollTop = 167;
            }, 205);
            return () => {
                clearTimeout(middleMusicPlayerScrollTimeout);
            };
        }
    };

    // Ở Music Player
    if (type === 'musicPlayer') {
        return (
            <div className="playlistContainer">
                <div className="playlist">
                    {/* Title */}
                    <div
                        className="title"
                        onClick={() => {
                            handleOpenPlaylist();
                        }}
                    >
                        <div style={{ marginTop: '4px' }}>
                            <CgPlayList />
                        </div>
                        <div className="playlistInfo">
                            <span className="nextSong">
                                Tiếp theo:{' '}
                                {currentIndex === data?.data?.songs?.length - 1
                                    ? `${data?.data?.songs[0]?.name} (đăng bởi ${data?.data?.songs[0]?.User?.userName})`
                                    : `${data?.data?.songs[currentIndex + 1]?.name} (đăng bởi ${
                                          data?.data?.songs[currentIndex + 1]?.User?.userName
                                      })`}
                            </span>
                            <span className="name">Danh sách phát "{data?.data?.name}"</span>
                        </div>
                        <div>{isOpenPlaylist ? <IoChevronUpSharp /> : <IoChevronDownSharp />}</div>
                    </div>
                    {/* Main */}
                    <div className="main" style={{ height: isOpenPlaylist ? '200px' : '0px' }}>
                        {data?.data?.songs?.map((song, index) => (
                            <MusicCard order={index + 1} songData={song} typeMusicCard={'MusicPlayerPlaylist'} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return <></>;
}

export default Playlist;

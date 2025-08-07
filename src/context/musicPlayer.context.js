// context/musicPlayer.context.js
import { createContext, useContext, useEffect, useState } from 'react';

const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
    // State
    const [playlist, setPlaylist] = useState(
        localStorage?.getItem('pl') && localStorage?.getItem('pl') !== ''
            ? JSON.parse(localStorage?.getItem('pl'))
            : [],
    ); // Array Object Song
    const [currentIndex, setCurrentIndex] = useState(
        localStorage?.getItem('pl') &&
            localStorage?.getItem('pl') !== '' &&
            JSON.parse(localStorage?.getItem('pl'))?.[0]
            ? 0
            : null,
    ); // Index của bài đang nghe (null nếu chưa có bài nào, 0 khi reload lại trang)
    const [isBlocked, setIsBlocked] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeatOne, setIsRepeatOne] = useState(false);
    const [isRepeatAll, setIsRepeatAll] = useState(false);
    const [volume, setVolume] = useState(1); // 1: max volume
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSongMuted, setIsSongMuted] = useState(false);
    const [isAutoNextSong, setIsAutoNextSong] = useState(false); // Auto Next Song
    const [isLikedSong, setIsLikedSong] = useState(false); // Liked Song
    const [isInteracted, setIsInteracted] = useState(false); // isInteracted: true khi người dùng đã tương tác với trang (click vào đâu đó) để tránh autoplay gây lỗi

    // --- HANDLE FUNCTION ---
    useEffect(() => {}, []);

    return (
        <MusicPlayerContext.Provider
            value={{
                playlist,
                setPlaylist,
                currentIndex,
                setCurrentIndex,
                isPlaying,
                setIsPlaying,
                isShuffle,
                setIsShuffle,
                isRepeatOne,
                setIsRepeatOne,
                isRepeatAll,
                setIsRepeatAll,
                volume,
                setVolume,
                currentTime,
                setCurrentTime,
                duration,
                setDuration,
                isSongMuted,
                setIsSongMuted,
                isInteracted,
                setIsInteracted,
                isBlocked,
                setIsBlocked,
                isAutoNextSong,
                setIsAutoNextSong,
                isLikedSong,
                setIsLikedSong,
            }}
        >
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayerContext = () => useContext(MusicPlayerContext);

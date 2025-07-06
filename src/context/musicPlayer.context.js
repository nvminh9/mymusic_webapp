// context/musicPlayer.context.js
import { createContext, useContext, useEffect, useState } from 'react';

const MusicPlayerContext = createContext();

// Key
const key = `true@${new Date()}`;

export const MusicPlayerProvider = ({ children }) => {
    // State
    const [playlist, setPlaylist] = useState(JSON.parse(localStorage?.getItem('pl')) || []); // Array Object Song
    const [currentIndex, setCurrentIndex] = useState(JSON.parse(localStorage?.getItem('pl')) ? 0 : null); // Index của bài đang nghe (null nếu chưa có bài nào)
    const [musicPlayerKey, setMusicPlayerKey] = useState(key); // Key Music Player
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeatOne, setIsRepeatOne] = useState(false);
    const [isRepeatAll, setIsRepeatAll] = useState(false);
    const [volume, setVolume] = useState(1); // 1: max volume
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSongMuted, setIsSongMuted] = useState(false);
    const [isInteracted, setIsInteracted] = useState(false);

    // --- HANDLE FUNCTION ---
    useEffect(() => {
        // Set Music Player Key Local Storage
        const mpKeyLocalStorage = localStorage.getItem('mpKey');
        // Set Music Player Key của tab đầu tiên được mở vào localStorage
        // Nếu mpKeyLocalStorage?.split('@')[0] là false (Music Player ở tab trước đó dừng phát nhạc)...
        // thì tab khác mới lưu key mới được
        // if (!mpKeyLocalStorage?.split('@')[0]) {
        //     localStorage.setItem('mpKey', JSON.stringify(key));
        // }
        // Tạo mpKey nếu mpKey null
        // Xóa mpKey của tab cũ khi bị đóng
        window.onunload = function () {
            localStorage.setItem('mpKey', '');
        };
    }, []);

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
                musicPlayerKey,
                setMusicPlayerKey,
            }}
        >
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayerContext = () => useContext(MusicPlayerContext);

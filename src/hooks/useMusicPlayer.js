// Custome Hook useMusicPlayer.js
import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import noContentImage from '~/assets/images/no_content.jpg';

export function useMusicPlayer(initialPlaylist, isInteracted) {
    // State
    const [playlist, setPlaylist] = useState(initialPlaylist); // Array Object
    const [currentIndex, setCurrentIndex] = useState(0); // Index của bài đang nghe
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeatOne, setIsRepeatOne] = useState(false);
    const [isRepeatAll, setIsRepeatAll] = useState(false);
    const [volume, setVolume] = useState(1); // 1: max volume
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSongMuted, setIsSongMuted] = useState(false);

    // Ref
    const audioRef = useRef(null);
    const hlsRef = useRef(null);

    // Current Song
    const currentSong = playlist[currentIndex];

    // Thumbnails data
    const thumbnails = currentSong?.songVideo
        ? [
              {
                  imageUrl: currentSong?.songImage
                      ? process.env.REACT_APP_BACKEND_URL + currentSong?.songImage
                      : noContentImage,
              },
              {
                  videoUrl: currentSong?.songVideo ? process.env.REACT_APP_BACKEND_URL + currentSong?.songVideo : '',
              },
          ]
        : [
              {
                  imageUrl: currentSong?.songImage
                      ? process.env.REACT_APP_BACKEND_URL + currentSong?.songImage
                      : noContentImage,
              },
          ];

    // --- HANDLE FUNCTION ---
    // Tải và chơi nhạc bằng Hls.js
    useEffect(() => {
        if (!currentSong?.songLink || !audioRef.current) return;
        // Xóa hlsRef cũ
        if (hlsRef.current) {
            hlsRef.current.destroy();
        }
        //
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(process.env.REACT_APP_BACKEND_URL + currentSong.songLink);
            hls.attachMedia(audioRef.current);
            // Auto play
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (isInteracted) {
                    audioRef.current.play();
                    setIsPlaying(true);
                }
            });
            hlsRef.current = hls;
        } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            audioRef.current.src = process.env.REACT_APP_BACKEND_URL + currentSong.songLink;
            // Auto play
            audioRef.current.addEventListener('loadedmetadata', () => {
                if (isInteracted) {
                    audioRef.current.play();
                    setIsPlaying(true);
                }
            });
        }
        //
        return () => {
            if (hlsRef.current) hlsRef.current.destroy();
        };
    }, [currentSong]);
    // Cập nhật thời gian của bài nhạc và metadata
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        //
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        //
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        //
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, []);
    // Handle khi hết bài
    const handleEnded = () => {
        if (isRepeatOne) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else if (currentIndex < playlist.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (isRepeatAll) {
            setCurrentIndex(0);
        } else if (isShuffle) {
            let randomIndex = getRandomIndexFromPlaylist();
            setCurrentIndex(randomIndex);
        } else {
            setIsPlaying(false);
        }
    };
    // Hanlde play/pause song
    const togglePlay = async () => {
        if (!audioRef.current) return;
        //
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            // audioRef.current.play();
            // setIsPlaying(true);
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.error('Autoplay blocked or error playing audio:', error);
            }
        }
    };
    // Handle nút chuyển bài tiếp theo
    const next = () => {
        if (currentIndex < playlist.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (isRepeatAll) {
            setCurrentIndex(0);
        }
    };
    // Handle nút lùi bài trước đó
    const previous = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
        // else if (isRepeatAll) {
        //     setCurrentIndex(playlist.length - 1);
        // }
    };
    // Handle nút tính năng trộn bài
    const getRandomIndexFromPlaylist = () => {
        if (playlist?.length > 1) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * (playlist?.length - 0) + 0);
            } while (randomIndex === currentIndex);
            // Kết quả
            return randomIndex;
        } else {
            return;
        }
    };
    const shuffle = () => {
        if (playlist?.length < 1) {
            return;
        }
        if (!isShuffle) {
            // const shuffled = [...playlist].sort(() => Math.random() - 0.5);
            // setPlaylist(shuffled);
            // setCurrentIndex(0);
            // Random Index
            let randomIndex = getRandomIndexFromPlaylist();
            // Nếu muốn khi bấm trộn thì sẽ ngay lập tức phát bài tiếp theo thì setCurrentIndex với randomIndex
            // setCurrentIndex(randomIndex);
            // Nếu không thì không làm gì chỉ setIsShuffle true
            setIsShuffle(true);
        } else {
            setIsShuffle(false);
        }
    };
    // Hàm thay đổi âm lượng
    const handleVolumeChange = (e) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        audioRef.current.volume = vol;
        if (vol === 0) {
            setIsSongMuted(true);
        } else {
            setIsSongMuted(false);
        }
    };
    // Hàm tắt âm lượng
    const handleBtnVolume = (e) => {
        if (audioRef.current.volume > 0) {
            audioRef.current.volume = 0;
            setIsSongMuted(true);
        } else {
            audioRef.current.volume = volume;
            setIsSongMuted(false);
        }
    };
    // Hàm xử lý việc tua bài nhạc
    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };
    // Hàm format thời gian của bài hát
    const formatTime = (sec) => {
        if (isNaN(sec)) return '00:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    };

    return {
        audioRef,
        currentSong,
        isPlaying,
        togglePlay,
        next,
        previous,
        shuffle,
        isShuffle,
        setIsRepeatOne,
        isRepeatOne,
        setIsRepeatAll,
        isRepeatAll,
        setPlaylist,
        setCurrentIndex,
        handleVolumeChange,
        handleSeek,
        formatTime,
        duration,
        currentTime,
        volume,
        handleEnded,
        handleBtnVolume,
        isSongMuted,
        thumbnails,
    };
}

// Custome Hook useMusicPlayer.js
import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import noContentImage from '~/assets/images/no_content.jpg';
import { useMusicPlayerContext } from '~/context/musicPlayer.context';
import { createListenHistoryApi } from '~/utils/api';

// BroadcastChannel
const channel = new BroadcastChannel('music-player');

export function useMusicPlayer() {
    // State

    // Context
    const {
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
    } = useMusicPlayerContext();

    // Ref
    const audioRef = useRef(null);
    const hlsRef = useRef(null);

    // Current Song
    const currentSong = playlist?.[currentIndex];

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
        let saveListenHistoryTimer; // Timer save listening history
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(process.env.REACT_APP_BACKEND_URL + currentSong.songLink);
            hls.attachMedia(audioRef.current);
            // Auto play
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (isInteracted) {
                    audioRef.current.play();
                    setIsPlaying(true);
                    // Lưu vào lịch sử nghe
                    if (currentSong) {
                        saveListenHistoryTimer = setTimeout(() => {
                            saveListeningHistory(currentSong.songId); // Chỉ gọi nếu nghe > 5s
                        }, 5000); // Chỉ lưu sau 5 giây nghe
                        // return () => clearTimeout(saveListenHistoryTimer); // Hủy nếu đổi bài quá nhanh
                    }
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
            clearTimeout(saveListenHistoryTimer); // Hủy nếu đổi bài quá nhanh
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
    // Cập nhật CSS biến --progress theo thời gian (phần đã phát của bài nhạc)
    useEffect(() => {
        const input = document.querySelector('.progressBar');
        if (input) {
            const progress = (currentTime / duration) * 100 || 0;
            input.style.setProperty('--progress', progress);
        }
        // const input = document.querySelector('.progress-bar');
        // if (input) {
        //     const percentage = (currentTime / duration) * 100 || 0;
        //     input.style.background = `linear-gradient(to right, #ff4d4d 0%, #ff4d4d ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
        // }
    }, [currentTime, duration]);
    // Gửi message cho channel "music-player" khi phát/dừng nhạc
    useEffect(() => {
        if (isPlaying) {
            channel.postMessage({ type: 'PLAY', senderId: window.name });
        }
        if (!isPlaying) {
            channel.postMessage({ type: 'PAUSE', senderId: window.name });
        }
    }, [isPlaying]);
    // Nghe các message từ tab khác
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'PLAY' && event.data.senderId !== window.name) {
                // Có tab khác đang phát thì dừng tab hiện tại
                setIsPlaying(false);
                if (audioRef.current) {
                    audioRef.current.pause();
                }
                // Set isBlocked true
                setIsBlocked(true);
            }
            if (event.data.type === 'PAUSE') {
                // Set isBlocked false
                setIsBlocked(false);
            }
        };
        // Sự kiện trước khi đóng tab
        window.onunload = function () {
            // Local Storage (Lưu bài cuối cùng đang nghe trước khi tắt)
            // let playlistTemp = playlist;
            // if (playlistTemp) {
            //     localStorage.setItem('pl', JSON.stringify([{ ...playlistTemp?.pop() }]));
            // }
            setIsPlaying(false);
        };
        channel.addEventListener('message', handleMessage);
        return () => channel.removeEventListener('message', handleMessage);
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
            // console.log(randomIndex);
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
            return currentIndex;
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
        // const time = Number(e.target.value);
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
    // Hàm xử lý lưu vào lịch sử nghe
    const saveListeningHistory = async (songId) => {
        try {
            // Call API Create Listen History
            const data = { songId };
            await createListenHistoryApi(data);
            //
            return;
        } catch (error) {
            console.log('Error save listen history: ', error);
        }
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
        isBlocked,
    };
}

import { message } from 'antd';
import { useState, useEffect, Fragment, useRef, useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
    IoAddSharp,
    IoAlertCircleOutline,
    IoAlertSharp,
    IoArrowUpSharp,
    IoCheckmarkCircleOutline,
    IoCheckmarkSharp,
    IoChevronBackSharp,
    IoChevronDownSharp,
    IoChevronUpSharp,
    IoCloseSharp,
    IoCloudUploadOutline,
    IoCloudUploadSharp,
    IoDocumentSharp,
    IoEyeOffOutline,
    IoEyeOutline,
    IoHeartSharp,
    IoImages,
    IoPauseSharp,
    IoPlaySharp,
    IoPlaySkipBackSharp,
    IoPlaySkipForwardSharp,
    IoRepeatSharp,
    IoShuffleSharp,
    IoSparklesSharp,
    IoSyncSharp,
    IoVolumeHighSharp,
    IoVolumeMuteSharp,
} from 'react-icons/io5';
import { VscChevronLeft } from 'react-icons/vsc';
import CircumIcon from '@klarr-agency/circum-icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/auth.context';
import { uploadMusicApi } from '~/utils/api';
import ImageAmbilight from '../components/ImageAmbilight';
import VideoAmbilight from '../components/VideoAmbilight';
import Slider from 'react-slick';
import noContentImage from '~/assets/images/no_content.jpg';
import { useMusicPlayer } from '~/hooks/useMusicPlayer';
import { MdFullscreen, MdPictureInPictureAlt } from 'react-icons/md';
import { useQueryClient } from '@tanstack/react-query';

function UploadMusicPage() {
    // State
    const [formStep, setFormStep] = useState(0); // Mỗi step tương ứng với một thành phần khác nhau trong form
    const [audioFile, setAudioFile] = useState(); // File Audio
    const [imageFile, setImageFile] = useState(); // File Image
    const [videoFile, setVideoFile] = useState(); // File Video
    const [previewAudioFile, setPreviewAudioFile] = useState(); // Link Preview File Audio
    const [previewImageFile, setPreviewImageFile] = useState(); // Link Preview File Image
    const [previewVideoFile, setPreviewVideoFile] = useState(); // Link Preview File Video
    const [isOpenAddImageBox, setIsOpenAddImageBox] = useState(false);
    const [isOpenAddVideoBox, setIsOpenAddVideoBox] = useState(false);
    const [isOpenAudioBox, setIsOpenAudioBox] = useState(false);
    const [isAudioFileNotValid, setIsAudioFileNotValid] = useState(false);
    const [isAudioFileEmpty, setIsAudioFileEmpty] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [uploadProgressStatus, setUploadProgressStatus] = useState();

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const addImageBoxRef = useRef(null); // Hộp thêm image
    const addVideoBoxRef = useRef(null); // Hộp thêm video
    const audioBoxRef = useRef(null); // Hộp chứa audio nghe thử
    const addAudioInputRef = useRef(null);
    const addImageInputRef = useRef(null);
    const addVideoInputRef = useRef(null);
    const imageListRef = useRef(null);
    const videoListRef = useRef(null);
    const testAudioRef = useRef(null);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // React Hook Form (Form Upload Article)
    const formUploadMusic = useForm();
    const { register, handleSubmit, formState, watch, setError, clearErrors, setFocus } = formUploadMusic;
    const { errors } = formState;

    // Message (Ant Design)
    const [messageApi, contextHolder] = message.useMessage();

    // Config Slider Carousel Thumbnail (React Slick)
    let sliderRef = useRef(null);
    const settings = {
        dots: (previewImageFile && previewVideoFile) || (!previewImageFile && previewVideoFile) ? true : false,
        arrows: false,
        infinite: (previewImageFile && previewVideoFile) || (!previewImageFile && previewVideoFile) ? true : false,
        draggable: (previewImageFile && previewVideoFile) || (!previewImageFile && previewVideoFile) ? true : false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        accessibility: false,
        // adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    draggable:
                        (previewImageFile && previewVideoFile) || (!previewImageFile && previewVideoFile)
                            ? true
                            : false,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    draggable:
                        (previewImageFile && previewVideoFile) || (!previewImageFile && previewVideoFile)
                            ? true
                            : false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    // slidesToShow: 1,
                    // slidesToScroll: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    draggable:
                        (previewImageFile && previewVideoFile) || (!previewImageFile && previewVideoFile)
                            ? true
                            : false,
                },
            },
        ],
    };

    // React Query (Tanstack)
    const queryClient = useQueryClient();

    // useMusicPlayer
    const { formatTime } = useMusicPlayer();

    // --- HANDLE FUNCTIONS ---
    useEffect(() => {
        // Đổi title trang
        document.title = `Upload Music | mymusic: Music from everyone`;
    }, []);
    // Handle submit form upload music
    const onSubmit = async (data) => {
        // Chưa chọn file
        if (!audioFile) {
            setIsAudioFileEmpty(true);
            return;
        }
        // File không hợp lệ
        if (!audioFile?.type?.startsWith('audio/')) {
            setIsAudioFileNotValid(true);
            return;
        }
        // Đến bước tiếp theo
        if (formStep < 2) {
            setFormStep(formStep + 1);
            setIsPlaying(false);
            testAudioRef.current.pause();
            return;
        }
        // Nếu là bước cuối thì thực hiện đăng bài nhạc
        if (formStep === 2) {
            const { name } = data;
            const duration = formatTime(testAudioRef.current.duration);
            // Form Data
            const formData = new FormData();
            if (name) formData.append('name', name);
            if (duration) formData.append('duration', duration);
            if (audioFile) formData.append('audioAndMediaFiles', audioFile);
            if (imageFile) formData.append('audioAndMediaFiles', imageFile);
            if (videoFile) formData.append('audioAndMediaFiles', videoFile);
            // Start Upload
            try {
                // Set Upload Progress Status
                setUploadProgressStatus({
                    status: 'pending',
                    isLoading: true,
                });
                // Call API Upload Music
                const res = await uploadMusicApi(formData);
                if (res?.status === 200 && res?.message === 'Lưu bài nhạc thành công') {
                    // Nếu tạo thành công
                    setUploadProgressStatus({
                        status: 'success',
                        isLoading: true, // true để tránh trường hợp người dùng bấm thêm lần nữa trước khi navigate
                    });
                    // Tạo bài nhạc thành công
                    message.success({
                        content: 'Đã đăng tải bài nhạc',
                        duration: 1.5,
                        style: {
                            color: 'white',
                            marginTop: '58.4px',
                        },
                    });

                    // Refetch data của query key "mySongs"
                    queryClient.invalidateQueries(['mySongs']);

                    // Navigate về trang cá nhân
                    const navigateToProfileTimeout = setTimeout(() => {
                        navigate(`/profile/${auth?.user?.userName}/musics`);
                    }, 600);
                    // return
                    return () => {
                        clearTimeout(navigateToProfileTimeout);
                    };
                } else {
                    // Nếu tạo không thành công (có thể bị lỗi ở service hoặc file quá lớn)
                    setUploadProgressStatus({
                        status: 'fail',
                        isLoading: false,
                    });
                    // Tạo bài nhạc không thành công
                    message.error({
                        content: 'Đăng không thành công, hãy thử tải lại trang',
                        duration: 1.5,
                        style: {
                            color: 'white',
                            marginTop: '58.4px',
                        },
                    });
                    // return
                    return;
                }
            } catch (error) {
                // Nếu có lỗi xảy ra
                setUploadProgressStatus({
                    status: 'error',
                    isLoading: false,
                });
                // Tạo bài nhạc không thành công
                message.error({
                    content: 'Có lỗi xảy ra, hãy thử tải lại trang',
                    duration: 1.5,
                    style: {
                        color: 'white',
                        marginTop: '58.4px',
                    },
                });
                console.log(error);
            }
        }
    };
    // Handle onchange upload audio file
    const handleAddAudioFile = (e) => {
        //
        document.getElementById('areaDropFileContainerID').style.transform = 'scale(1)';
        document.getElementById('areaDropFileContainerID').style.background = 'transparent';
        // File không hợp lệ
        if (!e.target.files[0]?.type?.startsWith('audio/')) {
            setIsAudioFileNotValid(true);
            addAudioInputRef.current.value = '';
            return;
        }
        // Set audioFile
        if (e.target.files[0] && e.target.files[0]?.type?.startsWith('audio/')) {
            setAudioFile(e.target.files[0]);
            // Set Preview File Audio
            const previewAudioFileLink = URL.createObjectURL(e.target.files[0]);
            setPreviewAudioFile(previewAudioFileLink);
            addAudioInputRef.current.value = '';
            //
            return () => {
                URL.revokeObjectURL(previewAudioFileLink);
            };
        }
    };
    // Handle onchange input add image
    const handleAddImage = (e) => {
        //
        document.getElementById('mediaListContainerID').style.border = '1.5px dashed transparent';
        document.getElementById('mediaListContainerID').style.background = 'transparent';
        // File không hợp lệ
        if (!e.target.files[0]?.type?.startsWith('image/')) {
            // setIsAudioFileNotValid(true);
            addImageInputRef.current.value = '';
            return;
        }
        // Set imageFile
        if (e.target.files[0] && e.target.files[0]?.type?.startsWith('image/')) {
            setImageFile(e.target.files[0]);
            // Set Preview File Image
            const previewImageFileLink = URL.createObjectURL(e.target.files[0]);
            setPreviewImageFile(previewImageFileLink);
            addImageInputRef.current.value = '';
            //
            return () => {
                URL.revokeObjectURL(previewImageFileLink);
            };
        }
    };
    // Handle remove image
    const handleRemoveAddImage = (e) => {
        if (previewImageFile) {
            setImageFile();
            setPreviewImageFile();
            if (addImageInputRef.current) {
                addImageInputRef.current.value = '';
            }
            return;
        }
    };
    // Handle onchange input add video
    const handleAddVideo = (e) => {
        //
        document.getElementById('videoListContainerID').style.border = '1.5px dashed transparent';
        document.getElementById('videoListContainerID').style.background = 'transparent';
        // File không hợp lệ
        if (!e.target.files[0]?.type?.startsWith('video/')) {
            // setIsAudioFileNotValid(true);
            addVideoInputRef.current.value = '';
            return;
        }
        // Set videoFile
        if (e.target.files[0] && e.target.files[0]?.type?.startsWith('video/')) {
            setVideoFile(e.target.files[0]);
            // Set Preview Video Image
            const previewVideoFileLink = URL.createObjectURL(e.target.files[0]);
            setPreviewVideoFile(previewVideoFileLink);
            addVideoInputRef.current.value = '';
            //
            return () => {
                URL.revokeObjectURL(previewVideoFileLink);
            };
        }
    };
    // Handle remove video
    const handleRemoveAddVideo = (e) => {
        if (previewVideoFile) {
            setVideoFile();
            setPreviewVideoFile();
            if (addVideoInputRef.current) {
                addVideoInputRef.current.value = '';
            }
            return;
        }
    };
    // Cập nhật thời gian của bài nhạc và metadata
    useEffect(() => {
        const audio = testAudioRef.current;
        if (!audio) return;
        //
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(audio.duration);
        };
        //
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        //
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [previewAudioFile, formStep]);
    // Cập nhật CSS biến --testAudioProgress theo thời gian (phần đã phát của bài nhạc)
    useEffect(() => {
        const input = document.querySelector('.testAudioProgressBar');
        if (input) {
            const progress = (currentTime / duration) * 100 || 0;
            input.style.setProperty('--testAudioProgress', progress);
        }
    }, [currentTime, duration, previewAudioFile, formStep, isOpenAudioBox]);
    // Hàm xử lý việc tua bài nhạc
    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        // const time = Number(e.target.value);
        testAudioRef.current.currentTime = time;
        setCurrentTime(time);
    };
    // Hanlde play/pause song
    const togglePlay = async () => {
        if (!testAudioRef.current) return;
        //
        if (isPlaying) {
            testAudioRef.current.pause();
            setIsPlaying(false);
        } else {
            // audioRef.current.play();
            // setIsPlaying(true);
            try {
                await testAudioRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.error('Autoplay blocked or error playing audio:', error);
            }
        }
    };
    // Handle khi hết bài
    const handleEnded = () => {
        setIsPlaying(false);
    };
    // Đổi bytes sang mb
    const bytesToMB = (bytes) => {
        if (typeof bytes !== 'number' || isNaN(bytes)) return 0;
        return (bytes / (1024 * 1024)).toFixed(2);
    };

    return (
        <Fragment>
            {/* Ant Design Message */}
            {contextHolder}
            <div className="signUpContainer uploadMusicPage">
                {/* Thanh chuyển tab */}
                <div className="tabSwitchProfile">
                    <div className="profileUserName">
                        <span style={{ fontFamily: 'system-ui' }}>Đăng bài nhạc mới</span>
                    </div>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div>
                {/* Upload Music */}
                <div className="uploadMusic">
                    {/* Test */}
                    <form
                        className="signUpForm uploadMusicForm"
                        onSubmit={handleSubmit(onSubmit)}
                        method="POST"
                        noValidate
                    >
                        {/* Audio Tag (Hidden) */}
                        <audio
                            ref={testAudioRef}
                            src={previewAudioFile}
                            controls
                            controlsList="noplaybackrate nodownload"
                            onEnded={() => {
                                handleEnded();
                            }}
                            // style={{ display: 'none', opacity: '0', width: '0', height: '0' }}
                            hidden
                        />
                        {/* Step 0 */}
                        {formStep === 0 && (
                            <>
                                {/* Progress Bar */}
                                <div className="progressBox">
                                    <div className="stepProgressBar">
                                        <div className="stepProgressBarInner" style={{ width: '33%' }}></div>
                                    </div>
                                    <div className="stepTitle">
                                        <div className="left">{/*  */}</div>
                                        <div className="right">
                                            <span className="step">Bước 1/3</span>
                                            <span>Tải nhạc lên</span>
                                        </div>
                                        {/* Button Submit */}
                                        <button className="btnNextStep" type="submit" id="btnNextStepID">
                                            Tiếp theo
                                        </button>
                                    </div>
                                </div>
                                {/* Audio Upload Box */}
                                <div className="audioUploadBox">
                                    {/* Chỗ để kéo file vào */}
                                    <div
                                        id="areaDropFileContainerID"
                                        style={{
                                            display: 'grid',
                                            textAlign: 'center',
                                            position: 'relative',
                                            padding: '10px',
                                            background: 'transparent',
                                            borderRadius: '10px',
                                            transition: 'ease-out 0.2s',
                                            transform: 'scale(1)',
                                        }}
                                        onDragOver={(e) => {
                                            if (e.currentTarget) {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                e.currentTarget.style.background = '#89898924';
                                            }
                                        }}
                                        onDragLeave={(e) => {
                                            if (e.currentTarget) {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        {audioFile ? (
                                            <>
                                                <div className="areaDropFile">
                                                    <IoDocumentSharp />
                                                </div>
                                                <span className="fileName">{audioFile?.name}</span>
                                                <span className="fileName">
                                                    Kích thước: {bytesToMB(audioFile?.size)} MB
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="areaDropFile">
                                                    <IoCloudUploadOutline />
                                                </div>
                                                <span
                                                    style={{
                                                        color: '#dfdfdf',
                                                        fontFamily: 'system-ui',
                                                        fontWeight: '600',
                                                    }}
                                                >
                                                    Kéo và thả tệp âm thanh vào đây
                                                    <span
                                                        style={{
                                                            display: 'block',
                                                            fontSize: '15px',
                                                            fontWeight: '400',
                                                            color: '#777',
                                                            marginTop: '5px',
                                                        }}
                                                    >
                                                        Bạn nên sử dụng tập tin .mp3 có kích thước tối đa 30 MB
                                                    </span>
                                                </span>
                                                {/* Định dạng tệp không hợp lệ */}
                                                {isAudioFileNotValid ? (
                                                    <div
                                                        className="errorMessage"
                                                        style={{
                                                            // background: 'rgb(255 204 51 / 50%)',
                                                            background: 'rgb(233 20 41 / 50%)',
                                                            width: 'fit-content',
                                                            padding: '6px',
                                                            paddingRight: '7px',
                                                            color: '#ffffff',
                                                            fontSize: '14px',
                                                            fontWeight: '400',
                                                            fontFamily: 'system-ui',
                                                            margin: '0px auto',
                                                            marginTop: '11px',
                                                            borderRadius: '20px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '5px',
                                                        }}
                                                    >
                                                        <IoAlertCircleOutline />{' '}
                                                        <span style={{ marginBottom: '1px' }}>
                                                            Định dạng tệp không hợp lệ
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {isAudioFileEmpty ? (
                                                            <div
                                                                className="errorMessage"
                                                                style={{
                                                                    background: 'rgb(255 204 51 / 50%)',
                                                                    // background: 'rgb(233 20 41 / 50%)',
                                                                    width: 'fit-content',
                                                                    padding: '6px',
                                                                    paddingRight: '7px',
                                                                    color: '#ffffff',
                                                                    fontSize: '14px',
                                                                    fontWeight: '400',
                                                                    fontFamily: 'system-ui',
                                                                    margin: '0px auto',
                                                                    marginTop: '11px',
                                                                    borderRadius: '20px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: '5px',
                                                                }}
                                                            >
                                                                <IoAlertCircleOutline />{' '}
                                                                <span style={{ marginBottom: '1px' }}>
                                                                    Chưa chọn tệp nào
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {/* Nút chọn tệp */}
                                        <label className="btnChooseMusicFile" htmlFor="musicFileID" draggable="false">
                                            {audioFile ? 'Chọn tệp khác' : ' Chọn tệp'}
                                        </label>
                                        {/* Input Audio File */}
                                        <input
                                            ref={addAudioInputRef}
                                            className="inputMusicFile"
                                            id="musicFileID"
                                            name="musicFile"
                                            type="file"
                                            accept="audio/*"
                                            onChange={handleAddAudioFile}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Step 1 */}
                        {formStep === 1 && (
                            <>
                                {/* Progress Bar */}
                                <div className="progressBox">
                                    <div className="stepProgressBar">
                                        <div className="stepProgressBarInner" style={{ width: '66%' }}></div>
                                    </div>
                                    <div className="stepTitle">
                                        <div className="left">
                                            <button
                                                className="btnReturnPreviousStep"
                                                type="button"
                                                onClick={() => {
                                                    setFormStep(formStep - 1);
                                                    setIsPlaying(false);
                                                    testAudioRef.current.pause();
                                                }}
                                            >
                                                <IoChevronBackSharp />
                                            </button>
                                        </div>
                                        <div className="right">
                                            <span className="step">Bước 2/3</span>
                                            <span>Chi tiết</span>
                                        </div>
                                        {/* Button Submit */}
                                        <button className="btnNextStep" type="submit" id="btnNextStepID">
                                            Tiếp theo
                                        </button>
                                    </div>
                                </div>
                                {/* Music Info Fields */}
                                {/* Preview Music */}
                                <div className="songVideoField">
                                    <span className="title">Tệp âm thanh</span>
                                    <div className="addMoreContentContainer">
                                        <div className="addMoreContent">
                                            <span
                                                className="title"
                                                style={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '5px',
                                                }}
                                            >
                                                <IoDocumentSharp />
                                                <span
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: '1',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {audioFile?.name}
                                                </span>
                                                <span style={{ color: '#777' }}>({bytesToMB(audioFile?.size)} MB)</span>
                                            </span>
                                            <div className="contentOptions">
                                                {/* Nút mở hộp audio */}
                                                <button
                                                    type="button"
                                                    className="btnOpenAddMediaBox"
                                                    onClick={() => {
                                                        // Nếu isOpenAudioBox true thì sẽ được đóng lại
                                                        // Trước khi đóng thì tắt nhạc
                                                        if (isOpenAudioBox) {
                                                            testAudioRef.current.pause();
                                                            setIsPlaying(false);
                                                        }
                                                        setIsOpenAudioBox(!isOpenAudioBox);
                                                        // setTimeout(() => {
                                                        //     audioBoxRef?.current?.scrollIntoView({
                                                        //         behavior: 'smooth',
                                                        //     });
                                                        // }, 150);
                                                    }}
                                                >
                                                    {isOpenAudioBox ? <IoChevronUpSharp /> : <IoChevronDownSharp />}
                                                </button>
                                            </div>
                                        </div>
                                        {/* Hộp Audio */}
                                        {isOpenAudioBox ? (
                                            <>
                                                <div className="addMediaBox" ref={audioBoxRef}>
                                                    <div className="mediaListContainer" id="videoListContainerID">
                                                        {/* Custom Control */}
                                                        <div className="customControl">
                                                            <button
                                                                className="btnPlay"
                                                                type="button"
                                                                onClick={togglePlay}
                                                            >
                                                                {isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
                                                            </button>
                                                            <div className="progress">
                                                                {/* Progress */}
                                                                <input
                                                                    className="testAudioProgressBar"
                                                                    type="range"
                                                                    min="0"
                                                                    max={duration}
                                                                    value={currentTime}
                                                                    onChange={handleSeek}
                                                                    style={
                                                                        {
                                                                            // margin: '0px',
                                                                            // cursor:
                                                                            //     !playlist?.length || playlist?.length < 1
                                                                            //         ? 'not-allowed'
                                                                            //         : 'pointer',
                                                                        }
                                                                    }
                                                                />
                                                            </div>
                                                            {/* Duration and current time */}
                                                            <span className="durationAndCurrentTime">
                                                                {formatTime(currentTime)}/{formatTime(duration)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                                {/* Name */}
                                <div className="nameField">
                                    <span className="title">Tên</span>
                                    <input
                                        className="inputNameMusic"
                                        id="inputNameMusicID"
                                        name="name"
                                        type="text"
                                        // value={audioFile && `${audioFile?.name?.split('.mp3')[0]}`}
                                        spellCheck="false"
                                        placeholder="Nhập tên cho bài nhạc của bạn..."
                                        {...register('name', {
                                            required: 'Chưa nhập tên',
                                            maxLength: {
                                                value: 500,
                                                message: 'Nội dung không được quá 500 ký tự',
                                            },
                                        })}
                                    />
                                    {/* Error Input Name */}
                                    {errors.name?.message ? (
                                        <div
                                            className="errorMessage"
                                            style={{
                                                // background: '#e91429',
                                                background: 'rgb(233 20 41 / 50%)',
                                                width: 'fit-content',
                                                padding: '6px',
                                                paddingRight: '7px',
                                                color: '#ffffff',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                fontFamily: 'system-ui',
                                                marginTop: '12px',
                                                borderRadius: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '5px',
                                            }}
                                        >
                                            <IoAlertCircleOutline />{' '}
                                            <span style={{ marginBottom: '1px' }}>{errors.name?.message}</span>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                {/* Genre */}
                                {/* ... */}
                                {/* Song Image */}
                                <div className="songImageField">
                                    <span className="title">
                                        Thêm hình <span style={{ fontSize: '15px', color: '#777' }}>(tùy chọn)</span>
                                    </span>
                                    <div className="addMoreContentContainer">
                                        <div className="addMoreContent">
                                            <span className="title">
                                                Thêm ảnh bìa cho bài nhạc của bạn{' '}
                                                <span style={{ color: '#777' }}>
                                                    {previewImageFile ? `(1/1)` : `(0/1)`}
                                                </span>
                                            </span>
                                            <div className="contentOptions">
                                                {/* Nút mở hộp thêm ảnh */}
                                                <button
                                                    type="button"
                                                    className="btnOpenAddMediaBox"
                                                    onClick={() => {
                                                        setIsOpenAddImageBox(!isOpenAddImageBox);
                                                        setTimeout(() => {
                                                            addImageBoxRef?.current?.scrollIntoView({
                                                                behavior: 'smooth',
                                                            });
                                                        }, 150);
                                                    }}
                                                >
                                                    {isOpenAddImageBox ? <IoChevronUpSharp /> : <IoChevronDownSharp />}
                                                </button>
                                            </div>
                                        </div>
                                        {/* Hộp Thêm Image File */}
                                        {isOpenAddImageBox ? (
                                            <>
                                                <div className="addMediaBox" ref={addImageBoxRef}>
                                                    <span className="title">
                                                        <span
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                            }}
                                                        >
                                                            {/* Nút thêm ảnh */}
                                                            <label
                                                                className="btnAddMedia"
                                                                draggable="false"
                                                                htmlFor="mediaFileID"
                                                                onClick={(e) => {}}
                                                            >
                                                                {imageFile && previewImageFile ? (
                                                                    <>Chọn ảnh khác</>
                                                                ) : (
                                                                    <>
                                                                        <IoAddSharp /> Thêm ảnh
                                                                    </>
                                                                )}
                                                            </label>
                                                        </span>
                                                        {/* Nút đóng */}
                                                        <button
                                                            type="button"
                                                            className="btnCloseAddMediaBox"
                                                            onClick={() => {
                                                                setIsOpenAddImageBox(false);
                                                            }}
                                                        >
                                                            <IoCloseSharp />
                                                        </button>
                                                    </span>
                                                    <div
                                                        className="mediaListContainer"
                                                        id="mediaListContainerID"
                                                        onDragOver={(e) => {
                                                            if (e.currentTarget) {
                                                                // e.currentTarget.style.transform = 'scale(1.005)';
                                                                e.currentTarget.style.border =
                                                                    '1.5px dashed rgba(255, 255, 255, 0.5019607843)';
                                                                e.currentTarget.style.background = '#89898924';
                                                            }
                                                        }}
                                                        onDragLeave={(e) => {
                                                            if (e.currentTarget) {
                                                                // e.currentTarget.style.transform = 'scale(1)';
                                                                e.currentTarget.style.border =
                                                                    '1.5px dashed transparent';
                                                                e.currentTarget.style.background = 'transparent';
                                                            }
                                                        }}
                                                    >
                                                        {/* Input Image File */}
                                                        <input
                                                            ref={addImageInputRef}
                                                            className="inputMediaFile"
                                                            id="mediaFileID"
                                                            name="songImage"
                                                            type="file"
                                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                            // {...register('mediaFiles', {})}
                                                            onChange={handleAddImage}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '0',
                                                                width: '100%',
                                                                height: '100%',
                                                                borderRadius: '6px',
                                                                opacity: '0',
                                                                zIndex: '2',
                                                            }}
                                                        />
                                                        {/* Danh sách ảnh đã thêm */}
                                                        <div
                                                            className="mediaList"
                                                            ref={imageListRef}
                                                            style={{
                                                                width: previewImageFile ? '' : '100%',
                                                            }}
                                                        >
                                                            {/* Render ảnh/video đã chọn */}
                                                            {previewImageFile ? (
                                                                <>
                                                                    <div
                                                                        // key={index}
                                                                        className="previewMediaFilesContainer"
                                                                    >
                                                                        <img
                                                                            // key={index + 'img'}
                                                                            src={previewImageFile}
                                                                        />
                                                                        <button
                                                                            className="btnRemove"
                                                                            // key={index + 'btnRemove'}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                handleRemoveAddImage();
                                                                            }}
                                                                        >
                                                                            <IoCloseSharp />
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span
                                                                    style={{
                                                                        color: 'whitesmoke',
                                                                        fontFamily: 'system-ui',
                                                                        fontSize: '15px',
                                                                        fontWeight: '400',
                                                                        textAlign: 'center',
                                                                        display: 'block',
                                                                        width: '100%',
                                                                        padding: '66.5px 0px',
                                                                    }}
                                                                >
                                                                    Kéo và thả tệp ảnh vào đây
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                                {/* Song Video */}
                                <div className="songVideoField">
                                    <span className="title">
                                        Thêm video <span style={{ fontSize: '15px', color: '#777' }}>(tùy chọn)</span>
                                    </span>
                                    <div className="addMoreContentContainer">
                                        <div className="addMoreContent">
                                            <span className="title">
                                                Thêm video cho bài nhạc của bạn{' '}
                                                <span style={{ color: '#777' }}>
                                                    {previewVideoFile ? `(1/1)` : `(0/1)`}
                                                </span>
                                            </span>
                                            <div className="contentOptions">
                                                {/* Nút mở hộp thêm video */}
                                                <button
                                                    type="button"
                                                    className="btnOpenAddMediaBox"
                                                    onClick={() => {
                                                        setIsOpenAddVideoBox(!isOpenAddVideoBox);
                                                        setTimeout(() => {
                                                            addVideoBoxRef?.current?.scrollIntoView({
                                                                behavior: 'smooth',
                                                            });
                                                        }, 150);
                                                    }}
                                                >
                                                    {isOpenAddVideoBox ? <IoChevronUpSharp /> : <IoChevronDownSharp />}
                                                </button>
                                            </div>
                                        </div>
                                        {/* Hộp Thêm Video File */}
                                        {isOpenAddVideoBox ? (
                                            <>
                                                <div className="addMediaBox" ref={addVideoBoxRef}>
                                                    <span className="title">
                                                        <span
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                            }}
                                                        >
                                                            {/* Nút thêm video */}
                                                            <label
                                                                className="btnAddMedia"
                                                                draggable="false"
                                                                htmlFor="videoFileID"
                                                                onClick={(e) => {}}
                                                            >
                                                                {videoFile && previewVideoFile ? (
                                                                    <>Chọn video khác</>
                                                                ) : (
                                                                    <>
                                                                        <IoAddSharp /> Thêm video
                                                                    </>
                                                                )}
                                                            </label>
                                                        </span>
                                                        {/* Nút đóng */}
                                                        <button
                                                            type="button"
                                                            className="btnCloseAddMediaBox"
                                                            onClick={() => {
                                                                setIsOpenAddVideoBox(false);
                                                            }}
                                                        >
                                                            <IoCloseSharp />
                                                        </button>
                                                    </span>
                                                    <div
                                                        className="mediaListContainer"
                                                        id="videoListContainerID"
                                                        onDragOver={(e) => {
                                                            if (e.currentTarget) {
                                                                // e.currentTarget.style.transform = 'scale(1.005)';
                                                                e.currentTarget.style.border =
                                                                    '1.5px dashed rgba(255, 255, 255, 0.5019607843)';
                                                                e.currentTarget.style.background = '#89898924';
                                                            }
                                                        }}
                                                        onDragLeave={(e) => {
                                                            if (e.currentTarget) {
                                                                // e.currentTarget.style.transform = 'scale(1)';
                                                                e.currentTarget.style.border =
                                                                    '1.5px dashed transparent';
                                                                e.currentTarget.style.background = 'transparent';
                                                            }
                                                        }}
                                                    >
                                                        {/* Input Video File */}
                                                        <input
                                                            ref={addVideoInputRef}
                                                            className="inputMediaFile"
                                                            id="videoFileID"
                                                            name="songVideo"
                                                            type="file"
                                                            accept="video/mp4,video/mkv,video/webm,video/avi"
                                                            // {...register('mediaFiles', {})}
                                                            onChange={handleAddVideo}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '0',
                                                                width: '100%',
                                                                height: '100%',
                                                                borderRadius: '6px',
                                                                opacity: '0',
                                                            }}
                                                        />
                                                        {/* Danh sách video đã thêm */}
                                                        <div
                                                            className="mediaList"
                                                            ref={videoListRef}
                                                            style={{
                                                                width: previewVideoFile ? '' : '100%',
                                                            }}
                                                        >
                                                            {/* Render ảnh/video đã chọn */}
                                                            {previewVideoFile ? (
                                                                <>
                                                                    <div
                                                                        // key={index}
                                                                        className="previewMediaFilesContainer"
                                                                    >
                                                                        <video
                                                                            // key={index + 'video'}
                                                                            src={previewVideoFile}
                                                                            playsInline
                                                                            controls
                                                                            controlsList="noplaybackrate nodownload"
                                                                            muted
                                                                            disablePictureInPicture
                                                                            disableRemotePlayback
                                                                            preload="false"
                                                                        />
                                                                        <button
                                                                            className="btnRemove"
                                                                            // key={index + 'btnRemove'}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                handleRemoveAddVideo();
                                                                            }}
                                                                        >
                                                                            <IoCloseSharp />
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span
                                                                    style={{
                                                                        color: 'whitesmoke',
                                                                        fontFamily: 'system-ui',
                                                                        fontSize: '15px',
                                                                        fontWeight: '400',
                                                                        textAlign: 'center',
                                                                        display: 'block',
                                                                        width: '100%',
                                                                        padding: '66.5px 0px',
                                                                    }}
                                                                >
                                                                    Kéo và thả tệp video vào đây
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Step 2 */}
                        {formStep === 2 && (
                            <>
                                {/* Progress Bar */}
                                <div className="progressBox">
                                    <div className="stepProgressBar">
                                        <div className="stepProgressBarInner" style={{ width: '100%' }}></div>
                                    </div>
                                    <div className="stepTitle">
                                        <div className="left">
                                            <button
                                                className="btnReturnPreviousStep"
                                                type="button"
                                                onClick={() => {
                                                    setFormStep(formStep - 1);
                                                    setIsPlaying(false);
                                                    testAudioRef.current.pause();
                                                }}
                                            >
                                                <IoChevronBackSharp />
                                            </button>
                                        </div>
                                        <div className="right">
                                            <span className="step">Bước 3/3</span>
                                            <span>Kiểm tra</span>
                                        </div>
                                        {/* Button Submit */}
                                        <button
                                            className="btnNextStep"
                                            type="submit"
                                            id="btnNextStepID"
                                            disabled={uploadProgressStatus?.isLoading}
                                            style={{
                                                opacity: uploadProgressStatus?.isLoading ? '0.3' : '',
                                                cursor: uploadProgressStatus?.isLoading ? 'not-allowed' : '',
                                            }}
                                        >
                                            {/* Nếu chưa bấm */}
                                            {!uploadProgressStatus && (
                                                <>
                                                    <IoArrowUpSharp /> Đăng
                                                </>
                                            )}
                                            {/* Đang xử lý */}
                                            {uploadProgressStatus?.status === 'pending' && (
                                                <>
                                                    <IoSyncSharp
                                                        className="loadingAnimation"
                                                        style={{ color: '#ffffff', width: '15px', height: '15px' }}
                                                    />{' '}
                                                    Đang đăng
                                                </>
                                            )}
                                            {/* Thành công */}
                                            {uploadProgressStatus?.status === 'success' && (
                                                <>
                                                    <IoCheckmarkSharp /> Đã đăng
                                                </>
                                            )}
                                            {/* Không thành công */}
                                            {uploadProgressStatus?.status === 'fail' && (
                                                <>
                                                    <IoAlertSharp /> Đăng không thành công{' '}
                                                </>
                                            )}
                                            {/* Lỗi */}
                                            {uploadProgressStatus?.status === 'error' && (
                                                <>
                                                    <IoAlertSharp /> Có lỗi xảy ra
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {/* Song Player Sample */}
                                <div style={{ overflow: 'hidden', padding: '17px' }}>
                                    <span
                                        style={{
                                            color: 'rgb(119, 119, 119)',
                                            fontFamily: 'system-ui',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            display: 'block',
                                            textAlign: 'center',
                                            paddingBottom: '10px',
                                        }}
                                    >
                                        Dưới đây là bản xem thử giúp bạn kiểm tra lại thông tin của bài nhạc
                                    </span>
                                    <div
                                        className="songPlayer"
                                        style={{
                                            overflow: 'hidden',
                                            border: '0.5px solid transparent',
                                            borderRadius: '20px',
                                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                                            background: '#1f1f1f',
                                            paddingBottom: '52.5px',
                                        }}
                                    >
                                        {/* top */}
                                        <div className="top" style={{ paddingTop: '0px' }}>
                                            <span className="title" style={{ margin: '0' }}></span>
                                            <div className="options">
                                                {/* Nút phóng to / thu nhỏ trình phát nhạc */}
                                                <button
                                                    type="button"
                                                    className="btnFullScreen tooltip"
                                                    style={{ opacity: '0.3', cursor: 'not-allowed' }}
                                                    disabled
                                                >
                                                    <MdFullscreen />
                                                    <span class="tooltiptext">Phóng to</span>
                                                </button>
                                                {/* Nút chế độ hình trong hình */}
                                                <button
                                                    type="button"
                                                    className="btnPicInPic tooltip"
                                                    style={{ opacity: '0.3', cursor: 'not-allowed' }}
                                                    disabled
                                                >
                                                    <MdPictureInPictureAlt />
                                                    <span class="tooltiptext">Trình phát thu nhỏ</span>
                                                </button>
                                            </div>
                                        </div>
                                        {/* middle */}
                                        <div className="middle">
                                            {/* topBack */}
                                            <div className="topBack"></div>
                                            {/* Thumbnail */}
                                            <div className="carouselThumbnail">
                                                <Slider
                                                    ref={(slider) => {
                                                        sliderRef = slider;
                                                    }}
                                                    {...settings}
                                                >
                                                    {/* Song Image */}
                                                    {!previewImageFile && (
                                                        <div className="thumbnail">
                                                            <ImageAmbilight imageSrc={noContentImage}></ImageAmbilight>
                                                        </div>
                                                    )}
                                                    {previewImageFile && (
                                                        <div className="thumbnail">
                                                            <ImageAmbilight
                                                                imageSrc={previewImageFile}
                                                            ></ImageAmbilight>
                                                        </div>
                                                    )}
                                                    {/* Song Video */}
                                                    {previewVideoFile && (
                                                        <div className="thumbnail">
                                                            <VideoAmbilight
                                                                videoSrc={previewVideoFile}
                                                            ></VideoAmbilight>
                                                        </div>
                                                    )}
                                                </Slider>
                                            </div>
                                            {/* Song Info */}
                                            <div className="songInfo">
                                                {/* Name */}
                                                <div className="name">
                                                    <span
                                                        id="songNameID"
                                                        // onMouseOver={activeSongNameMarquee}
                                                        // onMouseLeave={turnOffSongNameMarquee}
                                                    >
                                                        {watch('name') || ''}
                                                    </span>
                                                </div>
                                                <div className="artist">
                                                    <Link
                                                        to={`/profile/${auth?.user?.userName}`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <span>{auth?.user?.userName || ''}</span>
                                                    </Link>
                                                </div>
                                            </div>
                                            {/* Audio */}
                                            {/* <audio
                                                ref={audioRef}
                                                onEnded={() => {
                                                    handleEnded();
                                                }}
                                                controls={false}
                                                preload="auto"
                                            /> */}
                                            {/* Progress Bar */}
                                            <div
                                                className="progressBarContainer progress"
                                                style={{ marginBottom: '30px', display: 'grid' }}
                                            >
                                                {/* Progress */}
                                                <input
                                                    className="progressBar testAudioProgressBar"
                                                    type="range"
                                                    min="0"
                                                    max={duration}
                                                    value={currentTime}
                                                    onChange={handleSeek}
                                                    style={{
                                                        margin: '0px',
                                                        // cursor:
                                                        //     !playlist?.length || playlist?.length < 1
                                                        //         ? 'not-allowed'
                                                        //         : 'pointer',
                                                    }}
                                                />
                                                {/* Time */}
                                                <div className="timeBar">
                                                    <div className="left" id="leftTimeBarID">
                                                        {formatTime(currentTime)}
                                                    </div>
                                                    <div className="right" id="rightTimeBarID">
                                                        {formatTime(duration)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* bottom */}
                                        <div
                                            className="bottom"
                                            style={{
                                                position: 'absolute',
                                            }}
                                        >
                                            {/* Controls */}
                                            <div className="controlsContainer">
                                                <div className="controls">
                                                    <div className="btnVolumeControlContainer">
                                                        {/* Volume Control */}
                                                        <button
                                                            type="button"
                                                            className={`btnVolumeControl btnDisabled`}
                                                            // onClick={() => {
                                                            //     handleBtnVolume();
                                                            // }}
                                                            disabled
                                                        >
                                                            <IoVolumeHighSharp />
                                                        </button>
                                                    </div>
                                                    <div className="btnShuffleContainer">
                                                        <button
                                                            type="button"
                                                            className={`btnShuffle btnDisabled`}
                                                            // onClick={() => {
                                                            //     shuffle();
                                                            // }}
                                                            style={{
                                                                // backgroundColor: isShuffle ? '#ffffff' : '',
                                                                // color: isShuffle ? '#000' : '#ffffff',
                                                                position: 'relative',
                                                            }}
                                                            disabled
                                                        >
                                                            <IoShuffleSharp />
                                                        </button>
                                                    </div>
                                                    <div className="btnPreviousSongContainer">
                                                        <button
                                                            type="button"
                                                            className={`btnPreviousSong btnDisabled`}
                                                            // onClick={previous}
                                                            disabled
                                                        >
                                                            <IoPlaySkipBackSharp />
                                                        </button>
                                                    </div>
                                                    <div className="btnPlayContainer">
                                                        <button
                                                            type="button"
                                                            className={`btnPlay`}
                                                            onClick={togglePlay}
                                                        >
                                                            {isPlaying && <IoPauseSharp />}
                                                            {!isPlaying && <IoPlaySharp />}
                                                            {/* {!isPlaying && currentTime === duration && <IoRefreshSharp />} */}
                                                        </button>
                                                    </div>
                                                    <div className="btnNextSongContainer">
                                                        <button
                                                            type="button"
                                                            className={`btnNextSong btnDisabled`}
                                                            // onClick={next}
                                                            disabled
                                                        >
                                                            <IoPlaySkipForwardSharp />
                                                        </button>
                                                    </div>
                                                    <div className="btnRepeatContainer">
                                                        <button
                                                            type="button"
                                                            className={`btnRepeat btnDisabled`}
                                                            // onClick={() => setIsRepeatOne(!isRepeatOne)}
                                                            style={{
                                                                // backgroundColor: isRepeatOne ? '#ffffff' : '',
                                                                // color: isRepeatOne ? '#000' : '#ffffff',
                                                                position: 'relative',
                                                            }}
                                                            disabled
                                                        >
                                                            <IoRepeatSharp />
                                                        </button>
                                                    </div>
                                                    <div className="btnLikeSongContainer">
                                                        <button
                                                            type="button"
                                                            className={`btnLikeSong btnDisabled`}
                                                            disabled
                                                        >
                                                            <IoSparklesSharp
                                                                className="sparkles"
                                                                style={{ transform: 'translate(-11px, -7px)' }}
                                                            />
                                                            <IoHeartSharp />
                                                            <IoSparklesSharp
                                                                className="sparkles"
                                                                style={{ transform: 'translate(8px, 6px)' }}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Music Player đang phát ở Tab khác */}
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Check Data */}
                        <pre style={{ color: 'red' }} hidden>
                            {JSON.stringify(watch(), null, 2)}
                        </pre>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default UploadMusicPage;

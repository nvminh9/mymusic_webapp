import { message } from 'antd';
import { useState, useEffect, Fragment, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
    IoAddSharp,
    IoAlertCircleOutline,
    IoArrowUpSharp,
    IoCheckmarkCircleOutline,
    IoChevronBackSharp,
    IoChevronDownSharp,
    IoChevronUpSharp,
    IoCloseSharp,
    IoCloudUploadOutline,
    IoCloudUploadSharp,
    IoDocumentSharp,
    IoEyeOffOutline,
    IoEyeOutline,
    IoImages,
} from 'react-icons/io5';
import { VscChevronLeft } from 'react-icons/vsc';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
    const [isAudioFileNotValid, setIsAudioFileNotValid] = useState(false);
    const [isAudioFileEmpty, setIsAudioFileEmpty] = useState(false);

    // Context

    // Ref
    const addImageBoxRef = useRef(null); // Hộp thêm image
    const addVideoBoxRef = useRef(null); // Hộp thêm video
    const addAudioInputRef = useRef(null);
    const addImageInputRef = useRef(null);
    const addVideoInputRef = useRef(null);
    const imageListRef = useRef(null);
    const videoListRef = useRef(null);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // React Hook Form (Form Upload Article)
    const formUploadMusic = useForm();
    const { register, handleSubmit, formState, watch, setError, clearErrors, setFocus } = formUploadMusic;
    const { errors } = formState;

    // Message (Ant Design)
    const [messageApi, contextHolder] = message.useMessage();

    // --- HANDLE FUNCTIONS ---
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
            return;
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
            setPreviewImageFile();
            addImageInputRef.current.value = '';
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
            setPreviewVideoFile();
            addVideoInputRef.current.value = '';
            return;
        }
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
                                        {formStep < 2 ? (
                                            <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                Tiếp theo
                                            </button>
                                        ) : (
                                            <>
                                                {formStep === 2 ? (
                                                    <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                        oArrowUpSharp/ Đăng
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btnNextStep"
                                                        type="submit"
                                                        id="btnNextStepID"
                                                        style={{ fontWeight: '400' }}
                                                        onClick={() => {
                                                            navigate('/signin');
                                                        }}
                                                    >{`Chuyển tới trang đăng nhập`}</button>
                                                )}
                                            </>
                                        )}
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
                                                        fontWeight: '400',
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
                                                    <span
                                                        className="fileName"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '5px',
                                                            fontSize: '14px',
                                                            fontWeight: '400',
                                                            margin: '0px auto',
                                                            marginTop: '5px',
                                                        }}
                                                    >
                                                        <IoAlertCircleOutline style={{ color: '#d63031' }} /> Định dạng
                                                        tệp không hợp lệ
                                                    </span>
                                                ) : (
                                                    <>
                                                        {isAudioFileEmpty ? (
                                                            <span
                                                                className="fileName"
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: '5px',
                                                                    fontSize: '14px',
                                                                    fontWeight: '400',
                                                                    margin: '0px auto',
                                                                    marginTop: '5px',
                                                                }}
                                                            >
                                                                <IoAlertCircleOutline style={{ color: '#ffc107' }} />{' '}
                                                                Chưa chọn tệp nào
                                                            </span>
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
                                                onClick={() => setFormStep(formStep - 1)}
                                            >
                                                <IoChevronBackSharp />
                                            </button>
                                        </div>
                                        <div className="right">
                                            <span className="step">Bước 2/3</span>
                                            <span>Chi tiết</span>
                                        </div>
                                        {/* Button Submit */}
                                        {formStep < 2 ? (
                                            <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                Tiếp theo
                                            </button>
                                        ) : (
                                            <>
                                                {formStep === 2 ? (
                                                    <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                        <IoArrowUpSharp /> Đăng
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btnNextStep"
                                                        type="submit"
                                                        id="btnNextStepID"
                                                        style={{ fontWeight: '400' }}
                                                        onClick={() => {
                                                            navigate('/signin');
                                                        }}
                                                    >{`Chuyển tới trang đăng nhập`}</button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                {/* Music Info Fields */}
                                {/* Preview Music */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0px 17px',
                                        // backgroundColor: '#f1f3f4',
                                        borderRadius: '6px',
                                    }}
                                >
                                    {/* <audio
                                        src={previewAudioFile}
                                        controls
                                        controlsList="noplaybackrate nodownload"
                                        style={{ width: '100%' }}
                                    /> */}
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
                                            <IoAlertCircleOutline /> {errors.name?.message}
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
                                                onClick={() => setFormStep(formStep - 1)}
                                            >
                                                <IoChevronBackSharp />
                                            </button>
                                        </div>
                                        <div className="right">
                                            <span className="step">Bước 3/3</span>
                                            <span>Bước 3</span>
                                        </div>
                                        {/* Button Submit */}
                                        {formStep < 2 ? (
                                            <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                Tiếp theo
                                            </button>
                                        ) : (
                                            <>
                                                {formStep === 2 ? (
                                                    <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                        <IoArrowUpSharp /> Đăng
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btnNextStep"
                                                        type="submit"
                                                        id="btnNextStepID"
                                                        style={{ fontWeight: '400' }}
                                                        onClick={() => {
                                                            navigate('/signin');
                                                        }}
                                                    >{`Chuyển tới trang đăng nhập`}</button>
                                                )}
                                            </>
                                        )}
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

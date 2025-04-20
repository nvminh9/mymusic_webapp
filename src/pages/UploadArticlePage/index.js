import { useState, useEffect, Fragment, useRef, useContext } from 'react';
import { VscChevronLeft, VscChevronRight, VscEllipsis } from 'react-icons/vsc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { set, useForm } from 'react-hook-form';
import { message } from 'antd';
import {
    IoAddSharp,
    IoAlertCircleOutline,
    IoCloseSharp,
    IoGlobeOutline,
    IoImages,
    IoLockClosedOutline,
} from 'react-icons/io5';
import { createArticleApi } from '~/utils/api';

function UploadArticlePage() {
    // State
    const [isOpenAddMediaBox, setIsOpenAddMediaBox] = useState(false); // Đóng/mở hộp thêm Media File
    const [isOpenPreviewArticle, setIsOpenPreviewArticle] = useState(false); // Đóng/mở hộp xem trước bài viết
    const [previewMediaFiles, setPreviewMediaFiles] = useState([]); // previewMediaFiles dùng lưu ảnh/video xem trước (file, preview, type)

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const addMediaBoxRef = useRef(null); // Ref hộp thêm ảnh/video
    const mediaList = useRef(null); // Ref mediaList xem trước ảnh/video đã chọn

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // React Hook Form (Form Upload Article)
    const formUploadArticle = useForm();
    const { register, handleSubmit, formState, watch, setError, clearErrors } = formUploadArticle;
    const { errors } = formState;

    // Message (Ant Design)
    const [messageApi, contextHolder] = message.useMessage();

    // Config Carousel Media (React Slick)
    // Slide Hình xem trước của bài viết
    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };
    const settings = {
        dots: previewMediaFiles.length > 1 ? true : false,
        arrows: false,
        infinite: previewMediaFiles.length > 1 ? true : false,
        draggable: previewMediaFiles.length > 1 ? true : false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        accessibility: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    draggable: previewMediaFiles.length > 1 ? true : false,
                    draggable: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    draggable: previewMediaFiles.length > 1 ? true : false,
                    draggable: true,
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
                    draggable: previewMediaFiles.length > 1 ? true : false,
                    draggable: true,
                },
            },
        ],
    };
    // Slide Hình ảnh/video đã thêm vào bài viết
    let sliderRefAddMedia = useRef(null);
    const nextAddMedia = () => {
        sliderRefAddMedia.slickNext();
    };
    const previousAddMedia = () => {
        sliderRefAddMedia.slickPrev();
    };
    const settingsSlideAddMedia = {
        // dots: feed.feed.media.length > 1 ? true : false,
        dots: false,
        arrows: false,
        // infinite: feed.feed.media.length > 1 ? true : false,
        infinite: false,
        // draggable: feed.feed.media.length > 1 ? true : false,
        draggable: true,
        speed: 500,
        slidesToShow: 2.5,
        slidesToScroll: 1,
        initialSlide: 0,
        accessibility: true,
        variableWidth: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    // draggable: feed.feed.media.length > 1 ? true : false,
                    draggable: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    // draggable: feed.feed.media.length > 1 ? true : false,
                    draggable: true,
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
                    // draggable: feed.feed.media.length > 1 ? true : false,
                    draggable: true,
                },
            },
        ],
    };

    // --- HANDLE FUNCTIONS ---
    // Handle Submit Form Upload Article
    const onSubmit = async (data) => {
        const { privacy, textContent } = data;
        // Form Data
        const formData = new FormData();
        if (privacy) formData.append('privacy', privacy);
        if (textContent) formData.append('textContent', textContent);
        if (previewMediaFiles.length > 0) {
            previewMediaFiles.forEach((file) => {
                formData.append('mediaFiles', file.file);
            });
        }
        // Loading ... (Ant Design Message)
        messageApi
            .open({
                type: 'loading',
                content: 'Đang xử lý ...',
                duration: 1.5,
                style: {
                    color: 'white',
                    marginTop: '58.4px',
                },
            })
            .then(async () => {
                // Call API Create Article
                const res = await createArticleApi(formData);
                if (res?.status === 200 && res?.message === 'Tạo bài viết thành công') {
                    // Tạo bài viết thành công
                    message.success({
                        content: 'Tạo bài viết thành công',
                        duration: 1.5,
                        style: {
                            color: 'white',
                            marginTop: '58.4px',
                        },
                    });
                    // Navigate về trang cá nhân
                    navigate(`/profile/${auth?.user?.userName}`);
                } else {
                    // Tạo bài viết không thành công
                    message.error({
                        content: 'Có lỗi xảy ra',
                        duration: 1.5,
                        style: {
                            color: 'white',
                            marginTop: '58.4px',
                        },
                    });
                }
            });
    };
    // Handle Remove Add Media File (có thể tối ưu)
    const handleRemoveAddMedia = (id) => {
        // Xóa link ảo (URL blob)
        // ...
        // Lọc preview (Lấy ra mảng item trừ item có id được truyền vào)
        setPreviewMediaFiles((prev) => prev.filter((item) => item.id !== id));
    };
    // Handle Input Add Media File (có thể tối ưu)
    const handleAddMedia = (e) => {
        // Files mới chọn
        const selectedFiles = Array.from(e.target.files);
        // Gán loại và URL tạm thời cho file
        const filesWithPreview = selectedFiles.map((file, index) => ({
            file,
            type: file.type.startsWith('image') ? 'image' : 'video',
            preview: URL.createObjectURL(file),
            id: Math.random().toString(36).substring(2, 9), // id tạm thời để xóa
        }));
        // Thêm vào mediaFiles và previewMediaFiles
        // setMediaFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setPreviewMediaFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
        // Reset input
        e.target.value = null;
        // Scroll xuống cuối mediaList
        setTimeout(() => {
            mediaList.current.scrollLeft = mediaList.current.scrollWidth;
        }, 200);
        // console.log(mediaFiles);
        console.log(previewMediaFiles);
    };
    // Handle Button Create
    const handleBtnCreate = () => {
        let textContent = watch('textContent');
        if (textContent === '') {
            setError('textContent', {
                type: 'custom',
                message: 'Chưa nhập nội dung bài viết',
            });
            setIsOpenPreviewArticle(false);
            return;
        } else {
            clearErrors('textContent');
            setIsOpenPreviewArticle(true);
            return;
        }
    };

    return (
        <Fragment>
            <div className="uploadArticlePage">
                {/* Thanh chuyển tab */}
                <div className="tabSwitchProfile">
                    <div className="profileUserName">
                        <span>Tạo bài viết mới</span>
                    </div>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div>
                {/* Upload Article */}
                <div className="feedPage">
                    {/* Ant Design Message */}
                    {contextHolder}
                    <div className="articleContainer">
                        {/* Form Upload Article */}
                        <form className="uploadArticleForm" onSubmit={handleSubmit(onSubmit)} method="POST" noValidate>
                            {/* Mẫu bài viết để nhập */}
                            <div className="article">
                                <div className="left">
                                    {/* Avatar */}
                                    <div className="userAvatar">
                                        <Link
                                            to={`/profile/${auth?.user?.userName}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <img
                                                src={
                                                    auth?.user?.userAvatar
                                                        ? process.env.REACT_APP_BACKEND_URL + auth?.user?.userAvatar
                                                        : defaultAvatar
                                                }
                                            />
                                        </Link>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="top">
                                        <div className="articleInfo">
                                            <Link
                                                to={`/profile/${auth?.user?.userName}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <span className="userName">{auth?.user?.userName}</span>
                                            </Link>
                                            {/* Chọn Privacy */}
                                            <select
                                                className="privacySelect"
                                                name="privacy"
                                                id="privacy"
                                                {...register('privacy', {})}
                                            >
                                                <option className="privacyOption" value="0">
                                                    Công khai
                                                </option>
                                                <option className="privacyOption" value="1">
                                                    Chỉ mình tôi
                                                </option>
                                            </select>
                                            {/* <span className="createdAt"></span> */}
                                        </div>
                                        <div className="articleOptions">
                                            <button type="button" className="btnArticleOptions">
                                                <VscEllipsis></VscEllipsis>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="middle">
                                        <div className="content">
                                            {/* Nội dung textContent */}
                                            <textarea
                                                className="text"
                                                placeholder="Có gì mới?"
                                                {...register('textContent', {
                                                    required: 'Chưa nhập nội dung bài viết',
                                                    maxLength: {
                                                        value: 1500,
                                                        message: 'Nội dung bài viết không được quá 1500 ký tự',
                                                    },
                                                })}
                                                onChange={() => {
                                                    console.log(errors.textContent?.message);
                                                }}
                                                style={{
                                                    background: 'transparent',
                                                    borderRadius: '5px',
                                                    border: '.5px solid transparent',
                                                    fontFamily: "'Funnel Sans', sans-serif",
                                                    maxWidth: '100%',
                                                    minWidth: '100%',
                                                    height: 'max-content',
                                                    minHeight: 'max-content',
                                                    padding: '0px 0px 8px 0px',
                                                    marginBottom: '8px',
                                                    marginTop: '5px',
                                                }}
                                            />
                                            {/* Validate Error Text Content */}
                                            {errors.textContent?.message ? (
                                                <div
                                                    className="errorMessage"
                                                    style={{
                                                        background: '#e91429',
                                                        width: 'fit-content',
                                                        padding: '5px',
                                                        color: 'white',
                                                        fontSize: '14px',
                                                        fontFamily: 'sans-serif',
                                                        margin: '8px 0px',
                                                        borderRadius: '5px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '5px',
                                                    }}
                                                >
                                                    <IoAlertCircleOutline /> {errors.textContent?.message}
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                            {/* Slide Media */}
                                            <div className="media">
                                                {/* Carousel Media Xem trước */}
                                                <div className="carouselMedia">
                                                    {/* Render Carousel Media Xem Trước */}
                                                    {previewMediaFiles.length > 0 ? (
                                                        <>
                                                            <Slider
                                                                ref={(slider) => {
                                                                    sliderRef = slider;
                                                                }}
                                                                {...settings}
                                                            >
                                                                {previewMediaFiles.map((previewMediaFile, index) => (
                                                                    <Fragment key={index}>
                                                                        <div className="mediaContainer">
                                                                            {previewMediaFile.type === 'image' ? (
                                                                                <img
                                                                                    src={previewMediaFile?.preview}
                                                                                    className="slide-image"
                                                                                    style={{}}
                                                                                />
                                                                            ) : (
                                                                                <video
                                                                                    src={previewMediaFile.preview}
                                                                                    style={{}}
                                                                                    playsInline
                                                                                    controls
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    </Fragment>
                                                                ))}
                                                            </Slider>
                                                            {previewMediaFiles.length >= 2 && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="btnPrevCarousel"
                                                                        onClick={previous}
                                                                    >
                                                                        <VscChevronLeft />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btnNextCarousel"
                                                                        onClick={next}
                                                                    >
                                                                        <VscChevronRight />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Phần thêm nội dung vào bài viết */}
                                            <div className="addMoreContentContainer">
                                                {/* Các chức thêm nội dung cho bài viết */}
                                                <div className="addMoreContent">
                                                    <span className="title">Thêm vào bài viết của bạn</span>
                                                    <div className="contentOptions">
                                                        {/* Nút mở hộp thêm ảnh/video */}
                                                        <button
                                                            type="button"
                                                            className="btnOpenAddMediaBox"
                                                            onClick={() => {
                                                                setIsOpenAddMediaBox(!isOpenAddMediaBox);
                                                                setTimeout(() => {
                                                                    addMediaBoxRef?.current?.scrollIntoView({
                                                                        behavior: 'smooth',
                                                                    });
                                                                }, 150);
                                                            }}
                                                        >
                                                            <IoImages />
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* Hộp Thêm Media File */}
                                                {isOpenAddMediaBox ? (
                                                    <>
                                                        <div className="addMediaBox" ref={addMediaBoxRef}>
                                                            <span className="title">
                                                                <span
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px',
                                                                    }}
                                                                >
                                                                    {/* Nút thêm ảnh/video */}
                                                                    <label
                                                                        className="btnAddMedia"
                                                                        draggable="false"
                                                                        htmlFor="mediaFileID"
                                                                        onClick={(e) => {}}
                                                                    >
                                                                        <IoAddSharp /> Thêm ảnh/video
                                                                    </label>
                                                                </span>
                                                                {/* Nút đóng */}
                                                                <button
                                                                    type="button"
                                                                    className="btnCloseAddMediaBox"
                                                                    onClick={() => {
                                                                        setIsOpenAddMediaBox(false);
                                                                    }}
                                                                >
                                                                    <IoCloseSharp />
                                                                </button>
                                                            </span>
                                                            <div className="mediaListContainer">
                                                                {/* Input Media File */}
                                                                <input
                                                                    className="inputMediaFile"
                                                                    id="mediaFileID"
                                                                    name="mediaFile"
                                                                    type="file"
                                                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/mkv,video/webm,video/avi"
                                                                    multiple
                                                                    // {...register('mediaFiles', {})}
                                                                    onChange={handleAddMedia}
                                                                    style={{
                                                                        opacity: '0',
                                                                        width: '0px',
                                                                        height: '0px',
                                                                    }}
                                                                />
                                                                {/* Danh sách ảnh/video đã thêm */}
                                                                <div
                                                                    className="mediaList"
                                                                    ref={mediaList}
                                                                    style={{
                                                                        width:
                                                                            previewMediaFiles.length > 0 ? '' : '100%',
                                                                    }}
                                                                >
                                                                    {/* Render ảnh/video đã chọn */}
                                                                    {previewMediaFiles.length > 0 ? (
                                                                        <>
                                                                            {previewMediaFiles.map(
                                                                                (previewMediaFile, index) => (
                                                                                    <>
                                                                                        {previewMediaFile.type ===
                                                                                        'image' ? (
                                                                                            <div
                                                                                                key={index}
                                                                                                className="previewMediaFilesContainer"
                                                                                            >
                                                                                                <img
                                                                                                    key={index + 'img'}
                                                                                                    src={
                                                                                                        previewMediaFile.preview
                                                                                                    }
                                                                                                />
                                                                                                <button
                                                                                                    className="btnRemove"
                                                                                                    key={
                                                                                                        index +
                                                                                                        'btnRemove'
                                                                                                    }
                                                                                                    type="button"
                                                                                                    onClick={() => {
                                                                                                        handleRemoveAddMedia(
                                                                                                            previewMediaFile.id,
                                                                                                        );
                                                                                                    }}
                                                                                                >
                                                                                                    <IoCloseSharp />
                                                                                                </button>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div
                                                                                                key={index}
                                                                                                className="previewMediaFilesContainer"
                                                                                            >
                                                                                                <video
                                                                                                    key={
                                                                                                        index + 'video'
                                                                                                    }
                                                                                                    src={
                                                                                                        previewMediaFile.preview
                                                                                                    }
                                                                                                    playsInline
                                                                                                    controls
                                                                                                />
                                                                                                <button
                                                                                                    className="btnRemove"
                                                                                                    key={
                                                                                                        index +
                                                                                                        'btnRemove'
                                                                                                    }
                                                                                                    type="button"
                                                                                                    onClick={() => {
                                                                                                        handleRemoveAddMedia(
                                                                                                            previewMediaFile.id,
                                                                                                        );
                                                                                                    }}
                                                                                                >
                                                                                                    <IoCloseSharp />
                                                                                                </button>
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                ),
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <span
                                                                            style={{
                                                                                color: 'whitesmoke',
                                                                                fontFamily: 'sans-serif',
                                                                                fontSize: '15px',
                                                                                fontWeight: '400',
                                                                                textAlign: 'center',
                                                                                display: 'block',
                                                                                width: '100%',
                                                                                padding: '66.5px 0px',
                                                                            }}
                                                                        >
                                                                            Chưa chọn ảnh/video nào
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
                                    </div>
                                    <div className="bottom"></div>
                                </div>
                            </div>
                            {/* Nút Submit Form Create Article */}
                            <button
                                type="button"
                                className="btnCreate btnSubmit"
                                onClick={() => {
                                    handleBtnCreate();
                                }}
                            >
                                Tạo
                            </button>
                            {/* Menu Xem trước bài viết chuẩn bị tạo */}
                            {isOpenPreviewArticle === true && location.pathname.split('/')[2] === 'upload' ? (
                                <div className="settingMenuContainer" style={{ top: 0, height: '99%' }}>
                                    <div className="settingMenu" style={{ width: 'max-content' }}>
                                        <span className="title" style={{ position: 'relative' }}>
                                            <span style={{ fontFamily: 'sans-serif' }}>Xem trước</span>
                                            {/* Nút thoát */}
                                            <button
                                                className=""
                                                type="button"
                                                style={{
                                                    position: 'absolute',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '5px',
                                                    top: '0',
                                                    right: '0',
                                                }}
                                                onClick={() => {
                                                    setIsOpenPreviewArticle(false);
                                                }}
                                            >
                                                <IoCloseSharp />
                                            </button>
                                        </span>
                                        {/* Mẫu bài viết xem trước */}
                                        <div style={{ padding: '12px', borderBottom: '0.5px solid #777' }}>
                                            <div className="article">
                                                <div className="left">
                                                    {/* Avatar */}
                                                    <div className="userAvatar">
                                                        <Link
                                                            // to={`/profile/${auth?.user?.userName}`}
                                                            style={{ textDecoration: 'none' }}
                                                        >
                                                            <img
                                                                src={
                                                                    auth?.user?.userAvatar
                                                                        ? process.env.REACT_APP_BACKEND_URL +
                                                                          auth?.user?.userAvatar
                                                                        : defaultAvatar
                                                                }
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="right">
                                                    <div className="top">
                                                        <div className="articleInfo">
                                                            <Link
                                                                // to={`/profile/${auth?.user?.userName}`}
                                                                style={{ textDecoration: 'none' }}
                                                            >
                                                                <span className="userName">{auth?.user?.userName}</span>
                                                            </Link>
                                                            {/* Privacy */}
                                                            <span
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                {watch('privacy') === '0' ? (
                                                                    <IoGlobeOutline style={{ color: 'dimgray' }} />
                                                                ) : (
                                                                    <IoLockClosedOutline style={{ color: 'dimgray' }} />
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="articleOptions">
                                                            <button
                                                                type="button"
                                                                className="btnArticleOptions"
                                                                style={{
                                                                    margin: '0',
                                                                    padding: '3px',
                                                                    borderRadius: '0px',
                                                                }}
                                                            >
                                                                <VscEllipsis></VscEllipsis>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="middle">
                                                        <div className="content">
                                                            {/* Nội dung textContent */}
                                                            <div className="text">{watch('textContent')}</div>
                                                            {/* Slide Media */}
                                                            <div className="media">
                                                                {/* Carousel Media Xem trước */}
                                                                <div className="carouselMedia">
                                                                    {/* Render Carousel Media Xem Trước */}
                                                                    {previewMediaFiles.length > 0 ? (
                                                                        <>
                                                                            <Slider
                                                                                ref={(slider) => {
                                                                                    sliderRef = slider;
                                                                                }}
                                                                                {...settings}
                                                                            >
                                                                                {previewMediaFiles.map(
                                                                                    (previewMediaFile, index) => (
                                                                                        <Fragment key={index}>
                                                                                            <div className="mediaContainer">
                                                                                                {previewMediaFile.type ===
                                                                                                'image' ? (
                                                                                                    <img
                                                                                                        src={
                                                                                                            previewMediaFile?.preview
                                                                                                        }
                                                                                                        className="slide-image"
                                                                                                        style={{}}
                                                                                                    />
                                                                                                ) : (
                                                                                                    <video
                                                                                                        src={
                                                                                                            previewMediaFile.preview
                                                                                                        }
                                                                                                        style={{}}
                                                                                                        playsInline
                                                                                                        controls
                                                                                                    />
                                                                                                )}
                                                                                            </div>
                                                                                        </Fragment>
                                                                                    ),
                                                                                )}
                                                                            </Slider>
                                                                            {previewMediaFiles.length >= 2 && (
                                                                                <>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btnPrevCarousel"
                                                                                        onClick={previous}
                                                                                    >
                                                                                        <VscChevronLeft />
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btnNextCarousel"
                                                                                        onClick={next}
                                                                                    >
                                                                                        <VscChevronRight />
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bottom"></div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Nút Submit Form Create Article */}
                                        <button
                                            type="submit"
                                            id="btnSubmitID"
                                            className="btnSignOut"
                                            onClick={() => {
                                                // setIsOpenPreviewArticle(false);
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '10px 105px',
                                                gap: '10px',
                                                marginBottom: '5px',
                                            }}
                                        >
                                            {/* <IoMusicalNotesOutline />{' '} */}
                                            <span style={{ display: 'block', width: '100%', textAlign: 'center' }}>
                                                Xác nhận
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                            {/* Check Data */}
                            <pre style={{ color: 'red' }} hidden>
                                {JSON.stringify(watch(), null, 2)}
                            </pre>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default UploadArticlePage;

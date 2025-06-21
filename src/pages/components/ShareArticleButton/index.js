import { message } from 'antd';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    IoAlertCircleOutline,
    IoCloseSharp,
    IoGlobeOutline,
    IoLockClosedOutline,
    IoShareSocialOutline,
} from 'react-icons/io5';
import { VscChevronLeft, VscChevronRight, VscEllipsis } from 'react-icons/vsc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import UserName from '../UserName';
import Slider from 'react-slick';
import { shareArticleApi } from '~/utils/api';

function ShareArticleButton({ articleData }) {
    // State
    const [isOpenShareArticleBox, setIsOpenShareArticleBox] = useState(false);
    const [loadingShareArticle, setLoadingShareArticle] = useState();

    // Context
    const { auth } = useContext(AuthContext);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // Message (Ant Design)
    const [messageApi, contextHolder] = message.useMessage();

    // React Hook Form (Form Upload Article)
    const formShareArticle = useForm();
    const { register, handleSubmit, formState, watch, setError, clearErrors, setFocus } = formShareArticle;
    const { errors } = formState;

    // Ref
    const shareArticleBoxRef = useRef(null);
    const shareArticleBoxContainerRef = useRef(null);

    // Config Carousel Media (React Slick)
    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };
    const settings = {
        dots: articleData?.mediaContent.length > 1 ? true : false,
        arrows: false,
        infinite: articleData?.mediaContent.length > 1 ? true : false,
        draggable: articleData?.mediaContent.length > 1 ? true : false,
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
                    draggable: articleData?.mediaContent.length > 1 ? true : false,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    draggable: articleData?.mediaContent.length > 1 ? true : false,
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
                    draggable: articleData?.mediaContent.length > 1 ? true : false,
                },
            },
        ],
    };

    // --- HANDLE FUNCTION ---
    // Đóng Share Article Box khi click ra ngoài
    // useEffect(() => {
    //     const handleClickOutsideCommentOptions = (event) => {
    //         if (shareArticleBoxRef.current && !shareArticleBoxRef.current.contains(event.target)) {
    //             setIsOpenShareArticleBox(false);
    //         }
    //     };
    //     document.addEventListener('mousedown', handleClickOutsideCommentOptions);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutsideCommentOptions);
    //     };
    // }, []);
    // Format thời gian tạo bài viết
    const timeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const seconds = Math.floor((now - past) / 1000);
        const intervals = [
            { label: 'năm', seconds: 31536000 },
            { label: 'tháng', seconds: 2592000 },
            { label: 'tuần', seconds: 604800 },
            { label: 'ngày', seconds: 86400 },
            { label: 'giờ', seconds: 3600 },
            { label: 'phút', seconds: 60 },
            { label: 'giây', seconds: 1 },
        ];
        for (let i = 0; i < intervals.length; i++) {
            const interval = Math.floor(seconds / intervals[i].seconds);
            if (interval >= 1) {
                return `${interval} ${intervals[i].label} trước`;
            }
        }
        return 'vừa xong';
    };
    // Format thời gian tạo bài viết (timestamp) sang định dạng "dd/mm/yyyy HH:MM"
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day} Tháng ${month}, ${year} lúc ${hours}:${minutes}`;
    };
    // Handle Submit Form Upload Article
    const onSubmit = async (data) => {
        const articleId = articleData?.articleId;
        // Loading ... (Ant Design Message)
        setLoadingShareArticle(true);
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
                // Call API Share Article
                const res = await shareArticleApi(articleId, data);
                if (res?.status === 200 && res?.message === 'Chia sẻ bài viết thành công') {
                    // Chia sẻ bài viết thành công
                    message.success({
                        content: 'Chia sẻ bài viết thành công',
                        duration: 1.5,
                        style: {
                            color: 'white',
                            marginTop: '58.4px',
                        },
                    });
                    // Tắt hộp share article
                    setIsOpenShareArticleBox(false);
                    // Set Loading Share Article
                    setLoadingShareArticle(true);
                } else if (res?.status === 200 && res?.message === 'Đã chia sẻ bài viết trước đó') {
                    // Đã chia sẻ bài viết trước đó
                    message.info({
                        content: 'Bạn đã chia sẻ bài viết này trước đó',
                        duration: 1.5,
                        style: {
                            color: 'white',
                            marginTop: '58.4px',
                        },
                    });
                    // Set Loading Share Article
                    setLoadingShareArticle(true);
                } else {
                    // Chia sẻ bài viết không thành công
                    message.error({
                        content: 'Có lỗi xảy ra',
                        duration: 1.5,
                        style: {
                            color: 'white',
                            marginTop: '58.4px',
                        },
                    });
                    // Set Loading Share Article
                    setLoadingShareArticle(false);
                }
            });
    };

    return (
        <>
            {/* Nút chia sẻ */}
            <button type="button" className="btnShare" id="btnShareID" onClick={() => setIsOpenShareArticleBox(true)}>
                <IoShareSocialOutline /> 0
            </button>
            {/* Hộp chia sẻ bài viết */}
            {isOpenShareArticleBox && (
                <div className="shareArticleBoxContainer" ref={shareArticleBoxContainerRef}>
                    <div className="shareArticleBox" ref={shareArticleBoxRef}>
                        {/* Phần nhập nội dung muốn chia sẻ */}
                        <div className="uploadArticlePage">
                            {/* Tiêu đề */}
                            <div className="tabSwitchProfile">
                                <div className="profileUserName">
                                    <span>Chia sẻ bài viết</span>
                                </div>
                                <div className="btnComeBackBox">
                                    <button
                                        className="btnComeBack tooltip"
                                        onClick={() => setIsOpenShareArticleBox(false)}
                                    >
                                        <IoCloseSharp />
                                        <span class="tooltiptext">Thoát</span>
                                    </button>
                                </div>
                            </div>
                            {/* Upload Article */}
                            <div className="feedPage">
                                {/* Ant Design Message */}
                                {contextHolder}
                                <div className="articleContainer">
                                    {/* Form Upload Article */}
                                    <form
                                        className="uploadArticleForm"
                                        onSubmit={handleSubmit(onSubmit)}
                                        method="POST"
                                        noValidate
                                    >
                                        {/* Mẫu bài viết để nhập */}
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
                                                        {/* <button type="button" className="btnArticleOptions">
                                                            <VscEllipsis></VscEllipsis>
                                                        </button> */}
                                                    </div>
                                                </div>
                                                <div className="middle">
                                                    <div
                                                        className="content"
                                                        style={{
                                                            maxHeight: '550px',
                                                            overflowX: 'hidden',
                                                            overflowY: 'auto',
                                                            padding: '1px',
                                                            margin: '-1px',
                                                        }}
                                                    >
                                                        {/* Nhập nội dung sharedTextContent */}
                                                        <textarea
                                                            // ref={textContentInput}
                                                            className="text"
                                                            placeholder="Hãy chia sẻ thêm về nội dung này..."
                                                            spellCheck="false"
                                                            {...register('sharedTextContent', {
                                                                maxLength: {
                                                                    value: 1500,
                                                                    message:
                                                                        'Nội dung bài viết không được quá 1500 ký tự',
                                                                },
                                                            })}
                                                            // onChange={() => {
                                                            //     console.log(errors.sharedTextContent?.message);
                                                            // }}
                                                            style={{
                                                                background: 'transparent',
                                                                // background: 'rgb(18 18 18 / 40%)',
                                                                borderRadius: '5px',
                                                                border: '.5px solid transparent',
                                                                fontFamily: "'Funnel Sans', sans-serif",
                                                                maxWidth: 'max-content',
                                                                minWidth: '100%',
                                                                height: 'max-content',
                                                                maxHeight: '350px',
                                                                minHeight: 'max-content',
                                                                padding: '0px 0px 8px 0px',
                                                                marginBottom: '8px',
                                                                marginTop: '5px',
                                                            }}
                                                        />
                                                        {/* Validate Error Text Content */}
                                                        {errors.sharedTextContent?.message ? (
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
                                                                <IoAlertCircleOutline />{' '}
                                                                {errors.sharedTextContent?.message}
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                        {/* Article was shared */}
                                                        <div className="articleDetail">
                                                            {/* Nội dung bài viết */}
                                                            <div className="article">
                                                                <div className="left">
                                                                    {/* Avatar */}
                                                                    <div className="userAvatar">
                                                                        <Link>
                                                                            <img
                                                                                src={
                                                                                    articleData?.User?.userAvatar
                                                                                        ? process.env
                                                                                              .REACT_APP_BACKEND_URL +
                                                                                          articleData?.User?.userAvatar
                                                                                        : defaultAvatar
                                                                                }
                                                                            />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <div className="right">
                                                                    <div className="top">
                                                                        <div className="articleInfo">
                                                                            {/* User Name */}
                                                                            <Link style={{ textDecoration: 'none' }}>
                                                                                <span className="userName">
                                                                                    {articleData?.User?.userName}
                                                                                </span>
                                                                            </Link>
                                                                            {/* Privacy */}
                                                                            <span
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    marginRight: '3px',
                                                                                }}
                                                                            >
                                                                                {articleData?.privacy === '0' ? (
                                                                                    <IoGlobeOutline
                                                                                        style={{ color: 'dimgray' }}
                                                                                    />
                                                                                ) : (
                                                                                    <IoLockClosedOutline
                                                                                        style={{ color: 'dimgray' }}
                                                                                    />
                                                                                )}
                                                                            </span>
                                                                            {/* Created At */}
                                                                            <span className="createdAt tooltip">
                                                                                {timeAgo(articleData?.createdAt)}
                                                                                <span class="tooltiptext">
                                                                                    {formatTimestamp(
                                                                                        articleData?.createdAt,
                                                                                    )}
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <div className="articleOptions">{/*  */}</div>
                                                                    </div>
                                                                    <div className="middle">
                                                                        <div className="content">
                                                                            <div className="text">
                                                                                {articleData?.textContent}
                                                                            </div>
                                                                            <div className="media">
                                                                                {/* Render Carousel Media */}
                                                                                {articleData?.mediaContent.length <=
                                                                                0 ? (
                                                                                    <></>
                                                                                ) : (
                                                                                    <>
                                                                                        <div className="carouselMedia">
                                                                                            <Slider
                                                                                                ref={(slider) => {
                                                                                                    sliderRef = slider;
                                                                                                }}
                                                                                                {...settings}
                                                                                            >
                                                                                                {articleData?.mediaContent.map(
                                                                                                    (media, index) => (
                                                                                                        <Fragment
                                                                                                            key={index}
                                                                                                        >
                                                                                                            <div className="mediaContainer">
                                                                                                                {media.type ===
                                                                                                                'photo' ? (
                                                                                                                    <>
                                                                                                                        <img
                                                                                                                            src={
                                                                                                                                process
                                                                                                                                    .env
                                                                                                                                    .REACT_APP_BACKEND_URL +
                                                                                                                                media.photoLink
                                                                                                                            }
                                                                                                                            className="slide-image"
                                                                                                                            style={{}}
                                                                                                                        />
                                                                                                                    </>
                                                                                                                ) : (
                                                                                                                    <video
                                                                                                                        src={
                                                                                                                            process
                                                                                                                                .env
                                                                                                                                .REACT_APP_BACKEND_URL +
                                                                                                                            media.videoLink
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
                                                                                            {articleData?.mediaContent
                                                                                                .length >= 2 && (
                                                                                                <>
                                                                                                    <button
                                                                                                        className="btnPrevCarousel"
                                                                                                        onClick={
                                                                                                            previous
                                                                                                        }
                                                                                                        type="button"
                                                                                                    >
                                                                                                        <VscChevronLeft />
                                                                                                    </button>
                                                                                                    <button
                                                                                                        className="btnNextCarousel"
                                                                                                        onClick={next}
                                                                                                        type="button"
                                                                                                    >
                                                                                                        <VscChevronRight />
                                                                                                    </button>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bottom">{/*  */}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bottom"></div>
                                            </div>
                                        </div>
                                        {/* Nút Submit Form Create Article */}
                                        <button
                                            type="submit"
                                            className={`btnCreate btnSubmit ${
                                                loadingShareArticle ? 'btnCreateDisabled' : ''
                                            }`}
                                            disabled={loadingShareArticle}
                                        >
                                            {loadingShareArticle ? 'Đã chia sẻ' : 'Chia sẻ ngay'}
                                        </button>
                                        {/* Check Data */}
                                        <pre style={{ color: 'red' }} hidden>
                                            {JSON.stringify(watch(), null, 2)}
                                        </pre>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ShareArticleButton;

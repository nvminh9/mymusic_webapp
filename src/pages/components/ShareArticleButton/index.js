import { message } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoAlertCircleOutline, IoCloseSharp, IoShareSocialOutline } from 'react-icons/io5';
import { VscChevronLeft, VscEllipsis } from 'react-icons/vsc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/auth.context';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';

function ShareArticleButton() {
    // State
    const [isOpenShareArticleBox, setIsOpenShareArticleBox] = useState(false);

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
    // Handle Submit Form Upload Article
    const onSubmit = async (data) => {
        //
    };
    // Handle Button Next Step (Tiếp theo)
    const handleBtnNextStep = () => {
        //
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
                                                        to={`/profile/${auth?.user?.userName}`}
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
                                                        {/* Nhập nội dung sharedTextContent */}
                                                        <textarea
                                                            // ref={textContentInput}
                                                            className="text"
                                                            placeholder="Có gì mới?"
                                                            spellCheck="false"
                                                            {...register('textContent', {
                                                                required: 'Chưa nhập nội dung bài viết',
                                                                maxLength: {
                                                                    value: 1500,
                                                                    message:
                                                                        'Nội dung bài viết không được quá 1500 ký tự',
                                                                },
                                                            })}
                                                            // onChange={() => {
                                                            //     console.log(errors.textContent?.message);
                                                            // }}
                                                            style={{
                                                                background: 'transparent',
                                                                // background: 'rgb(18 18 18 / 40%)',
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
                                                handleBtnNextStep();
                                            }}
                                        >
                                            Tiếp theo
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

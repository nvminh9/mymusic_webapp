import { message } from 'antd';
import { Fragment, useCallback, useContext, useRef, useState } from 'react';
import { VscChevronLeft } from 'react-icons/vsc';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageAmbilight from '../components/ImageAmbilight';
import {
    IoAddSharp,
    IoAlertCircleOutline,
    IoAlertSharp,
    IoArrowUpSharp,
    IoCheckmarkSharp,
    IoCloseCircleSharp,
    IoCloseSharp,
    IoImageOutline,
    IoPencilSharp,
    IoPlaySharp,
    IoSyncSharp,
    IoTimeOutline,
} from 'react-icons/io5';
import MusicCard from '../components/MusicCard';
import { useForm } from 'react-hook-form';
import noContentImage from '~/assets/images/no_content.jpg';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { AuthContext } from '~/context/auth.context';
import { createPlaylistApi, getFollowsApi } from '~/utils/api';
import { debounce } from 'lodash';
import UserTag from '../components/UserTag';

function CreatePlaylistPage() {
    // State
    const [coverImageFile, setCoverImageFile] = useState(); // File Cover Image
    const [previewCoverImageFile, setPreviewCoverImageFile] = useState(); // Preview for Cover Image
    const [isCoverImageFileNotValid, setIsCoverImageFileNotValid] = useState(false);
    const [userTagsValue, setUserTagsValue] = useState([]); // Nội dung trong input user tags (Dạng string của các user tags)
    const [suggestionsUserTags, setSuggestionsUserTags] = useState(); // Danh sách user được gợi ý cho User Tags từ API
    const [showSuggestionsUserTags, setShowSuggestionsUserTags] = useState(false); // Có đang hiển thị danh sách gợi ý không
    const [tagStartIndex, setTagStartIndex] = useState(null); // Vị trí bắt đầu của tag (dấu @)
    const [createProgressStatus, setCreateProgressStatus] = useState();

    // Context
    const { auth } = useContext(AuthContext);

    // Ref
    const addCoverImageInputRef = useRef(null); // Input Cover Image Ref
    const userTagsInputRef = useRef(null); // Input User Tag Ref

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // React Hook Form
    const formCreatePlaylist = useForm();
    const { register, handleSubmit, formState, watch, setError, clearErrors, setFocus } = formCreatePlaylist;
    const { errors } = formState;

    // Message (Ant Design)
    const [messageApi, contextHolder] = message.useMessage();

    // --- HANDLE FUNCTION ---
    // Handle on submit form
    const onSubmit = async (data) => {
        //
        // console.log(data);
        // console.log(userTagsValue);
        const { name, type, privacy } = data;
        let userTags = '';
        userTagsValue?.forEach((item) => {
            if (item?.tag) {
                userTags += item.tag;
            }
        });
        // Form Data
        const formData = new FormData();
        if (name) formData.append('name', name);
        if (type) formData.append('type', type);
        if (privacy) formData.append('privacy', privacy);
        if (userTags) formData.append('userTags', userTags);
        if (coverImageFile) formData.append('playlistCoverImage', coverImageFile);
        // Start Upload
        try {
            // Set Upload Progress Status
            setCreateProgressStatus({
                status: 'pending',
                isLoading: true,
            });
            // Call API
            const res = await createPlaylistApi(formData);
            if (res?.status === 200 && res?.message === 'Tạo danh sách phát thành công') {
                // Nếu tạo thành công
                setCreateProgressStatus({
                    status: 'success',
                    isLoading: true, // true để tránh trường hợp người dùng bấm thêm lần nữa trước khi navigate
                });
                // Tạo danh sách phát thành công
                message.success({
                    content: 'Đã tạo danh sách phát',
                    duration: 1.5,
                    style: {
                        color: 'white',
                        marginTop: '58.4px',
                    },
                });
                // Navigate về
                // const navigateToProfileTimeout = setTimeout(() => {
                //     navigate(`/profile/${auth?.user?.userName}/musics`);
                // }, 600);
                const navigateTimeout = setTimeout(() => {
                    navigate(-1);
                }, 600);
                // return
                return () => {
                    clearTimeout(navigateTimeout);
                };
            } else {
                // Nếu tạo không thành công (có thể bị lỗi ở service hoặc file quá lớn)
                setCreateProgressStatus({
                    status: 'fail',
                    isLoading: false,
                });
                // Tạo danh sách phát không thành công
                message.error({
                    content: 'Tạo không thành công, hãy thử tải lại trang',
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
            setCreateProgressStatus({
                status: 'error',
                isLoading: false,
            });
            // Tạo không thành công
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
    };
    // Handle add cover image
    const handleAddCoverImage = (e) => {
        //
        document.getElementById('areaUploadCoverImageFileID').style.outline = 'rgba(135, 135, 135, 0.15) dotted 3px';
        document.getElementById('areaUploadCoverImageFileID').style.background = 'transparent';
        // File không hợp lệ
        if (!e.target.files[0]?.type?.startsWith('image/')) {
            setIsCoverImageFileNotValid(true);
            addCoverImageInputRef.current.value = '';
            return;
        }
        // Set coverImageFile
        if (e.target.files[0] && e.target.files[0]?.type?.startsWith('image/')) {
            setCoverImageFile(e.target.files[0]);
            // Set Preview File Cover Image
            const previewCoverImageFileLink = URL.createObjectURL(e.target.files[0]);
            setPreviewCoverImageFile(previewCoverImageFileLink);
            setIsCoverImageFileNotValid(false);
            addCoverImageInputRef.current.value = '';
            //
            return () => {
                URL.revokeObjectURL(previewCoverImageFileLink);
            };
        }
    };
    // Handle remove cover image
    const handleRemoveCoverImage = (e) => {
        if (previewCoverImageFile) {
            setCoverImageFile();
            setPreviewCoverImageFile();
            if (addCoverImageInputRef.current) {
                addCoverImageInputRef.current.value = '';
            }
            return;
        }
    };
    // Handle Add User Tag (Fetch and show user suggestion)
    const handleBtnAddUserTags = (e) => {
        if (showSuggestionsUserTags) {
            setShowSuggestionsUserTags(false);
        } else {
            handleFetchUsers();
            setShowSuggestionsUserTags(true);
        }
    };
    // Handle fetch users for autocomplete user tags (Debounce)
    const handleFetchUsers = useCallback(
        debounce(async (query) => {
            try {
                // Call API Lấy danh sách đang theo dõi (Tạm dùng để gợi ý user tags)
                const res = await getFollowsApi(auth?.user?.userName);
                // Set state suggestions user (Tạm để setTimeout 300ms)
                const setSuggestionsTimeout = setTimeout(() => {
                    setSuggestionsUserTags(res?.data?.rows);
                }, 300);
                // Set state show suggestions
                setShowSuggestionsUserTags(true);
                //
                return () => {
                    clearTimeout(setSuggestionsTimeout);
                };
            } catch (error) {
                console.log('Error fetching users: ', error);
                setSuggestionsUserTags([]);
                setShowSuggestionsUserTags(false);
                return;
            }
        }, 400),
        [],
    );
    // Handle select (Chọn user từ autocomplete)
    const handleSelect = (user) => {
        // Info data của user tag
        const userTagInfoData = suggestionsUserTags?.find(
            (item) => item?.followingUser?.userName === user.userName,
        )?.followingUser;
        // Giá trị user tags mới
        const newUserTagsValue = [...userTagsValue];
        // Check nếu user được chọn đã có trong userTags (tránh tag trùng)
        if (userTagsValue?.find((item) => item?.tag === `@${user.userName}`)) {
            // Không cập nhật userTagsValue
            // Scroll đến thẻ đã tag đó và highlight
            setTimeout(() => {
                document.getElementById(`btnOwnerID${userTagInfoData?.userName}`).scrollIntoView({
                    behavior: 'smooth',
                });
                document.getElementById(`btnOwnerID${userTagInfoData?.userName}`).classList.toggle('highlight');
            }, 200);
        } else {
            // Cập nhật userTagsValue
            newUserTagsValue.push({
                tag: `@${user.userName}`,
                data: userTagInfoData,
            });
            setUserTagsValue(newUserTagsValue);
            // formCreatePlaylist.setValue('userTags', newVal);
            setTimeout(() => {
                document.getElementById('ownerInfoID').scrollTo({
                    top: 0,
                    left: document.getElementById('ownerInfoID').scrollWidth,
                    behavior: 'smooth',
                });
            }, 200);
        }
        // Tắt box show suggestions tags
        setShowSuggestionsUserTags(false);
    };
    // Handle Remove User Tag
    const handleRemoveUserTag = (tagToRemove) => {
        // Remove user tag
        setUserTagsValue((prev) => prev.filter((item) => item?.tag !== tagToRemove));
    };

    return (
        <Fragment>
            {/* Ant Design Message */}
            {contextHolder}
            {/* Create Playlist Page */}
            <div className="createPlaylistPage">
                {/* Thanh chuyển tab */}
                <div className="tabSwitchProfile">
                    <div className="profileUserName">
                        <span style={{ fontFamily: 'system-ui' }}>Tạo danh sách phát</span>
                    </div>
                    <div className="btnComeBackBox">
                        <button type="button" className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div>
                {/* Create Playlist Container */}
                <div className="createPlaylistContainer">
                    <form
                        // className="signUpForm uploadMusicForm"
                        onSubmit={handleSubmit(onSubmit)}
                        method="POST"
                        noValidate
                    >
                        <div className="top">
                            {/* Playlist Info */}
                            <div className="playlistInfo">
                                {/* Cover Image */}
                                <div className="coverImage">
                                    {/* Area Upload Cover Image */}
                                    {coverImageFile && previewCoverImageFile ? (
                                        <div className="previewCoverImageContainer">
                                            <ImageAmbilight
                                                imageSrc={
                                                    previewCoverImageFile ? previewCoverImageFile : noContentImage
                                                }
                                                style={{
                                                    width: '285px',
                                                    height: '285px',
                                                    outline: 'rgba(135, 135, 135, 0.15) solid 1px',
                                                    outlineOffset: '-1px',
                                                    borderRadius: '10px',
                                                }}
                                            />
                                            {/* Nút xóa cover image */}
                                            <button
                                                type="button"
                                                className="btnDeleteCoverImage"
                                                onClick={() => {
                                                    handleRemoveCoverImage();
                                                }}
                                            >
                                                <IoCloseSharp />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className="areaUploadCoverImageFileContainer"
                                            id="areaUploadCoverImageFileID"
                                            onDragOver={(e) => {
                                                if (e.currentTarget) {
                                                    e.currentTarget.style.outline =
                                                        'rgba(255, 255, 255, 0.5019607843) dotted 3px';
                                                    e.currentTarget.style.background = '#89898924';
                                                }
                                            }}
                                            onDragLeave={(e) => {
                                                if (e.currentTarget) {
                                                    e.currentTarget.style.outline =
                                                        'rgba(135, 135, 135, 0.15) dotted 3px';
                                                    e.currentTarget.style.background = 'transparent';
                                                }
                                            }}
                                            style={{
                                                outline: previewCoverImageFile ? 'none' : '',
                                            }}
                                        >
                                            <div className="areaUploadCoverImageFile">
                                                {/* Title */}
                                                <div className="title">
                                                    <IoImageOutline />
                                                    <span>Kéo và thả tệp hình ảnh vào đây</span>
                                                </div>
                                                {/* Định dạng file cover image không hợp lệ */}
                                                {isCoverImageFileNotValid && (
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
                                                            margin: '10px auto',
                                                            marginBottom: '12px',
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
                                                )}
                                                {/* Label for Input cover image */}
                                                <label
                                                    className="labelInputCoverImageFile"
                                                    draggable="false"
                                                    htmlFor="coverImageFileID"
                                                >
                                                    {coverImageFile && previewCoverImageFile ? (
                                                        <>Chọn ảnh khác</>
                                                    ) : (
                                                        <>
                                                            <IoAddSharp /> Thêm ảnh
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                            {/* Input Cover Image */}
                                            <input
                                                ref={addCoverImageInputRef}
                                                className="inputCoverImageFile"
                                                id="coverImageFileID"
                                                name="coverImage"
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                onChange={handleAddCoverImage}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="info">
                                    <span className="type">
                                        {/* Select Type */}
                                        <select className="typeSelect" name="type" id="type" {...register('type', {})}>
                                            <option className="typeOption" value="default">
                                                Danh sách phát
                                            </option>
                                            <option className="typeOption" value="album">
                                                Album
                                            </option>
                                        </select>
                                        {/* Select Privacy */}
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
                                                Riêng tư
                                            </option>
                                        </select>
                                    </span>
                                    <span className="name">
                                        {/* Input Name */}
                                        <input
                                            type="text"
                                            className="nameInput"
                                            name="name"
                                            id="nameInputID"
                                            placeholder="Nhập tiêu đề"
                                            {...register('name', {
                                                required: 'Chưa nhập tiêu đề',
                                                maxLength: {
                                                    value: 500,
                                                    message: 'Tiêu đề không được quá 500 ký tự',
                                                },
                                            })}
                                            spellCheck="false"
                                            autoComplete="off"
                                        />
                                        <label className="labelNameInput" htmlFor="nameInputID">
                                            <IoPencilSharp />
                                        </label>
                                    </span>
                                    {/* Error Input Name */}
                                    {errors.name?.message ? (
                                        <span className="name">
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
                                                    marginTop: '0px',
                                                    borderRadius: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '5px',
                                                }}
                                            >
                                                <IoAlertCircleOutline style={{ fontSize: '14px' }} />{' '}
                                                <span
                                                    style={{
                                                        marginBottom: '1px',
                                                        lineHeight: 'normal',
                                                        fontWeight: '400',
                                                    }}
                                                >
                                                    {errors.name?.message}
                                                </span>
                                            </div>
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    {/* Owner, Feat, Colab User */}
                                    <span className="owner" id="ownerInfoID">
                                        {/* Owner */}
                                        <button
                                            className="btnOwner"
                                            type="button"
                                            style={{
                                                opacity: '0.8',
                                                background: '#171717',
                                            }}
                                            disabled
                                        >
                                            <img
                                                src={
                                                    auth?.user?.userAvatar
                                                        ? process.env.REACT_APP_BACKEND_URL + auth?.user?.userAvatar
                                                        : defaultAvatar
                                                }
                                                draggable="false"
                                            />{' '}
                                            {auth?.user?.userName}
                                        </button>
                                        {/* User Tags (Feat, Colab,...) */}
                                        {/* Render User Tags Added */}
                                        {userTagsValue?.length > 0 &&
                                            userTagsValue?.map((userTag, index) => (
                                                <UserTag
                                                    key={index}
                                                    userName={userTag?.tag?.split('@')[1]}
                                                    userTagData={userTag?.data}
                                                    typeUserTag={'atCreatePlaylist'}
                                                    handleRemoveUserTag={handleRemoveUserTag}
                                                ></UserTag>
                                            ))}
                                        {/* Button Open Box Add User Tags */}
                                        <div className="btnAddUserTagsContainer">
                                            <button
                                                className="btnOwner btnAddUserTags"
                                                type="button"
                                                onClick={() => {
                                                    handleBtnAddUserTags();
                                                }}
                                            >
                                                {showSuggestionsUserTags ? <IoCloseSharp /> : <IoAddSharp />}
                                                {/* Suggestions Box For User Tag */}
                                                {showSuggestionsUserTags && (
                                                    <ul
                                                        className="tagSuggestionsList"
                                                        // id={`tag${
                                                        //     comment?.commentId ? comment?.commentId : articleData?.articleId
                                                        // }`}
                                                        style={{
                                                            height:
                                                                suggestionsUserTags?.length > 3
                                                                    ? '172px'
                                                                    : 'max-content',
                                                            margin: '0',
                                                            position: 'absolute',
                                                            top: '125%',
                                                            right: '0',
                                                        }}
                                                    >
                                                        {suggestionsUserTags?.length > 0 ? (
                                                            <>
                                                                {suggestionsUserTags?.map((user) => (
                                                                    <li
                                                                        className="tag"
                                                                        // key={user?.followingUser?.userId}
                                                                        onClick={() => handleSelect(user)}
                                                                    >
                                                                        {/* Avatar */}
                                                                        <img
                                                                            className="tagAvatar"
                                                                            src={`${
                                                                                user?.followingUser?.userAvatar
                                                                                    ? process.env
                                                                                          .REACT_APP_BACKEND_URL +
                                                                                      user?.followingUser?.userAvatar
                                                                                    : defaultAvatar
                                                                            }`}
                                                                        />
                                                                        {/* Thông tin */}
                                                                        <div className="tagInfo">
                                                                            <span className="userName">
                                                                                {user?.followingUser?.userName}
                                                                            </span>
                                                                            <span
                                                                                className="name"
                                                                                style={{
                                                                                    fontWeight: '400',
                                                                                    lineHeight: 'normal',
                                                                                }}
                                                                            >
                                                                                {user?.followingUser?.name}
                                                                            </span>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: '230px',
                                                                    textAlign: 'center',
                                                                    padding: '20px 0px',
                                                                }}
                                                            >
                                                                <IoSyncSharp
                                                                    className="loadingAnimation"
                                                                    style={{
                                                                        color: 'white',
                                                                        width: '15px',
                                                                        height: '15px',
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </ul>
                                                )}
                                            </button>
                                        </div>
                                    </span>
                                    <span className="detail">
                                        0 bài nhạc
                                        {/* <span className="spaceSymbol">·</span>{' '}
                                        <span className="createdAt"></span> */}
                                    </span>
                                    <div className="playlistControls">
                                        {/* <button className="btnPlayPlaylist" type="submit">
                                            Tạo
                                        </button> */}
                                        {/* Button Submit */}
                                        <button
                                            className="btnPlayPlaylist"
                                            type="submit"
                                            disabled={createProgressStatus?.isLoading}
                                            style={{
                                                opacity: createProgressStatus?.isLoading ? '0.3' : '',
                                                cursor: createProgressStatus?.isLoading ? 'not-allowed' : '',
                                            }}
                                        >
                                            {/* Nếu chưa bấm */}
                                            {!createProgressStatus && <>Tạo</>}
                                            {/* Đang xử lý */}
                                            {createProgressStatus?.status === 'pending' && (
                                                <>
                                                    <IoSyncSharp
                                                        className="loadingAnimation"
                                                        style={{ color: '#ffffff', width: '15px', height: '15px' }}
                                                    />{' '}
                                                    Đang tạo
                                                </>
                                            )}
                                            {/* Thành công */}
                                            {createProgressStatus?.status === 'success' && (
                                                <>
                                                    <IoCheckmarkSharp /> Đã tạo
                                                </>
                                            )}
                                            {/* Không thành công */}
                                            {createProgressStatus?.status === 'fail' && (
                                                <>
                                                    <IoAlertSharp /> Tạo không thành công{' '}
                                                </>
                                            )}
                                            {/* Lỗi */}
                                            {createProgressStatus?.status === 'error' && (
                                                <>
                                                    <IoAlertSharp /> Có lỗi xảy ra
                                                </>
                                            )}
                                        </button>
                                        {/* Add music */}
                                        <button
                                            className="btnPlayPlaylist btnAddMusic"
                                            type="button"
                                            // onClick={handleBtnAddMusic}
                                            style={{
                                                opacity: '0.3',
                                                background: '#dfdfdf',
                                                cursor: 'not-allowed',
                                            }}
                                            disabled
                                        >
                                            <IoAddSharp /> Thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="middle">
                            {/* List Music */}
                            <div className="listMusicContainer">
                                <div className="listMusic">
                                    {/* Head */}
                                    <div className="headListMusic">
                                        <span className="number">#</span>
                                        <span className="music">Bài nhạc</span>
                                        <span className="time">
                                            <IoTimeOutline />
                                        </span>
                                    </div>
                                    {/* Body */}
                                    <div className="bodyListMusic">
                                        <MusicCard typeMusicCard={'Playlist'} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bottom"></div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default CreatePlaylistPage;

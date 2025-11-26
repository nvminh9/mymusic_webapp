import { useLocale } from 'antd/es/locale';
import { Fragment, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VscChevronLeft } from 'react-icons/vsc';
import { useForm } from 'react-hook-form';
import { AuthContext } from '~/context/auth.context';
import { message } from 'antd';
import defaultAvatar from '~/assets/images/avatarDefault.jpg';
import { updateUserProfileInfoApi } from '~/utils/api';
import { EnvContext } from '~/context/env.context';

function ProfileEditPage() {
    console.log('Re load Edit Page....');

    // Context (useContext)
    const { auth, setAuth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);

    // State (useState)
    const [previewAvatarLink, setPreviewAvatarLink] = useState(
        auth?.user?.userAvatar ? env?.backend_url + auth?.user?.userAvatar : defaultAvatar,
    );
    // const [preDescription, setPreDescription] = useState(auth?.user?.description);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // React Hook Form (Form Edit Profile)
    const formEditProfile = useForm();
    const { register, handleSubmit, formState, watch } = formEditProfile;
    const { errors } = formState;

    // Message (Ant Design)
    const [messageApi, contextHolder] = message.useMessage();

    // --- HANDLE FUNCTION ---
    // Old User Data for User Gender
    useEffect(() => {
        // Đổi title trang
        document.title = 'Edit Profile | mymusic: Music from everyone';
        // check if username is different auth userName
        if (!(auth?.user?.userName === location.pathname.split('/')[2])) {
            return navigate(-1);
        }
        if (auth?.user?.gender === 'male') {
            document.getElementsByClassName('labelGenderMale')[0].style.backgroundColor = 'white';
            document.getElementsByClassName('labelGenderMale')[0].style.color = '#000';
            return;
        }
        if (auth?.user?.gender === 'female') {
            document.getElementsByClassName('labelGenderMale')[0].style.backgroundColor = 'white';
            document.getElementsByClassName('labelGenderMale')[0].style.color = '#000';
            return;
        }
        if (auth?.user?.gender === 'other') {
            document.getElementsByClassName('labelGenderMale')[0].style.backgroundColor = 'white';
            document.getElementsByClassName('labelGenderMale')[0].style.color = '#000';
            return;
        }
    }, []);
    // Handle Preview User Avatar
    const handlePreviewUserAvatar = () => {
        // Hủy Link ảo của hình trước đó (tránh Memory Leak)
        let userAvatar = document.getElementById('userAvatar')?.files?.[0];
        console.log(userAvatar);
        if (userAvatar) {
            // If có chọn file
            if (previewAvatarLink) {
                URL.revokeObjectURL(previewAvatarLink);
            }
            // Tạo URL ảo (blob url)
            if (userAvatar) {
                setPreviewAvatarLink(URL.createObjectURL(userAvatar));
            }
            // Gán link ảo vào thẻ img
            if (previewAvatarLink) {
                document.getElementById('userAvatarID').src = previewAvatarLink;
            }
        } else {
            // If ko chọn file (cancle)
        }
    };
    // Handle Submit Form Update Profile
    const onSubmit = async (data) => {
        // console.log(data);
        const { description, gender, userAvatar } = data;
        // Form Data
        const formData = new FormData();
        if (description) formData.append('description', description);
        if (gender) formData.append('gender', gender);
        if (userAvatar) formData.append('userAvatar', userAvatar[0]);
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
                // Call API Update Profile
                const res = await updateUserProfileInfoApi(auth?.user?.userName, formData);
                if (res?.status === 200 && res?.message === 'Cập nhật thông tin người dùng thành công') {
                    // Set Auth
                    setAuth({
                        isAuthenticated: true,
                        user: res?.data?.user ?? {},
                    });
                    // Cập nhật thông tin thành công
                    message.success({
                        content: 'Đã cập nhật thông tin',
                        duration: 1.5,
                        style: {
                            color: 'white',
                            marginTop: '58.4px',
                        },
                    });
                } else {
                    // Cập nhật thông tin không thành công
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

    return (
        <Fragment>
            {/* Thanh chuyển tab */}
            <div className="tabSwitchProfile">
                <div className="profileUserName">
                    <span>Chỉnh sửa trang cá nhân</span>
                </div>
                <div className="btnComeBackBox">
                    <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                        <VscChevronLeft />
                        <span class="tooltiptext">Quay lại</span>
                    </button>
                </div>
            </div>
            {/* Profile Edit Page */}
            <div className="profileEditPage">
                {/* Ant Design Message */}
                {contextHolder}
                {/* Form Edit Profile */}
                <form className="profileEditForm" onSubmit={handleSubmit(onSubmit)} method="POST" noValidate>
                    {/* User Avatar */}
                    <div className="userAvatarWrapper">
                        <div className="userAvatarContainer">
                            <img
                                className="userAvatar"
                                id="userAvatarID"
                                src={previewAvatarLink ? previewAvatarLink : defaultAvatar}
                            />
                        </div>
                        <label className="labelUserAvatar" htmlFor="userAvatar">
                            Đổi ảnh
                        </label>
                        <input
                            className="inputUserAvatar"
                            id="userAvatar"
                            name="userAvatar"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            {...register('userAvatar')}
                            onChange={handlePreviewUserAvatar}
                            // hidden
                        />
                    </div>
                    {/* Description */}
                    <label className="labelDescription" htmlFor="description">
                        Mô tả
                    </label>
                    <textarea
                        className="inputDescription"
                        id="description"
                        name="description"
                        type="text"
                        placeholder={auth?.user?.description ? auth?.user?.description : `Nhập mô tả ...`}
                        {...register('description', {
                            maxLength: {
                                value: 150,
                                message: 'Mô tả không được vượt quá 150 ký tự',
                            },
                        })}
                        onChange={() => {
                            console.log(errors.description?.message);
                        }}
                        style={{
                            width: '100%',
                        }}
                    />
                    <p className="errorMessage">{errors.description?.message}</p>
                    {/* Giới tính */}
                    <label className="labelGender" htmlFor="gender">
                        Giới tính
                    </label>
                    <div className="" style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Nam */}
                        <input
                            className="inputGender"
                            id="genderMale"
                            name="gender"
                            type="radio"
                            value="male"
                            hidden
                            {...register('gender')}
                        />
                        <label
                            className="labelGenderMale"
                            htmlFor="genderMale"
                            style={
                                formEditProfile.getValues('gender') === 'male'
                                    ? { backgroundColor: 'white', color: '#000' }
                                    : {}
                            }
                            onClick={() => {
                                // Female
                                document.getElementsByClassName('labelGenderFemale')[0].style.backgroundColor =
                                    '#121212';
                                document.getElementsByClassName('labelGenderFemale')[0].style.color = 'white';
                                // Other
                                document.getElementsByClassName('labelGenderOther')[0].style.backgroundColor =
                                    '#121212';
                                document.getElementsByClassName('labelGenderOther')[0].style.color = 'white';
                            }}
                        >
                            Nam
                        </label>
                        {/* Nữ */}
                        <input
                            className="inputGender"
                            id="genderFemale"
                            name="gender"
                            type="radio"
                            value="female"
                            hidden
                            {...register('gender')}
                        />
                        <label
                            className="labelGenderFemale"
                            htmlFor="genderFemale"
                            style={
                                formEditProfile.getValues('gender') === 'female'
                                    ? { backgroundColor: 'white', color: '#000' }
                                    : {}
                            }
                            onClick={() => {
                                // Male
                                document.getElementsByClassName('labelGenderMale')[0].style.backgroundColor = '#121212';
                                document.getElementsByClassName('labelGenderMale')[0].style.color = 'white';
                                // Other
                                document.getElementsByClassName('labelGenderOther')[0].style.backgroundColor =
                                    '#121212';
                                document.getElementsByClassName('labelGenderOther')[0].style.color = 'white';
                            }}
                        >
                            Nữ
                        </label>
                        {/* Giới tính khác */}
                        <input
                            className="inputGender"
                            id="genderOther"
                            name="gender"
                            type="radio"
                            value="other"
                            hidden
                            {...register('gender')}
                        />
                        <label
                            className="labelGenderOther"
                            htmlFor="genderOther"
                            style={
                                formEditProfile.getValues('gender') === 'other'
                                    ? { backgroundColor: 'white', color: '#000' }
                                    : {}
                            }
                            onClick={() => {
                                // Male
                                document.getElementsByClassName('labelGenderMale')[0].style.backgroundColor = '#121212';
                                document.getElementsByClassName('labelGenderMale')[0].style.color = 'white';
                                // Female
                                document.getElementsByClassName('labelGenderFemale')[0].style.backgroundColor =
                                    '#121212';
                                document.getElementsByClassName('labelGenderFemale')[0].style.color = 'white';
                            }}
                        >
                            Khác
                        </label>
                    </div>
                    <p className="errorMessage">{errors.gender?.message}</p>
                    {/* Button Submit */}
                    <button className="btnSubmit" type="submit" id="btnSubmitID">
                        Xác nhận
                    </button>
                    {/* Check Data */}
                    <pre style={{ color: 'red' }} hidden>
                        {JSON.stringify(watch(), null, 2)}
                    </pre>
                </form>
            </div>
        </Fragment>
    );
}

export default ProfileEditPage;

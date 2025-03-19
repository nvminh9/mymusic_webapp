import { useLocale } from 'antd/es/locale';
import { Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VscChevronLeft } from 'react-icons/vsc';
import { useForm } from 'react-hook-form';

function ProfileEditPage() {
    // State (useState)

    // Context (useContext)

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // React Hook Form (Form Edit Profile)
    const formEditProfile = useForm();
    const { register, handleSubmit, formState, watch } = formEditProfile;
    const { errors } = formState;

    // --- HANDLE FUNCTION ---
    const onSubmit = () => {
        console.log('On Submit Profile Edit Form');
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
                {/* Form Edit Profile */}
                <form className="profileEditForm" onSubmit={handleSubmit(onSubmit)} method="POST" noValidate>
                    {/* Description */}
                    <label className="labelDescription" htmlFor="description">
                        Mô tả
                    </label>
                    <input
                        className="inputDescription"
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Nhập mô tả ..."
                        {...register('description')}
                    />
                    <p className="errorMessage">{errors.description?.message}</p>
                    {/* Giới tính */}
                    {/* ... */}
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

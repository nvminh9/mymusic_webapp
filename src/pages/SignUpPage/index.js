import logo from '~/assets/images/logoWhiteTransparent.png';
import {
    IoLogoGoogle,
    IoChevronBackSharp,
    IoEyeOffOutline,
    IoEyeOutline,
    IoAlertCircleOutline,
    IoCheckmarkCircleOutline,
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { signUpApi } from '~/utils/api';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
    // State (useState)
    const [formStep, setFormStep] = useState(0); // Mỗi step tương ứng với một thành phần khác nhau trong form
    const [isShowPassword, setIsShowPassword] = useState(false); // Hiển thị mật khẩu
    const [onSubmitMessage, setOnSubmitMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(5);
    const [disabledTimeLeft, setDisabledTimeLeft] = useState(true);

    // React Hook Form (Form Sign Up)
    const formSignUp = useForm();
    const { register, handleSubmit, formState, watch } = formSignUp;
    const { errors } = formState;

    // Navigate
    const navigate = useNavigate();

    // --- HANDLE FUNCTION ---
    // Handle Button Show Password
    const handleBtnShowPassword = () => {
        var inputPassword = document.getElementById('password');
        if (inputPassword.type === 'password') {
            setIsShowPassword(true);
            inputPassword.type = 'text';
        } else {
            setIsShowPassword(false);
            inputPassword.type = 'password';
        }
    };
    // Handle Submit Form Sign Up
    const onSubmit = async (data) => {
        console.log('Form submitted', data);
        // Đến bước tiếp theo
        if (formStep < 2) {
            setFormStep(formStep + 1);
        }
        // Nếu là bước cuối thì thực hiện call API sign up
        if (formStep === 2) {
            console.log('Call API Sign Up');
            const { name, userName, gender, birth, email, password } = data;
            const res = await signUpApi(name, userName, gender, birth, email, password); // Call API Sign Up
            if (res.message === 'Đăng ký thành công') {
                setOnSubmitMessage('Đăng ký thành công');
                setFormStep(3);
                console.log('API Sign Up Response:', res);
                // Chuyển hướng đến trang đăng nhập
                if (disabledTimeLeft && timeLeft === 5) {
                    startCountdown(5);
                }
            } else if (res.status == 409 && res.message === 'Email hoặc tên người dùng đã tồn tại') {
                setOnSubmitMessage(res?.message);
                // console.log('>>> Đăng ký thất bại');
                // console.log('Email hoặc tên người dùng đã tồn tại');
            }
        }
    };
    // Handle Countdown navigate to sign in
    const startCountdown = (time) => {
        if (time > 0) {
            setTimeout(() => {
                setTimeLeft(time - 1);
                startCountdown(time - 1);
                console.log(timeLeft);
            }, 1000);
        } else {
            setDisabledTimeLeft(false);
            // Chuyển hướng sang trang đăng nhập
            navigate('/signin');
        }
    };

    return (
        <>
            <div className="signUpContainer">
                {/* <img className="logo" src={logo} alt="Logo mymusic" draggable="false" /> */}
                <form className="signUpForm" onSubmit={handleSubmit(onSubmit)} method="POST" noValidate>
                    <span className="title">Đăng ký</span>
                    {/* On Submit Error Message */}
                    {onSubmitMessage === 'Email hoặc tên người dùng đã tồn tại' ? (
                        <div className="onSubmitErrorMessage">
                            <span>
                                <IoAlertCircleOutline style={{ marginRight: '5px' }} /> {onSubmitMessage}
                            </span>
                        </div>
                    ) : (
                        <></>
                    )}
                    {onSubmitMessage === 'Đăng ký thành công' ? (
                        <div className="onSubmitErrorMessage" style={{ backgroundColor: '#2ecc71' }}>
                            <span>
                                <IoCheckmarkCircleOutline style={{ marginRight: '5px' }} /> {onSubmitMessage}
                            </span>
                        </div>
                    ) : (
                        <></>
                    )}
                    {/* Step 0 */}
                    {formStep === 0 && (
                        <>
                            {/* Email */}
                            <label className="labelEmail" htmlFor="email">
                                Địa chỉ email
                            </label>
                            <input
                                className="inputEmail"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="example@gmail.com"
                                {...register('email', {
                                    required: `Vui lòng nhập email`,
                                    pattern: {
                                        // value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: `Email này không hợp lệ. Hãy đảm bảo rằng email được nhập dưới dạng example@email.com`,
                                    },
                                })}
                            />
                            <p className="errorMessage">{errors.email?.message}</p>
                        </>
                    )}
                    {/* Step 1 */}
                    {formStep === 1 && (
                        <>
                            <div className="stepProgressBar">
                                <div className="stepProgressBarInner" style={{ width: '50%' }}></div>
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
                                    <span className="step">Bước 1/2</span>
                                    <span>Tạo mật khẩu</span>
                                </div>
                            </div>
                            {/* Mật khẩu */}
                            <label className="labelPassword" htmlFor="password">
                                Mật khẩu
                            </label>
                            <div
                                className=""
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                }}
                            >
                                <input
                                    className="inputPassword"
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    {...register('password', {
                                        required: `Vui lòng nhập mật khẩu`,
                                        minLength: {
                                            value: 10,
                                            message: `Mật khẩu phải chứa ít nhất 10 ký tự`,
                                        },
                                        validate: (value) => {
                                            return (
                                                [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
                                                    pattern.test(value),
                                                ) ||
                                                'Mật khẩu của bạn phải bao gồm ít nhất một chữ cái viết thường, một chữ cái viết hoa, một số và một ký tự đặc biệt (ví dụ: #?!&)'
                                            );
                                        },
                                    })}
                                />
                                <button className="btnShowPassword" type="button" onClick={handleBtnShowPassword}>
                                    {isShowPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                                </button>
                            </div>
                            <p className="errorMessage">{errors.password?.message}</p>
                        </>
                    )}
                    {/* Step 2 */}
                    {formStep === 2 && (
                        <>
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
                                    <span className="step">Bước 2/2</span>
                                    <span>Giới thiệu thông tin</span>
                                </div>
                            </div>
                            {/* Họ và Tên */}
                            <label className="labelName" htmlFor="name">
                                Họ và tên
                            </label>
                            <input
                                className="inputName"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Nhập họ và tên của bạn"
                                {...register('name', {
                                    required: `Vui lòng nhập họ và tên`,
                                    maxLength: {
                                        value: 500,
                                        message: `Họ và tên không được vượt quá 500 ký tự`,
                                    },
                                })}
                            />
                            <p className="errorMessage">{errors.name?.message}</p>
                            {/* Tên người dùng */}
                            <label className="labelUserName" htmlFor="userName">
                                Tên người dùng
                            </label>
                            <input
                                className="inputUserName"
                                id="userName"
                                name="userName"
                                type="text"
                                placeholder="Tên này sẽ xuất hiện trên hồ sơ của bạn"
                                {...register('userName', {
                                    required: `Vui lòng nhập tên người dùng`,
                                    maxLength: {
                                        value: 500,
                                        message: `Tên người dùng không được vượt quá 500 ký tự`,
                                    },
                                })}
                            />
                            <p className="errorMessage">{errors.userName?.message}</p>
                            {/* Ngày sinh */}
                            <label className="labelBirth" htmlFor="birth">
                                Ngày sinh
                            </label>
                            <input
                                className="inputBirth"
                                id="birth"
                                name="birth"
                                type="date"
                                placeholder="Nhập ngày sinh của bạn"
                                {...register('birth', {
                                    required: `Vui lòng nhập ngày sinh`,
                                    // maxLength: {
                                    //     value: 500,
                                    //     message: `Tên người dùng không được vượt quá 500 ký tự`,
                                    // },
                                })}
                            />
                            <p className="errorMessage">{errors.birth?.message}</p>
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
                                    {...register('gender', {
                                        required: `Chọn giới tính của bạn`,
                                    })}
                                />
                                <label
                                    className="labelGenderMale"
                                    htmlFor="genderMale"
                                    style={
                                        formSignUp.getValues('gender') === 'male'
                                            ? { backgroundColor: 'white', color: '#000' }
                                            : {}
                                    }
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
                                    {...register('gender', {
                                        required: `Chọn giới tính của bạn`,
                                    })}
                                />
                                <label
                                    className="labelGenderFemale"
                                    htmlFor="genderFemale"
                                    style={
                                        formSignUp.getValues('gender') === 'female'
                                            ? { backgroundColor: 'white', color: '#000' }
                                            : {}
                                    }
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
                                    {...register('gender', {
                                        required: `Chọn giới tính của bạn`,
                                    })}
                                />
                                <label
                                    className="labelGenderOther"
                                    htmlFor="genderOther"
                                    style={
                                        formSignUp.getValues('gender') === 'other'
                                            ? { backgroundColor: 'white', color: '#000' }
                                            : {}
                                    }
                                >
                                    Khác
                                </label>
                            </div>
                            <p className="errorMessage">{errors.gender?.message}</p>
                        </>
                    )}
                    {/* Button Submit */}
                    {formStep < 2 ? (
                        <button className="btnNextStep" type="submit" id="btnNextStepID">
                            Tiếp theo
                        </button>
                    ) : (
                        <>
                            {formStep === 2 ? (
                                <button className="btnNextStep" type="submit" id="btnNextStepID">
                                    Đăng ký
                                </button>
                            ) : (
                                <button
                                    className="btnNextStep"
                                    type="submit"
                                    id="btnNextStepID"
                                    style={{ fontWeight: '400' }}
                                >{`Chuyển tới trang đăng nhập (${timeLeft})`}</button>
                            )}
                        </>
                    )}
                    {/* Check Data */}
                    <pre style={{ color: 'red' }} hidden>
                        {JSON.stringify(watch(), null, 2)}
                    </pre>
                    {/* Other Sign Up Method */}
                    {formStep === 0 && (
                        <>
                            <div className="otherRegisMethod">
                                <div className="title">
                                    <span>hoặc</span>
                                </div>
                                <a href="#googleRegis" className="regisMethodGoogle">
                                    <IoLogoGoogle className="logoGoogle" />
                                    <span>Đăng ký bằng Google</span>
                                </a>
                            </div>
                            <span className="toSignIn">
                                Bạn đã có tài khoản?{' '}
                                <Link to={`/signin`} style={{ color: 'white', fontWeight: '600' }}>
                                    Đăng nhập tại đây
                                </Link>
                            </span>
                        </>
                    )}
                </form>
            </div>
        </>
    );
}

export default SignUpPage;

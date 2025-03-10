import logo from '~/assets/images/logoWhiteTransparent.png';
import { IoLogoGoogle, IoChevronBackSharp, IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { signInApi, signUpApi } from '~/utils/api';
import { useNavigate } from 'react-router-dom';

function SignInPage() {
    // State (useState)
    const [isShowPassword, setIsShowPassword] = useState(false); // Hiển thị mật khẩu

    // React Hook Form (Form Sign In)
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
        // Call API
        const { email, password } = data;
        const res = await signInApi(email, password);
        // Kiểm tra response
        if (res && res.status === 200 && res.message === 'Đăng nhập thành công') {
            console.log('Đăng nhập thành công');
            // Lưu token vào localStorage
            localStorage.setItem('actk', res.data.accessToken);
            // Chuyển hướng đến trang chủ
            navigate('/');
        } else {
            console.log('>>> Đăng nhập thất bại');
            console.log(res?.message ?? 'Lỗi đăng nhập thất bại');
        }
    };

    return (
        <>
            <div className="signInContainer">
                <img className="logo" src={logo} alt="Logo mymusic" draggable="false" />
                <form className="signInForm" onSubmit={handleSubmit(onSubmit)} method="POST" noValidate>
                    <span className="title">Đăng nhập</span>
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
                    <button className="btnNextStep" type="submit" id="btnNextStepID">
                        Đăng nhập
                    </button>
                    {/* Check Data */}
                    <pre style={{ color: 'red' }} hidden>
                        {JSON.stringify(watch(), null, 2)}
                    </pre>
                    {/* Other Sign In Method */}
                    <>
                        <div className="otherRegisMethod">
                            <div className="title">
                                <span>hoặc</span>
                            </div>
                            <a href="#googleRegis" className="regisMethodGoogle">
                                <IoLogoGoogle className="logoGoogle" />
                                <span>Đăng nhập bằng Google</span>
                            </a>
                        </div>
                        <span className="toSignUp">
                            Bạn chưa có tài khoản?{' '}
                            <Link to={`/signup`} style={{ color: 'white', fontWeight: '600' }}>
                                Đăng ký tại đây
                            </Link>
                        </span>
                    </>
                </form>
            </div>
        </>
    );
}

export default SignInPage;

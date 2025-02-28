import logo from '~/assets/images/logoWhiteTransparent.png';
import { IoLogoGoogle, IoAlertCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function SignUpPage() {
    const formSignUp = useForm();
    const { register, handleSubmit, formState } = formSignUp;
    const { errors } = formState;

    // Check data khi submit form
    const onSubmit = (data) => {
        console.log('Form submitted', data);
    };

    return (
        <>
            <div className="signUpContainer">
                <img className="logo" src={logo} alt="Logo mymusic" draggable="false" />
                <form className="signUpForm" onSubmit={handleSubmit(onSubmit)} method="POST" noValidate>
                    <span className="title">Đăng ký</span>
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
                    <button className="btnNextStep" type="submit" id="btnNextStepID">
                        Tiếp theo
                    </button>
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
                </form>
            </div>
        </>
    );
}

export default SignUpPage;

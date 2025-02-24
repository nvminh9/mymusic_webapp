import logo from '~/assets/images/logoWhiteTransparent.png';
import { Link } from 'react-router-dom';

function SignUpPage() {
    return (
        <>
            <div className="signUpContainer">
                <img className="logo" src={logo} alt="Logo mymusic" draggable="false" />
                <form className="signUpForm" action="#" method="POST">
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
                        required
                    />
                    <button className="btnNextStep" type="submit" id="btnNextStepID">
                        Tiếp theo
                    </button>
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

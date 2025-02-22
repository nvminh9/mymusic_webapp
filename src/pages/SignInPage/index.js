import { Link } from 'react-router-dom';

function SignInPage() {
    return (
        <>
            <h1 style={{ color: 'whitesmoke' }}>Sign In Page</h1>
            <Link to={`/signup`}>Đăng ký</Link>
        </>
    );
}

export default SignInPage;

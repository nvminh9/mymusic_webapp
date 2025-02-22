import { Link } from 'react-router-dom';

function SignUpPage() {
    return (
        <>
            <h1 style={{ color: 'whitesmoke' }}>Sign Up Page</h1>
            <Link to={`/signin`}>Đăng nhập</Link>
        </>
    );
}

export default SignUpPage;

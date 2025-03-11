import logo from '~/assets/images/logoWhiteTransparent.png';

function SignInSignUpLayout({ children }) {
    return (
        <>
            <div className="grid wide wrapper">
                <div className="row container">
                    <div className="col l-12 m-12 c-12 signInSignUpContainer">
                        <img className="logo" src={logo} alt="Logo mymusic" draggable="false" />
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignInSignUpLayout;

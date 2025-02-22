function SignInSignUpLayout({ children }) {
    return (
        <>
            <div className="grid wide wrapper">
                <div className="row container">
                    <div className="col l-12 m-12 c-12">{children}</div>
                </div>
            </div>
        </>
    );
}

export default SignInSignUpLayout;

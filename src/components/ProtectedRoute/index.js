import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '~/context/auth.context';
import { getAuthUserInfoApi } from '~/utils/api';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

function ProtectedRoute({ props }) {
    console.log('>>> Is re-render ...');

    // State (useState)
    // const [isTokenValid, setIsTokenValid] = useState();

    // Context (useContext)
    const { auth, setAuth } = useContext(AuthContext);

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // Check Token
    useEffect(() => {
        // Kiểm tra xem Token có hết hạn hay không khả dụng không
        const checkToken = async () => {
            try {
                const res = await getAuthUserInfoApi();
                if (res?.status == 200) {
                    // Set Auth Context
                    setAuth({
                        isAuthenticated: true,
                        user: res?.data ?? {},
                    });
                    localStorage.setItem('valid', true);
                    console.log('Kiểm tra phiên đăng nhập thành công');
                } else if (res?.status == 401) {
                    // Set Auth Context
                    setAuth({
                        isAuthenticated: false,
                        user: {},
                    });
                    localStorage.setItem('valid', false);
                    console.log('Phiên đăng nhập hết hạn, xin hãy đăng nhập lại');
                }
            } catch (error) {
                console.log('>>> Error: ', error);
            }
        };
        //
        checkToken();
    }, [JSON.parse(localStorage?.getItem('valid'))]); // Có thể thêm location?.pathname vào depen nếu muốn kiểm tra valid mỗi khi chuyển route

    // Nếu token của client còn valid (bằng true) thì sẽ được truy cập vào Home page, ngược lại sẽ chuyển hướng về Sign In
    return JSON.parse(localStorage?.getItem('valid')) === true ? <Outlet /> : <Navigate to={`/signin`} />;
}

export default ProtectedRoute;

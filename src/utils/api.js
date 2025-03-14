import axios from '../utils/axios.customize';

// API Đăng ký
const signUpApi = (name, userName, gender, birth, email, password) => {
    const URL_API = '/v1/api/auth/signup';
    const data = {
        name,
        userName,
        gender,
        birth,
        email,
        password,
    };
    return axios.post(URL_API, data);
};

// API Đăng nhập
const signInApi = (email, password) => {
    const URL_API = '/v1/api/auth/signin';
    const data = {
        email,
        password,
    };
    return axios.post(URL_API, data);
};

// API Đăng xuất
const signOutApi = () => {
    const URL_API = '/v1/api/auth/signout';
    return axios.get(URL_API);
};

// API Lấy thông tin người dùng (theo email)
const getUserInfoApi = (email) => {
    const URL_API = '/v1/api/user/';
    const data = {
        email,
    };
    return axios.post(URL_API, data);
};

// API Lấy thông tin người dùng đang đăng nhập (theo token)
const getAuthUserInfoApi = () => {
    const URL_API = '/v1/api/auth/';
    return axios.get(URL_API);
};

export { signUpApi, signInApi, signOutApi, getAuthUserInfoApi, getUserInfoApi };

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

export { signUpApi, signInApi };

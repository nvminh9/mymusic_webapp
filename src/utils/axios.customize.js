import { message } from 'antd';
import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// Interceptor
// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        // instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        if (localStorage?.getItem('actk')) {
            config.headers.Authorization = `Bearer ${localStorage.getItem('actk')}`;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        if (response && response.data) return response.data;
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        // Handle if token expire or invalid (Nếu token hết hạn hoặc không khả dụng thì set valid thành false)
        if (error?.response?.status === 401) {
            // console.log('>>>> error?.response?.status: ', error?.response?.status);
            // Notify token is expired
            if (error?.response?.data?.error === 'Token is expired or invalid') {
                message.warning({
                    content: 'Phiên đã hết hạn, vui lòng đăng nhập lại',
                    style: {
                        color: 'white',
                    },
                });
            }
            // Set valid trong local storage thành false
            localStorage.setItem('valid', false);
        }

        // Nếu Exception có data thì sẽ trả về data
        if (error?.response?.data) {
            return error?.response?.data;
        }
        return Promise.reject(error);
    },
);

export default instance;

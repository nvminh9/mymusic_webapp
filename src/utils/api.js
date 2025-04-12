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

// API Lấy thông tin profile user
const getUserProfileInfoApi = (userName) => {
    const URL_API = `/v1/api/user/profile/${userName}`;
    return axios.get(URL_API);
};

// API Lấy danh sách người theo dõi
const getFollowersApi = (userName) => {
    const URL_API = `/v1/api/user/profile/${userName}/followers`;
    return axios.get(URL_API);
};

// API Lấy danh sách đang theo dõi
const getFollowsApi = (userName) => {
    const URL_API = `/v1/api/user/profile/${userName}/follows`;
    return axios.get(URL_API);
};

// API Cập nhật profile
const updateUserProfileInfoApi = (userName, data) => {
    const URL_API = `/v1/api/user/profile/${userName}`;
    return axios.patch(URL_API, data);
};

// API Lấy danh sách bài viết của người dùng
const getUserArticlesApi = (userName) => {
    const URL_API = `/v1/api/user/${userName}/articles`;
    return axios.get(URL_API);
};

// API Lấy danh sách bài nhạc của người dùng
const getUserSongsApi = (userName) => {
    const URL_API = `/v1/api/user/${userName}/musics`;
    return axios.get(URL_API);
};

// API Theo dõi người dùng
const createFollowUserApi = (userName) => {
    const URL_API = `/v1/api/user/${userName}/follow`;
    return axios.post(URL_API);
};

// API Hủy theo dõi người dùng
const unfollowUserApi = (userName) => {
    const URL_API = `/v1/api/user/${userName}/unfollow`;
    return axios.patch(URL_API);
};

// API Đăng bài viết
const createArticleApi = (data) => {
    const URL_API = `/v1/api/article/create`;
    return axios.post(URL_API, data);
};

export {
    signUpApi,
    signInApi,
    signOutApi,
    getAuthUserInfoApi,
    getUserInfoApi,
    getUserProfileInfoApi,
    getUserArticlesApi,
    getUserSongsApi,
    updateUserProfileInfoApi,
    createFollowUserApi,
    unfollowUserApi,
    getFollowersApi,
    getFollowsApi,
    createArticleApi,
};

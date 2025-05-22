import axios from '../utils/axios.customize';

// API Đăng ký (POST)
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

// API Đăng nhập (POST)
const signInApi = (email, password) => {
    const URL_API = '/v1/api/auth/signin';
    const data = {
        email,
        password,
    };
    return axios.post(URL_API, data);
};

// API Đăng xuất (GET)
const signOutApi = () => {
    const URL_API = '/v1/api/auth/signout';
    return axios.get(URL_API);
};

// API Lấy thông tin người dùng (theo email) (GET)
const getUserInfoApi = (email) => {
    const URL_API = '/v1/api/user/';
    const data = {
        email,
    };
    return axios.post(URL_API, data);
};

// API Lấy thông tin người dùng đang đăng nhập (theo token) (GET)
const getAuthUserInfoApi = () => {
    const URL_API = '/v1/api/auth/';
    return axios.get(URL_API);
};

// API Lấy thông tin profile user (GET)
const getUserProfileInfoApi = (userName) => {
    const URL_API = `/v1/api/user/profile/${userName}`;
    return axios.get(URL_API);
};

// API Lấy danh sách người theo dõi (GET)
const getFollowersApi = (userName) => {
    const URL_API = `/v1/api/user/profile/${userName}/followers`;
    return axios.get(URL_API);
};

// API Lấy danh sách đang theo dõi (GET)
const getFollowsApi = (userName) => {
    const URL_API = `/v1/api/user/profile/${userName}/follows`;
    return axios.get(URL_API);
};

// API Cập nhật profile (PATCH)
const updateUserProfileInfoApi = (userName, data) => {
    const URL_API = `/v1/api/user/profile/${userName}`;
    return axios.patch(URL_API, data);
};

// API Lấy danh sách bài viết của người dùng (GET)
const getUserArticlesApi = (userName) => {
    const URL_API = `/v1/api/user/${userName}/articles`;
    return axios.get(URL_API);
};

// API Lấy danh sách bài nhạc của người dùng (GET)
const getUserSongsApi = (userName) => {
    const URL_API = `/v1/api/user/${userName}/musics`;
    return axios.get(URL_API);
};

// API Theo dõi người dùng (POST)
const createFollowUserApi = (userName) => {
    const URL_API = `/v1/api/user/${userName}/follow`;
    return axios.post(URL_API);
};

// API Hủy theo dõi người dùng (PATCH)
const unfollowUserApi = (userName) => {
    const URL_API = `/v1/api/user/${userName}/unfollow`;
    return axios.patch(URL_API);
};

// API Đăng bài viết (POST)
const createArticleApi = (data) => {
    const URL_API = `/v1/api/article/create`;
    return axios.post(URL_API, data);
};

// API Chi tiết bài viết
const getArticleApi = (articleId) => {
    const URL_API = `/v1/api/article/${articleId}`;
    return axios.get(URL_API);
};

// API Tạo bình luận bài viết (POST)
const createCommentApi = (data) => {
    const URL_API = `/v1/api/comment/create`;
    return axios.post(URL_API, data);
};

// API Chi tiết bình luận (GET)
const getCommentApi = (commentId) => {
    const URL_API = `/v1/api/comment/${commentId}`;
    return axios.get(URL_API);
};

// API Thích bài viết (POST)
const createLikeArticleApi = (articleId) => {
    const URL_API = `/v1/api/article/${articleId}/like`;
    return axios.post(URL_API);
};

// API Hủy thích bài viết (PATCH)
const unLikeArticleApi = (articleId) => {
    const URL_API = `/v1/api/article/${articleId}/unlike`;
    return axios.patch(URL_API);
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
    getArticleApi,
    createCommentApi,
    getCommentApi,
    createLikeArticleApi,
    unLikeArticleApi,
};

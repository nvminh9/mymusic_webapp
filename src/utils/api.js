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

// API Chi tiết bài viết (GET)
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

// API Thích bình luận (POST)
const createLikeCommentApi = (commentId) => {
    const URL_API = `/v1/api/comment/${commentId}/like`;
    return axios.post(URL_API);
};

// API Hủy thích bình luận (PATCH)
const unLikeCommentApi = (commentId) => {
    const URL_API = `/v1/api/comment/${commentId}/unlike`;
    return axios.patch(URL_API);
};

// API Xóa bình luận (DELETE)
const deleteCommentApi = (commentId) => {
    const URL_API = `/v1/api/comment/${commentId}`;
    return axios.delete(URL_API);
};

// API Xóa bài viết (DELETE)
const deleteArticleApi = (articleId) => {
    const URL_API = `/v1/api/article/${articleId}`;
    return axios.delete(URL_API);
};

// API Chia sẻ bài viết (POST)
const shareArticleApi = (articleId, data) => {
    const URL_API = `/v1/api/article/${articleId}/share`;
    return axios.post(URL_API, data);
};

// API Chi tiết bài chia sẻ (GET)
const getSharedArticleApi = (sharedArticleId) => {
    const URL_API = `/v1/api/sharedArticle/${sharedArticleId}`;
    return axios.get(URL_API);
};

// API Xóa bài chia sẻ (DELETE)
const deleteSharedArticleApi = (sharedArticleId) => {
    const URL_API = `/v1/api/sharedArticle/${sharedArticleId}`;
    return axios.delete(URL_API);
};

// API Thích bài chia sẻ (POST)
const createLikeSharedArticleApi = (sharedArticleId) => {
    const URL_API = `/v1/api/sharedArticle/${sharedArticleId}/like`;
    return axios.post(URL_API);
};

// API Hủy thích bài viết (PATCH)
const unLikeSharedArticleApi = (sharedArticleId) => {
    const URL_API = `/v1/api/sharedArticle/${sharedArticleId}/unlike`;
    return axios.patch(URL_API);
};

// API Tạo bình luận bài viết (POST)
const createCommentSharedArticleApi = (data) => {
    const URL_API = `/v1/api/commentSharedArticle/create`;
    return axios.post(URL_API, data);
};

// API Chi tiết bình luận của bài chia sẻ (GET)
const getCommentSharedArticleApi = (commentId) => {
    const URL_API = `/v1/api/commentSharedArticle/${commentId}`;
    return axios.get(URL_API);
};

// API Thích bình luận của bài chia sẻ (POST)
const createLikeCommentSharedArticleApi = (commentId) => {
    const URL_API = `/v1/api/commentSharedArticle/${commentId}/like`;
    return axios.post(URL_API);
};

// API Hủy thích bình luận của bài chia sẻ (PATCH)
const unLikeCommentSharedArticleApi = (commentId) => {
    const URL_API = `/v1/api/commentSharedArticle/${commentId}/unlike`;
    return axios.patch(URL_API);
};

// API Xóa bình luận của bài chia sẻ (DELETE)
const deleteCommentSharedArticleApi = (commentId) => {
    const URL_API = `/v1/api/commentSharedArticle/${commentId}`;
    return axios.delete(URL_API);
};

// API Lấy dữ liệu của trang Feed (GET)
const getFeedDataApi = (cursor, limit) => {
    const URL_API = `/v1/api/feed?cursor=${cursor}&limit=${limit}`;
    return axios.get(URL_API);
};

// API Đăng tải bài nhạc (POST)
const uploadMusicApi = (data) => {
    const URL_API = `/v1/api/music/upload`;
    return axios.post(URL_API, data);
};

// API Lấy dữ liệu của bài nhạc (GET)
const getSongDataApi = (songId) => {
    const URL_API = `/v1/api/music?s=${songId}`;
    return axios.get(URL_API);
};

// API Lấy dữ liệu của các bài nhạc của user đăng (GET)
const getUserSongsDataApi = (userId) => {
    const URL_API = `/v1/api/music/${userId}`;
    return axios.get(URL_API);
};

// API Tạo danh sách phát (POST)
const createPlaylistApi = (data) => {
    const URL_API = `/v1/api/playlist/create`;
    return axios.post(URL_API, data);
};

// API Lấy dữ liệu của danh sách phát (GET)
const getPlaylistDataApi = (playlistId) => {
    const URL_API = `/v1/api/playlist?p=${playlistId}`;
    return axios.get(URL_API);
};

// API Lấy các danh sách phát của user (GET)
const getListPlaylistOfUserDataApi = (userId) => {
    const URL_API = `/v1/api/playlist/${userId}`;
    return axios.get(URL_API);
};

// API Lấy dữ liệu của lịch sử nghe (GET)
const getListeningHistoryDataApi = (page, limit) => {
    const URL_API = `/v1/api/listeningHistory/data?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
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
    createLikeCommentApi,
    unLikeCommentApi,
    deleteCommentApi,
    deleteArticleApi,
    shareArticleApi,
    getSharedArticleApi,
    createLikeSharedArticleApi,
    unLikeSharedArticleApi,
    createCommentSharedArticleApi,
    getCommentSharedArticleApi,
    createLikeCommentSharedArticleApi,
    unLikeCommentSharedArticleApi,
    deleteCommentSharedArticleApi,
    deleteSharedArticleApi,
    getFeedDataApi,
    uploadMusicApi,
    getSongDataApi,
    getUserSongsDataApi,
    createPlaylistApi,
    getPlaylistDataApi,
    getListPlaylistOfUserDataApi,
    getListeningHistoryDataApi,
};

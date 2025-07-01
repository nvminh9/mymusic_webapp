import { message } from 'antd';
import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { VscChevronLeft } from 'react-icons/vsc';
import { useLocation, useNavigate } from 'react-router-dom';

function UploadMusicPage() {
    // State

    // Context

    // Ref

    // Navigate
    const navigate = useNavigate();
    const location = useLocation();

    // React Hook Form (Form Upload Article)
    const formUploadMusic = useForm();
    const { register, handleSubmit, formState, watch, setError, clearErrors, setFocus } = formUploadMusic;
    const { errors } = formState;

    // Message (Ant Design)
    const [messageApi, contextHolder] = message.useMessage();

    // --- HANDLE FUNCTIONS ---
    const onSubmit = async (data) => {
        console.log(data);
        console.log(document.getElementById('musicFileID').files[0]);
    };

    return (
        <Fragment>
            <div className="uploadMusicPage">
                {/* Thanh chuyển tab */}
                <div className="tabSwitchProfile">
                    <div className="profileUserName">
                        <span style={{ fontFamily: 'system-ui' }}>Đăng bài nhạc mới</span>
                    </div>
                    <div className="btnComeBackBox">
                        <button className="btnComeBack tooltip" onClick={() => navigate(-1)}>
                            <VscChevronLeft />
                            <span class="tooltiptext">Quay lại</span>
                        </button>
                    </div>
                </div>
                {/* Upload Music */}
                <div className="uploadMusic" style={{ backgroundColor: 'white', padding: '10px' }}>
                    {/* Test */}
                    <form className="uploadMusicForm" onSubmit={handleSubmit(onSubmit)} method="POST" noValidate>
                        <input
                            className="inputMusicFile"
                            id="musicFileID"
                            name="musicFile"
                            type="file"
                            accept="audio/*"
                        />
                        {/* Nút Submit */}
                        <button type="submit">Upload</button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default UploadMusicPage;

import { message } from 'antd';
import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import {
    IoAlertCircleOutline,
    IoArrowUpSharp,
    IoCheckmarkCircleOutline,
    IoChevronBackSharp,
    IoCloudUploadOutline,
    IoCloudUploadSharp,
    IoDocumentSharp,
    IoEyeOffOutline,
    IoEyeOutline,
} from 'react-icons/io5';
import { VscChevronLeft } from 'react-icons/vsc';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function UploadMusicPage() {
    // State
    const [formStep, setFormStep] = useState(0); // Mỗi step tương ứng với một thành phần khác nhau trong form
    const [audioFile, setAudioFile] = useState(); // File Audio
    const [previewAudioFile, setPreviewAudioFile] = useState(); // Link Preview File Audio
    const [isAudioFileNotValid, setIsAudioFileNotValid] = useState(false);
    const [isAudioFileEmpty, setIsAudioFileEmpty] = useState(false);

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
    // Handle submit form upload music
    const onSubmit = async (data) => {
        // Chưa chọn file
        if (!audioFile) {
            setIsAudioFileEmpty(true);
            return;
        }
        // File không hợp lệ
        if (!audioFile?.type?.startsWith('audio/')) {
            setIsAudioFileNotValid(true);
            return;
        }
        // Đến bước tiếp theo
        if (formStep < 2) {
            setFormStep(formStep + 1);
            return;
        }
    };
    // Handle onchange upload audio file
    const handleAddAudioFile = (e) => {
        // File không hợp lệ
        if (!e.target.files[0]?.type?.startsWith('audio/')) {
            setIsAudioFileNotValid(true);
            return;
        }
        // Set audioFile
        if (e.target.files[0] && e.target.files[0]?.type?.startsWith('audio/')) {
            setAudioFile(e.target.files[0]);
            // Set Preview File Audio
            const previewAudioFileLink = URL.createObjectURL(e.target.files[0]);
            setPreviewAudioFile(previewAudioFileLink);
            //
            return () => {
                URL.revokeObjectURL(previewAudioFileLink);
            };
        }
    };
    // Đổi bytes sang mb
    const bytesToMB = (bytes) => {
        if (typeof bytes !== 'number' || isNaN(bytes)) return 0;
        return (bytes / (1024 * 1024)).toFixed(2);
    };

    return (
        <Fragment>
            {/* Ant Design Message */}
            {contextHolder}
            <div className="signUpContainer uploadMusicPage">
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
                <div className="uploadMusic">
                    {/* Test */}
                    <form
                        className="signUpForm uploadMusicForm"
                        onSubmit={handleSubmit(onSubmit)}
                        method="POST"
                        noValidate
                    >
                        {/* Step 0 */}
                        {formStep === 0 && (
                            <>
                                {/* Progress Bar */}
                                <div className="progressBox">
                                    <div className="stepProgressBar">
                                        <div className="stepProgressBarInner" style={{ width: '33%' }}></div>
                                    </div>
                                    <div className="stepTitle">
                                        <div className="left">{/*  */}</div>
                                        <div className="right">
                                            <span className="step">Bước 1/3</span>
                                            <span>Tải nhạc lên</span>
                                        </div>
                                        {/* Button Submit */}
                                        {formStep < 2 ? (
                                            <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                Tiếp theo
                                            </button>
                                        ) : (
                                            <>
                                                {formStep === 2 ? (
                                                    <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                        oArrowUpSharp/ Đăng
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btnNextStep"
                                                        type="submit"
                                                        id="btnNextStepID"
                                                        style={{ fontWeight: '400' }}
                                                        onClick={() => {
                                                            navigate('/signin');
                                                        }}
                                                    >{`Chuyển tới trang đăng nhập`}</button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                {/* Audio Upload Box */}
                                <div className="audioUploadBox">
                                    {/* Chỗ để kéo file vào */}
                                    <div
                                        style={{
                                            display: 'grid',
                                            textAlign: 'center',
                                            position: 'relative',
                                            padding: '10px',
                                            background: 'transparent',
                                            borderRadius: '10px',
                                            transition: 'ease-out 0.2s',
                                            transform: 'scale(1)',
                                        }}
                                        onDragOver={(e) => {
                                            if (e.currentTarget) {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                e.currentTarget.style.background = '#89898924';
                                            }
                                        }}
                                        onDragLeave={(e) => {
                                            if (e.currentTarget) {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        {audioFile ? (
                                            <>
                                                <div className="areaDropFile">
                                                    <IoDocumentSharp />
                                                </div>
                                                <span className="fileName">{audioFile?.name}</span>
                                                <span className="fileName">
                                                    Kích thước: {bytesToMB(audioFile?.size)} MB
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="areaDropFile">
                                                    <IoCloudUploadOutline />
                                                </div>
                                                <span
                                                    style={{
                                                        color: '#dfdfdf',
                                                        fontFamily: 'system-ui',
                                                        fontWeight: '400',
                                                    }}
                                                >
                                                    Kéo và thả tệp âm thanh vào đây
                                                </span>
                                                {/* Định dạng tệp không hợp lệ */}
                                                {isAudioFileNotValid ? (
                                                    <span
                                                        className="fileName"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '5px',
                                                            fontSize: '14px',
                                                            fontWeight: '400',
                                                            marginTop: '5px',
                                                        }}
                                                    >
                                                        <IoAlertCircleOutline style={{ color: '#d63031' }} /> Định dạng
                                                        tệp không hợp lệ
                                                    </span>
                                                ) : (
                                                    <>
                                                        {isAudioFileEmpty ? (
                                                            <span
                                                                className="fileName"
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: '5px',
                                                                    fontSize: '14px',
                                                                    fontWeight: '400',
                                                                    marginTop: '5px',
                                                                }}
                                                            >
                                                                <IoAlertCircleOutline style={{ color: '#ffc107' }} />{' '}
                                                                Chưa chọn tệp nào
                                                            </span>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {/* Nút chọn tệp */}
                                        <label className="btnChooseMusicFile" htmlFor="musicFileID" draggable="false">
                                            {audioFile ? 'Chọn tệp khác' : ' Chọn tệp'}
                                        </label>
                                        {/* Input Audio File */}
                                        <input
                                            className="inputMusicFile"
                                            id="musicFileID"
                                            name="musicFile"
                                            type="file"
                                            accept="audio/*"
                                            onChange={handleAddAudioFile}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Step 1 */}
                        {formStep === 1 && (
                            <>
                                {/* Progress Bar */}
                                <div className="progressBox">
                                    <div className="stepProgressBar">
                                        <div className="stepProgressBarInner" style={{ width: '66%' }}></div>
                                    </div>
                                    <div className="stepTitle">
                                        <div className="left">
                                            <button
                                                className="btnReturnPreviousStep"
                                                type="button"
                                                onClick={() => setFormStep(formStep - 1)}
                                            >
                                                <IoChevronBackSharp />
                                            </button>
                                        </div>
                                        <div className="right">
                                            <span className="step">Bước 2/3</span>
                                            <span>Bước 2</span>
                                        </div>
                                        {/* Button Submit */}
                                        {formStep < 2 ? (
                                            <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                Tiếp theo
                                            </button>
                                        ) : (
                                            <>
                                                {formStep === 2 ? (
                                                    <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                        <IoArrowUpSharp /> Đăng
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btnNextStep"
                                                        type="submit"
                                                        id="btnNextStepID"
                                                        style={{ fontWeight: '400' }}
                                                        onClick={() => {
                                                            navigate('/signin');
                                                        }}
                                                    >{`Chuyển tới trang đăng nhập`}</button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                {/* Music Info Fields */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0px 12px',
                                        // backgroundColor: '#f1f3f4',
                                        borderRadius: '6px',
                                    }}
                                >
                                    <audio
                                        src={previewAudioFile}
                                        controls
                                        controlsList="noplaybackrate nodownload"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </>
                        )}
                        {/* Step 2 */}
                        {formStep === 2 && (
                            <>
                                {/* Progress Bar */}
                                <div className="progressBox">
                                    <div className="stepProgressBar">
                                        <div className="stepProgressBarInner" style={{ width: '100%' }}></div>
                                    </div>
                                    <div className="stepTitle">
                                        <div className="left">
                                            <button
                                                className="btnReturnPreviousStep"
                                                type="button"
                                                onClick={() => setFormStep(formStep - 1)}
                                            >
                                                <IoChevronBackSharp />
                                            </button>
                                        </div>
                                        <div className="right">
                                            <span className="step">Bước 3/3</span>
                                            <span>Bước 3</span>
                                        </div>
                                        {/* Button Submit */}
                                        {formStep < 2 ? (
                                            <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                Tiếp theo
                                            </button>
                                        ) : (
                                            <>
                                                {formStep === 2 ? (
                                                    <button className="btnNextStep" type="submit" id="btnNextStepID">
                                                        <IoArrowUpSharp /> Đăng
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btnNextStep"
                                                        type="submit"
                                                        id="btnNextStepID"
                                                        style={{ fontWeight: '400' }}
                                                        onClick={() => {
                                                            navigate('/signin');
                                                        }}
                                                    >{`Chuyển tới trang đăng nhập`}</button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Check Data */}
                        <pre style={{ color: 'red' }} hidden>
                            {JSON.stringify(watch(), null, 2)}
                        </pre>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default UploadMusicPage;

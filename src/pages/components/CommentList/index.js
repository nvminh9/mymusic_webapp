import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Comment from '../Comment';
import { getArticleApi } from '~/utils/api';

function CommentList({ commentListData, onReplyComment, getRespondedComment }) {
    // State
    // const [commentListData, setCommentListData] = useState();

    // Context

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // Refs

    // --- HANDLE FUNCTIONS ---
    useEffect(() => {
        //
    }, []);

    return (
        <>
            {/* Render Comments */}
            {commentListData?.comments?.length <= 0 ? (
                <span
                    style={{
                        textAlign: 'center',
                        color: 'white',
                        fontFamily: 'sans-serif',
                        fontSize: '16px',
                        fontWeight: '400',
                    }}
                ></span>
            ) : (
                <>
                    {/* Title */}
                    <span style={{ color: '#ffffff', padding: '12px', fontFamily: 'system-ui' }}>
                        {commentListData?.commentCount} bình luận
                    </span>
                    {commentListData?.comments.map((comment) => (
                        <Comment
                            key={comment.commentId}
                            comment={comment}
                            onReplyComment={onReplyComment}
                            getRespondedComment={getRespondedComment}
                        />
                    ))}
                </>
            )}
        </>
    );
}

export default CommentList;

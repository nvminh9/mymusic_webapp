import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Comment from '../Comment';
import { getArticleApi } from '~/utils/api';

function CommentList({ commentListData, onReplyComment, onDeleteComment, getRespondedComment, onLikeComment }) {
    // State
    // const [commentListData, setCommentListData] = useState();

    // Context

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // Refs

    // useMemo
    const commentTreeMemo = useMemo(() => normalizeCommentMap(commentListData.comments), [commentListData]);

    // --- HANDLE FUNCTIONS ---
    useEffect(() => {
        //
    }, []);
    // Hàm chuyển commentListData (type Map) sang type Array
    function normalizeCommentMap(commentMapObj) {
        function transformComment(comment) {
            // Chuyển replies object thành array (đệ quy)
            const repliesObj = comment.replies || {};
            const repliesArr = Object.values(repliesObj).map(transformComment);

            // Chuyển likes object thành array
            const likesObj = comment.likes || {};
            const likesArr = Object.values(likesObj);

            return {
                ...comment,
                replies: repliesArr,
                likes: likesArr,
            };
        }

        // Trả về mảng các comment cấp 1 (top-level)
        return Object.values(commentMapObj).map(transformComment);
    }

    return (
        <>
            {/* Render Comments */}
            {commentTreeMemo?.length <= 0 ? (
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
                    <span style={{ display: 'block', color: '#ffffff', padding: '12px', fontFamily: 'system-ui' }}>
                        {commentListData?.commentCount} bình luận
                    </span>
                    {commentTreeMemo?.map((comment) => (
                        <Comment
                            key={comment.commentId}
                            comment={comment}
                            onReplyComment={onReplyComment}
                            onDeleteComment={onDeleteComment}
                            getRespondedComment={getRespondedComment}
                            onLikeComment={onLikeComment}
                        />
                    ))}
                </>
            )}
        </>
    );
}

export default CommentList;

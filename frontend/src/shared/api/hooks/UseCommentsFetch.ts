import { fetchComments } from '@/shared/api/queries/comments';
import { PostComment, Status } from '@/types';
import { useState, useEffect } from 'react';

const UseCommentsFetch = (user: string | undefined, channelId: string | undefined, postId: string | undefined) => {

    const [comments, setComments] = useState<PostComment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState<Status>('Before');
    const [commentsLoadingError, setCommentsLoadingError] = useState(false);
    const [offset, setOffset] = useState(0);
    const [count, setCount] = useState(20);

    useEffect(() => {

        const fetchData = async () => {

            if (user == undefined || channelId == undefined || postId == undefined) {
                setCommentsLoadingError(true);
                console.error('Undefined param in UseCommentsFetch');
                return;
            }

            setCommentsLoading('Processing');
            try {
                const fetchedComments = await fetchComments(
                    user,
                    parseInt(channelId),
                    +postId,
                    offset,
                    count);
                if (fetchedComments != undefined) {
                    setComments(prev => [...prev, ...fetchedComments]);
                }
            } catch (error) {
                let message;
                if (error instanceof Error) message = error.message;
                else message = String(error);
                console.error(message);
                setCommentsLoadingError(true);
            } finally {
                setCommentsLoading('After');
            }
        };

        fetchData();
    }, [user, channelId, postId, offset]);

    return { comments, commentsLoading, commentsLoadingError, setOffset, setCommentsLoadingError };
};

export default UseCommentsFetch;

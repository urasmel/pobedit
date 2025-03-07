import styles from "./Comments.module.scss";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pagination, Snackbar } from "@mui/material";
import Loading from '@/shared/components/Loading';
import ScrollToTopButton from "@/shared/components/ScrollToTopButton";
import { ErrorAction } from "@/shared/components/ErrorrAction";
import { CommentWidget } from "@/features/CommentWidget";
import { CommentsLoadingWidget } from "@/shared/components/CommentsLoadingWidget";
import { commentsApi as commentsApi } from "@/entities/comments";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { COMMENTS_PER_PAGE } from '@/shared/config';


export const Comments = () => {

    const { channelId, postId } = useParams();
    const [offset, setOffset] = useState(0);
    const [limit] = useState(COMMENTS_PER_PAGE);
    const queryClient = useQueryClient();
    const [pagesCount, setPagesCount] = useState(0);
    const [commentsErrorOpen, setCommentsErrorOpen] = useState(false);
    const [isSocketError, setIsSocketError] = useState(false);
    const [socketErrorMessage, setSocketErrorMessage] = useState('');

    const {
        data,
        isFetching,
        isLoading,
        isError,
        error
    } = useQuery(commentsApi.commentsQueries.list(channelId, postId, offset, limit));

    const { data: count } = useQuery(commentsApi.commentsQueries.count(channelId, postId));

    useEffect(
        () => {
            if (count == 0 || count == undefined) {
                return;
            }

            if (count % COMMENTS_PER_PAGE == 0) {
                setPagesCount(count / COMMENTS_PER_PAGE);
            }
            else {
                setPagesCount(Math.ceil(count / COMMENTS_PER_PAGE));
            }
        }, [count]
    );

    useEffect(() => {
        if (isError) {
            setCommentsErrorOpen(true);
        }
    }, [isError]);

    const handleCommentsErrorClose = () => {
        setCommentsErrorOpen(false);
    };

    const onPageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setOffset(COMMENTS_PER_PAGE * (page - 1));
    };

    const invalidateCashe = () => {
        queryClient.invalidateQueries(commentsApi.commentsQueries.list(channelId, postId, offset, limit));
    };

    const setIsLoadingError = (description: string) => {
        setSocketErrorMessage(description);
        setIsSocketError(true);
    };

    const closeSocketError = () => {
        setIsSocketError(false);
    };

    return (
        <div className={styles.post__comments}>

            <div className={styles['posts-no-data']}>
                <CommentsLoadingWidget
                    channelId={channelId ? +channelId : undefined}
                    postId={postId ? +postId : 0}
                    invalidateCashe={invalidateCashe}
                    setLoadingError={setIsLoadingError}
                />
            </div>


            {
                data?.comments.length !== 0 &&
                <>
                    {
                        data?.comments.map((comment) => (
                            <CommentWidget
                                key={comment.tlgId}
                                {...comment}
                            />
                        ))
                    }
                </>
            }

            {
                (isFetching || isLoading) &&
                <div className="channel__posts-loading">
                    <Loading />
                </div>
            }

            {
                !isError &&
                <Pagination
                    sx={{ marginTop: 'auto' }}
                    count={pagesCount}
                    variant="outlined"
                    shape="rounded"
                    onChange={onPageChange}
                />
            }

            <ScrollToTopButton />

            <Snackbar
                open={isError}
                autoHideDuration={6000}
                onClose={handleCommentsErrorClose}
                message={error?.message}
                action={ErrorAction(handleCommentsErrorClose)}
            />

            <Snackbar
                open={isSocketError}
                autoHideDuration={6000}
                onClose={closeSocketError}
                message={socketErrorMessage}
                action={ErrorAction(closeSocketError)}
            />

        </div>
    );
};

import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, Pagination, Snackbar, Typography } from "@mui/material";
import { Loading } from '@/shared/components/loading/loading-widget';
import { ScrollToTopButton } from "@/shared/components/scroll-top-button";
import { ErrorActionButton } from "@/shared/components/errors/errorr-action-button";
import { CommentWidget } from "@/shared/components/Comments/comment-widget";
import { CommentsUpdatingWidget } from "@/shared/components/comments-updating-widget";
import { commentsApi } from "@/entities/comments";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ITEMS_PER_PAGE } from '@/shared/config';
import { PostWidget } from "@/features/post-widget";
import { postsApi } from "@/entities/posts";
import { ErrorBoundary } from "@/shared/components/errors/error-boundary";

export const PostPage = () => {

    const { channelId, postId } = useParams();
    const [offset, setOffset] = useState(0);
    const [limit] = useState(ITEMS_PER_PAGE);
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
        error,
    } = useQuery(commentsApi.commentsQueries.list(channelId, postId, offset, limit));

    const { data: count } = useQuery(commentsApi.commentsQueries.count(channelId, postId));

    if (channelId === undefined || postId === undefined) {
        return <ErrorBoundary>Произошла ошибка</ErrorBoundary>;
    }

    const { data: post } = useQuery(postsApi.postsQueries.one(+channelId, +postId));

    useEffect(
        () => {
            if (count == 0 || count == undefined) {
                return;
            }

            if (count % limit == 0) {
                setPagesCount(count / limit);
            }
            else {
                setPagesCount(Math.ceil(count / limit));
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
        setOffset(limit * (page - 1));
    };

    const invalidateCache = () => {
        queryClient.invalidateQueries(commentsApi.commentsQueries.list(channelId, postId, offset, limit));
    };

    const setIsUpdatingError = (description: string) => {
        setSocketErrorMessage(description);
        setIsSocketError(true);
    };

    const closeSocketError = () => {
        setIsSocketError(false);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 2,
                height: "100%",
                width: "100%",
                boxSizing: "border-box",
            }}
        >

            {
                post != undefined &&
                <PostWidget
                    post={post?.post}
                    showPostLink={false}
                    showTitle={true} />
            }

            {
                isError && <Typography>Ошибка загрузки комментариев поста.</Typography>
            }

            {
                (!isLoading && !isError) &&
                <CommentsUpdatingWidget
                    channelId={channelId ? +channelId : undefined}
                    postId={postId ? +postId : 0}
                    invalidateCache={invalidateCache}
                    setUpdatingError={setIsUpdatingError}
                />
            }

            {
                data?.comments.length !== 0 &&
                <>
                    {
                        data?.comments.map((comment) => (
                            <CommentWidget
                                key={comment.tlgId}
                                comment={comment}
                                showChannel={false}
                                showUsername={true}
                            />
                        ))
                    }
                </>
            }

            {
                (isFetching || isLoading) && <Loading />
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
                open={commentsErrorOpen}
                autoHideDuration={6000}
                action={ErrorActionButton(handleCommentsErrorClose)}
                onClose={handleCommentsErrorClose}
            >
                <Alert
                    onClose={handleCommentsErrorClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error?.message}
                </Alert>
            </Snackbar>

            <Snackbar
                open={isSocketError}
                autoHideDuration={6000}
                action={ErrorActionButton(closeSocketError)}
                onClose={closeSocketError}
            >
                <Alert
                    onClose={closeSocketError}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {socketErrorMessage}
                </Alert>
            </Snackbar>

        </Box>
    );
};

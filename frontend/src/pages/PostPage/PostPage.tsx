import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, Pagination, Snackbar } from "@mui/material";
import Loading from '@/shared/components/Loading';
import ScrollToTopButton from "@/shared/components/ScrollToTopButton";
import { ErrorAction } from "@/shared/components/ErrorrAction";
import { CommentWidget } from "@/shared/components/Comments/CommentWidget";
import { CommentsLoadingWidget } from "@/shared/components/CommentsLoadingWidget";
import { commentsApi } from "@/entities/comments";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ITEMS_PER_PAGE } from '@/shared/config';
import { PostWidget } from "@/features/PostWidget";
import { postsApi } from "@/entities/posts";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary/ErrorBoundary";

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
        error
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
        <Box
            sx={{
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 2,
                height: "100%",
                width: "100%",
                boxSizing: "border-box",
            }}
        >

            {post != undefined && <PostWidget post={post?.post} showPostLink={false} showTitle={true} />}

            <CommentsLoadingWidget
                channelId={channelId ? +channelId : undefined}
                postId={postId ? +postId : 0}
                invalidateCashe={invalidateCashe}
                setLoadingError={setIsLoadingError}
            />

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
                action={ErrorAction(handleCommentsErrorClose)}
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
                action={ErrorAction(closeSocketError)}
                onClose={closeSocketError}
            >
                <Alert
                    onClose={closeSocketError}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    socketErrorMessage
                </Alert>
            </Snackbar>

        </Box>
    );
};

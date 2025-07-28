import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Pagination, Typography } from "@mui/material";
import { LoadingWidget } from '@/shared/components/loading/loading-widget';
import { ScrollToTopButton } from "@/shared/components/scroll-top-button";
import { CommentWidget } from "@/shared/components/Comments/comment-widget";
import { CommentsUpdatingWidget } from "@/shared/components/comments-updating-widget";
import { commentsApi } from "@/entities/comments";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PAGE_SIZE } from '@/shared/config';
import { PostWidget } from "@/features/post-widget";
import { postsApi } from "@/entities/posts";
import { ErrorBoundary } from "@/shared/components/errors/error-boundary";
import { enqueueSnackbar } from "notistack";
import { getLocalizedString } from "@/shared/locales/localizing";
import { useTranslation } from "react-i18next";
import { commentsKeys } from "@/entities/comments/api/comments.keys";
import { useFetchChannelDetail } from "@/entities/channels/api/hooks";

export const PostPage = () => {

    const { t } = useTranslation();
    const { channelId, postId } = useParams();
    const [offset, setOffset] = useState(0);
    const [limit] = useState(PAGE_SIZE);
    const queryClient = useQueryClient();
    const [pagesCount, setPagesCount] = useState(0);

    const {
        data,
        isFetching,
        isLoading,
        isError,
        error,
    } = useQuery(commentsApi.commentsQueries.list(channelId, postId, offset, limit));

    const { data: count } = useQuery(commentsApi.commentsQueries.count(channelId, postId));

    const { channelInfo } = useFetchChannelDetail(channelId);

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
            enqueueSnackbar(getLocalizedString(error, t), { variant: 'error' });
        }
    }, [isError]);

    const onPageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setOffset(limit * (page - 1));
    };

    const invalidateCache = () => {
        queryClient.invalidateQueries({ queryKey: [...commentsKeys.list, channelId, postId, offset, limit] });
        queryClient.invalidateQueries({ queryKey: [...commentsKeys.count, channelId, postId] });
        queryClient.invalidateQueries({ queryKey: ["posts", channelId] });
    };

    const setUpdatingResult = (success: boolean, description: string) => {
        // setSocketEndMessage(description);
        // setSocketIsSuccess(success);
        enqueueSnackbar(description, { variant: success ? "success" : "error" });
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                <LoadingWidget />
            </Box>
        );
    }

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
                    showCommentsLink={false}
                    showTitle={true} />
            }

            {
                isError && <Typography>Ошибка загрузки комментариев поста.</Typography>
            }

            {
                (channelInfo?.hasComments && !isLoading && !isError) &&
                <CommentsUpdatingWidget
                    channelId={channelId ? +channelId : undefined}
                    postId={postId ? +postId : 0}
                    invalidateCache={invalidateCache}
                    setUpdatingResult={setUpdatingResult}
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
                                showPostLink={false}
                            />
                        ))
                    }
                </>
            }

            {
                (isFetching || isLoading) && <LoadingWidget />
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

        </Box>
    );
};

import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box, Pagination, Typography } from "@mui/material";
import { LoadingWidget } from '@/shared/components/loading/loading-widget';
import { ScrollToTopButton } from "@/shared/components/scroll-top-button";
import { CommentsUpdatingWidget } from "@/shared/components/comments-updating-widget";
import { ErrorBoundary } from "@/shared/components/errors/error-boundary";
import { PostWidget } from "@/features/post-widget";
import { CommentsList, EmptyState, LoadingState } from "./ui";
import { usePostPage } from "./hooks";

export const PostPage = () => {
    const { channelId, postId } = useParams();

    const {
        isValidParams,
        comments,
        post,
        channelInfo,
        pagesCount,
        isLoading,
        isFetching,
        isError,
        handlePageChange,
        invalidateCache,
        setUpdatingResult,
        numericChannelId,
        numericPostId
    } = usePostPage(channelId, postId);

    // Ранний возврат для невалидных параметров
    if (!isValidParams) {
        return (
            <ErrorBoundary>
                <Typography color="error">
                    Неверные параметры страницы: channelId или postId отсутствуют
                </Typography>
            </ErrorBoundary>
        );
    }

    // Состояния для оптимизации рендеринга
    const hasComments = useMemo(() => comments.length > 0, [comments]);
    const shouldShowUpdatingWidget = useMemo(() => {
        return channelInfo?.hasComments && !isLoading && !isError;
    }, [channelInfo?.hasComments, isLoading, isError]);

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <Box sx={containerStyles}>
            {/* Пост */}
            {post && (
                <PostWidget
                    post={post}
                    showCommentsLink={false}
                    showTitle={true}
                />
            )}

            {/* Виджет обновления комментариев */}
            {shouldShowUpdatingWidget && (
                <CommentsUpdatingWidget
                    channelId={numericChannelId}
                    postId={numericPostId}
                    invalidateCache={invalidateCache}
                    setUpdatingResult={setUpdatingResult}
                />
            )}

            {/* Список комментариев */}
            {hasComments ? (
                <CommentsList comments={comments} />
            ) : (
                <EmptyState />
            )}

            {/* Индикатор загрузки */}
            {(isFetching || isLoading) && <LoadingWidget />}

            {/* Пагинация */}
            {!isError && pagesCount > 1 && (
                <Pagination
                    sx={paginationStyles}
                    count={pagesCount}
                    variant="outlined"
                    shape="rounded"
                    onChange={handlePageChange}
                />
            )}

            <ScrollToTopButton />
        </Box>
    );
};

PostPage.displayName = 'PostPage';

// Стили
const containerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: 2,
    width: "100%",
    boxSizing: "border-box",
    py: 2,
    px: { xs: 1, sm: 2, md: 3 }
};

const paginationStyles = {
    marginTop: 'auto',
    py: 2,
    display: 'flex',
    justifyContent: 'center'
};

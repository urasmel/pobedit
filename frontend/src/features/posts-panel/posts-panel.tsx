import { Post } from '@/entities';
import { LoadingWidget } from '@/shared/components/loading/loading-widget';
import { Box, Pagination, Typography } from '@mui/material';
import { PostWidget } from '../post-widget';
import { PAGE_SIZE } from '@/shared/config';
import { ChangeEvent, useEffect, useState, useMemo, useCallback } from 'react';
import { useFetchPostsCount } from '@/entities/posts/hooks/useFetchPostsCount';
import { useFetchPosts } from '@/entities/posts/hooks/useFetchPosts';
import { useSnackbar } from 'notistack';
import { useFetchChannelDetail } from '@/entities/channels/api/hooks';

interface PostsPanelProps {
    channelId: string;
}

export const PostsPanel = ({ channelId }: PostsPanelProps) => {

    const { enqueueSnackbar } = useSnackbar();
    const [offset, setOffset] = useState(0);

    const {
        postsCount,
        postsCountError,
        postsCountErrorMsg
    } = useFetchPostsCount(channelId);

    const {
        channelInfo,
        channelInfoError,
        channelInfoErrorMsg
    } = useFetchChannelDetail(channelId);

    const {
        posts,
        postsError,
        postsErrorMsg,
        isFetching,
        isLoading,
    } = useFetchPosts(channelId, offset, PAGE_SIZE);

    // Сбрасываем offset при смене канала
    useEffect(() => {
        setOffset(0);
    }, [channelId]);

    // Единый обработчик ошибок
    useEffect(() => {
        const errors = [
            { condition: postsCountError, message: postsCountErrorMsg },
            { condition: postsError, message: postsErrorMsg },
            { condition: channelInfoError, message: channelInfoErrorMsg }
        ];

        errors.forEach(({ condition, message }) => {
            if (condition && message) {
                enqueueSnackbar(message, { variant: 'error' });
            }
        });
    }, [
        postsCountError,
        postsError,
        channelInfoError,
        postsCountErrorMsg,
        postsErrorMsg,
        channelInfoErrorMsg,
        enqueueSnackbar
    ]);

    const pagesCount = useMemo(() => {
        if (!postsCount || postsCount === 0) return 0;
        return Math.ceil(postsCount / PAGE_SIZE);
    }, [postsCount]);

    const currentPage = useMemo(() =>
        Math.floor(offset / PAGE_SIZE) + 1,
        [offset]);

    const handlePageChange = useCallback((_event: ChangeEvent<unknown>, page: number) => {
        setOffset(PAGE_SIZE * (page - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const showEmptyState = useMemo(() =>
        !isLoading && !isFetching && (!posts || posts.length === 0),
        [isLoading, isFetching, posts]);

    // Показывать ли пагинацию
    const showPagination = useMemo(() =>
        pagesCount > 1 && !isFetching && posts && posts.length > 0,
        [pagesCount, isFetching, posts]);

    if (isLoading) {
        return (
            <Box sx={containerStyles}>
                <LoadingWidget size={100} />
            </Box>
        );
    }

    return (
        <Box sx={panelStyles}>

            {/* Empty state */}
            {showEmptyState && (
                <Box sx={emptyStateStyles}>
                    <Typography variant="h6" color="text.secondary">
                        No posts found
                    </Typography>
                </Box>
            )}

            {posts?.map((post: Post) => {
                return <PostWidget
                    key={post.tlgId}
                    post={post}
                    showCommentsLink={channelInfo?.hasComments ?? true}
                    showTitle={false}
                />;
            })}

            {showPagination && (
                <Pagination
                    sx={paginationStyles}
                    count={pagesCount}
                    variant="outlined"
                    shape="rounded"
                    page={currentPage}
                    onChange={handlePageChange}
                    disabled={isFetching}
                />
            )}

            {/* Индикатор загрузки при пагинации */}
            {isFetching && (
                <Box sx={loadingContainerStyles}>
                    <LoadingWidget />
                </Box>
            )}
        </Box>
    );
};

// Вынесенные стили для лучшей читаемости
const containerStyles = {
    width: "100%",
    height: "100%",
    display: 'flex',
    alignItems: "center",
    justifyContent: "center"
};

const panelStyles = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    rowGap: "2rem",
    alignItems: "start",
    width: "100%",
    minHeight: '200px'
};

const emptyStateStyles = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 4
};

const paginationStyles = {
    marginTop: 'auto',
    alignSelf: 'center'
};

const loadingContainerStyles = {
    alignSelf: 'center'
};

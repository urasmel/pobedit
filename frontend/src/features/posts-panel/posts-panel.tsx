import { Post } from '@/entities';
import { LoadingWidget } from '@/shared/components/loading/loading-widget';
import { Box, Pagination } from '@mui/material';
import { PostWidget } from '../post-widget';
import { ITEMS_PER_PAGE } from '@/shared/config';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFetchPostsCount } from '@/entities/posts/hooks/useFetchPostsCount';
import { useFetchPosts } from '@/entities/posts/hooks/useFetchPosts';
import { enqueueSnackbar } from 'notistack';

export const PostsPanel = (props: { channelId: string; }) => {

    const [offset, setOffset] = useState(0);
    const [limit] = useState(ITEMS_PER_PAGE);
    const [pagesCount, setPagesCount] = useState(0);

    const { postsCount, postsCountError, postsCountErrorMsg } = useFetchPostsCount(props.channelId);
    const {
        posts,
        postsError,
        postsErrorMsg,
        isFetching,
        isLoading,
        isError
    } = useFetchPosts(props.channelId, offset, limit);

    useEffect(
        () => {
            if (postsCount === undefined || postsCount === 0) {
                setPagesCount(0);
                return;
            }

            if (postsCount % ITEMS_PER_PAGE == 0) {
                setPagesCount(postsCount / ITEMS_PER_PAGE);
            }
            else {
                setPagesCount(Math.ceil(postsCount / ITEMS_PER_PAGE));
            }
        }, [postsCount]
    );

    useEffect(() => {
        if (postsCountError) {
            enqueueSnackbar(postsCountErrorMsg, { variant: 'error' });
        }
    }, [postsCountError]);

    useEffect(() => {
        if (postsError) {
            enqueueSnackbar(postsErrorMsg, { variant: 'error' });
        }
    }, [postsError]);


    const onPageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setOffset(ITEMS_PER_PAGE * (page - 1));
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                rowGap: "2rem",
                alignItems: "start",
                width: "100%",
                height: "100%"
            }}>
            {
                posts?.length !== 0 &&
                <>
                    {
                        posts?.map((post: Post) => {
                            return <PostWidget
                                key={post.tlgId}
                                post={post}
                                showPostLink={true}
                                showTitle={false}
                            />;
                        })
                    }
                </>
            }

            {
                (isFetching || isLoading) &&
                <Box sx={{ alignSelf: "center" }}>
                    <LoadingWidget />
                </Box>
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
        </Box>
    );
};

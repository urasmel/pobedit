import { Action, MainState, useMainStore } from "@/app/stores";
import { Post } from "@/entities";
import { channelsApi } from "@/entities/channels";
import { postsApi } from "@/entities/posts";
import { PostWidget } from "@/features/PostWidget";
import { ChannelMainInfo } from "@/shared/components/ChannelMainInfo";
import { ErrorAction } from "@/shared/components/ErrorrAction";
import { Loading } from "@/shared/components/Loading";
import { PostsLoadingWidget } from "@/shared/components/PostsLoadingWidget";
import { ScrollToTopButton } from "@/shared/components/ScrollToTopButton/ScrollToTopButton";
import { Alert, Box, Pagination, Snackbar } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ITEMS_PER_PAGE } from "@/shared/config";

export const PostsPage = () => {

    const { channelId } = useParams();
    const selectedUser = useMainStore(
        (state: MainState & Action) => state.selectedUser
    );
    const [offset, setOffset] = useState(0);
    const [limit] = useState(ITEMS_PER_PAGE);
    const queryClient = useQueryClient();
    const [channelErrorOpen, setChannelInfoOpen] = useState(false);
    const [postsErrorOpen, setPostsErrorOpen] = useState(false);
    const [isSocketError, setIsSocketError] = useState(false);
    const [socketErrorMessage, setSocketErrorMessage] = useState('');

    const { data: channelInfo,
        isError: channelInfoIsError,
        error: channelInfoError,
        isFetched: infoIsFetched }
        = useQuery(channelsApi.channelQueries.details(channelId));

    const { data,
        isFetching,
        isLoading,
        isError,
        error,
        isFetched } = useQuery(postsApi.postsQueries.list(channelId, offset, limit));

    const { data: count } = useQuery(postsApi.postsQueries.count(channelId?.toString()));
    const [pagesCount, setPagesCount] = useState(0);

    useEffect(
        () => {
            if (count?.posts_count == null) {
                return;
            }

            if (count.posts_count % ITEMS_PER_PAGE == 0) {
                setPagesCount(count.posts_count / ITEMS_PER_PAGE);
            }
            else {
                setPagesCount(Math.ceil(count?.posts_count / ITEMS_PER_PAGE));
            }
        }, [count]
    );

    useEffect(() => {
        if (channelInfoIsError) {
            setChannelInfoOpen(true);
        }
    }, [channelInfoIsError]);

    useEffect(() => {
        if (isError) {
            setPostsErrorOpen(true);
        }
    }, [isError]);

    const handleChannelInfoErrorClose = () => {
        setChannelInfoOpen(false);
    };

    const handlePostsErrorClose = () => {
        setPostsErrorOpen(false);
    };

    const onPageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setOffset(ITEMS_PER_PAGE * (page - 1));
    };

    const invalidateCache = () => {
        queryClient.invalidateQueries(postsApi.postsQueries.list(channelId, offset, limit));
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
                boxSizing: "border-box",
            }}
        >
            {
                !channelInfoIsError &&

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: 2,
                    }}
                >
                    {
                        infoIsFetched &&
                        <ChannelMainInfo
                            id={channelId === undefined ? 0 : +channelId}
                            title={channelInfo == null ? '' : channelInfo.title}
                        />
                    }

                    {
                        isFetched &&
                        <PostsLoadingWidget
                            channelId={channelId ? +channelId : undefined}
                            invalidateCache={invalidateCache}
                            setLoadingError={setIsLoadingError}
                        />
                    }
                </Box>

            }

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
                    data?.posts.length !== 0 &&
                    <>
                        {
                            data?.posts.map((post: Post) => {
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
                        <Loading />
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

            <ScrollToTopButton />

            <Snackbar
                open={channelErrorOpen}
                autoHideDuration={6000}
                action={ErrorAction(handleChannelInfoErrorClose)}
                onClose={handleChannelInfoErrorClose}
            >
                <Alert
                    onClose={handleChannelInfoErrorClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    channelInfoError?.message
                </Alert>
            </Snackbar>

            <Snackbar
                open={postsErrorOpen}
                autoHideDuration={6000}
                action={ErrorAction(handlePostsErrorClose)}
                onClose={handlePostsErrorClose}
            >
                <Alert
                    onClose={handlePostsErrorClose}
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
                    {socketErrorMessage}
                </Alert>
            </Snackbar>

        </Box>
    );
};

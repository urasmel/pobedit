import { Post } from "@/entities";
import { channelsApi } from "@/entities/channels";
import { postsApi } from "@/entities/posts";
import { PostWidget } from "@/features/post-widget";
import { ChannelMainInfo } from "@/shared/components/channel-main-info";
import { ErrorActionButton } from "@/shared/components/errors/errorr-action-button";
import { LoadingWidget } from "@/shared/components/loading/loading-widget";
import { PostsLoadingWidget } from "@/shared/components/posts-loading-widget";
import { ScrollToTopButton } from "@/shared/components/scroll-top-button";
import { Alert, Box, Pagination, Snackbar } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ITEMS_PER_PAGE } from "@/shared/config";
import { useTranslation } from "react-i18next";
import { getLocalizedErrorMessage } from "@/shared/errors/errorMessages";

export const PostsPage = () => {

    const { t } = useTranslation();
    const { channelId } = useParams();
    const [offset, setOffset] = useState(0);
    const [limit] = useState(ITEMS_PER_PAGE);
    const queryClient = useQueryClient();
    const [channelErrorOpen, setChannelInfoOpen] = useState(false);
    const [postsErrorOpen, setPostsErrorOpen] = useState(false);
    const [isSocketError, setIsSocketError] = useState(false);
    const [socketErrorMessage, setSocketErrorMessage] = useState('');
    const [pagesCount, setPagesCount] = useState(0);

    const { data: channelInfo,
        isError: channelInfoIsError,
        isFetched: infoIsFetched,
        error: channelInfoError
    } = useQuery(channelsApi.channelQueries.details(channelId));


    const { data,
        isFetching,
        isLoading,
        isError,
        error,
        isFetched } = useQuery(postsApi.postsQueries.list(channelId, offset, limit));

    const { data: count, error: postsCountError } = useQuery(postsApi.postsQueries.count(channelId?.toString()));

    const errorMsg = getLocalizedErrorMessage(error, t);
    const channelErrorMsg = getLocalizedErrorMessage(channelInfoError, t);
    const postCountMsg = getLocalizedErrorMessage(postsCountError, t);

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

            <ScrollToTopButton />

            <Snackbar
                open={channelErrorOpen}
                autoHideDuration={6000}
                action={ErrorActionButton(handleChannelInfoErrorClose)}
                onClose={handleChannelInfoErrorClose}
            >
                <Alert
                    onClose={handleChannelInfoErrorClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {errorMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={postsErrorOpen}
                autoHideDuration={6000}
                action={ErrorActionButton(handlePostsErrorClose)}
                onClose={handlePostsErrorClose}
            >
                <Alert
                    onClose={handlePostsErrorClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {channelErrorMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={postsErrorOpen}
                autoHideDuration={6000}
                action={ErrorActionButton(handlePostsErrorClose)}
                onClose={handlePostsErrorClose}
            >
                <Alert
                    onClose={handlePostsErrorClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {postCountMsg}
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

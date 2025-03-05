import { Action, MainState, useMainStore } from "@/app/stores";
import { Post } from "@/entities";
import { channelApi } from "@/entities/channels";
import { postsApi } from "@/entities/posts";
import PostWidget from "@/features/PostWidget";
import { ChannelMainInfo } from "@/shared/components/ChannelMainInfo";
import { ErrorAction } from "@/shared/components/ErrorrAction";
import Loading from "@/shared/components/Loading";
import { PostsLoadingWidget } from "@/shared/components/PostsLoadingWidget";
import ScrollToTopButton from "@/shared/components/ScrollToTopButton";
import { Pagination, Snackbar } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles.module.scss";
import { POSTS_PER_PAGE } from "@/shared/config";

export const Posts = () => {

    const { channelId } = useParams();
    const selectedUser = useMainStore(
        (state: MainState & Action) => state.selectedUser
    );
    const [offset, setOffset] = useState(0);
    const [limit] = useState(POSTS_PER_PAGE);
    const queryClient = useQueryClient();
    const [channelErrorOpen, setChannelInfoOpen] = useState(false);
    const [postsErrorOpen, setPostsErrorOpen] = useState(false);
    const [isSocketError, setIsSocketError] = useState(false);
    const [socketErrorMessage, setSocketErrorMessage] = useState('');

    const { data: channelInfo,
        isError: channelInfoIsError,
        error: channelInfoError,
        isFetched: infoIsFetched }
        = useQuery(channelApi.channelQueries.details(channelId));

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

            if (count.posts_count % POSTS_PER_PAGE == 0) {
                setPagesCount(count.posts_count / POSTS_PER_PAGE);
            }
            else {
                setPagesCount(Math.ceil(count?.posts_count / POSTS_PER_PAGE));
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
        setOffset(POSTS_PER_PAGE * (page - 1));
    };

    const invalidateCashe = () => {
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
        <div className={styles.channel}>

            {
                !channelInfoIsError &&
                <div className={styles.channel__info}>
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
                            invalidateCashe={invalidateCashe}
                            setLoadingError={setIsLoadingError}
                        />
                    }
                </div>
            }

            <div className={styles.channel__posts}>
                {
                    data?.posts.length !== 0 &&
                    <>
                        {
                            data?.posts.map((post: Post) => {
                                return <PostWidget
                                    key={post.tlgId}
                                    post={post}
                                    user={selectedUser}
                                    channelId={channelId}
                                />;
                            })
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
            </div>

            <ScrollToTopButton />

            <Snackbar
                open={channelErrorOpen}
                onClose={handleChannelInfoErrorClose}
                autoHideDuration={6000}
                message={channelInfoError?.message}
                action={ErrorAction(handleChannelInfoErrorClose)}
            />

            <Snackbar
                open={postsErrorOpen}
                onClose={handlePostsErrorClose}
                autoHideDuration={6000}
                message={error?.message}
                action={ErrorAction(handlePostsErrorClose)}
            />

            <Snackbar
                open={isSocketError}
                autoHideDuration={6000}
                onClose={closeSocketError}
                message={socketErrorMessage}
                action={ErrorAction(closeSocketError)}
            />

        </div >
    );
};

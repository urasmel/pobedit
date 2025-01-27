import { Action, MainState, useMainStore } from "@/app/stores";
import { Post } from "@/entities";
import { channelApi } from "@/entities/channels";
import { postsApi } from "@/entities/posts";
import PostWidget from "@/features/PostWidget";
import { ChannelMainInfo } from "@/shared/components/ChannelMainInfo";
import { ErrorAction } from "@/shared/components/ErrorrAction";
import Loading from "@/shared/components/Loading";
import { ChannelPostsWidget } from "@/shared/components/ChannelPostsWidget";
import ScrollToTopButton from "@/shared/components/ScrollToTopButton";
import { Pagination, Snackbar } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Posts.module.scss";
import { POST_PER_PAGE } from "@/shared/config";

export const Posts = () => {

    const { channelId } = useParams();
    const selectedUser = useMainStore(
        (state: MainState & Action) => state.selectedUser
    );
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);

    const { data: info,
        isFetching: infoIsFetching,
        isLoading: infoIsLoading,
        isError: infoIsError,
        error: channelInfoError,
        isFetched: infoIsFetched,
        isSuccess: channelInfoIsSucces } =
        useQuery(channelApi.channelQueries.details(channelId));

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

            if (count.posts_count % POST_PER_PAGE == 0) {
                setPagesCount(count?.posts_count / POST_PER_PAGE);
            }
            else {
                setPagesCount(Math.ceil(count?.posts_count / POST_PER_PAGE));
            }
        }, [count]
    );

    const handleErrorClose = () => {
        // setPostsLoadingError(false);
    };


    const onPageChange = (event: ChangeEvent, page: number) => {
        setOffset(POST_PER_PAGE * (page - 1));
    };

    return (
        <div className={styles.channel}>

            {
                !infoIsError &&
                <div className={styles.channel__info}>
                    {
                        infoIsFetched &&
                        <ChannelMainInfo
                            id={channelId === undefined ? 0 : +channelId}
                            title={info == null ? '' : info.title}
                        />
                    }
                </div>
            }

            <div className={styles.channel__posts}>

                {
                    isFetched &&
                    <div className={styles['posts-no-data']}>
                        <ChannelPostsWidget
                            userName={selectedUser}
                            channelId={channelId ? +channelId : undefined}
                        />
                    </div>
                }

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


                <Pagination
                    count={pagesCount}
                    variant="outlined"
                    shape="rounded"
                    onChange={onPageChange}
                />
            </div>



            <ScrollToTopButton />

            <Snackbar
                open={infoIsError}
                onClose={handleErrorClose}
                autoHideDuration={6000}
                message={channelInfoError?.message}
                action={ErrorAction(handleErrorClose)}
            />

            <Snackbar
                open={isError}
                onClose={handleErrorClose}
                autoHideDuration={6000}
                message={error?.message}
                action={ErrorAction(handleErrorClose)}
            />

        </div >
    );
};

import styles from "./Posts.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostWidget from "@/features/PostWidget";
import { Snackbar } from "@mui/material";
import { useInView } from "react-intersection-observer";
import Loading from "@/shared/components/Loading";
import { NoChannelData } from "@/shared/components/NoChannelData";
import { ChannelMainInfo } from "@/shared/components/ChannelMainInfo";
import ScrollToTopButton from "@/shared/components/ScrollToTopButton";
import { ErrorAction } from "@/shared/components/ErrorrAction";
import { useQuery } from "@tanstack/react-query";
import { postsApi } from "@/entities/posts";
import { Action, MainState, useMainStore } from "@/app/stores";
import { channelApi } from "@/entities/channels";


export const Posts = () => {


    const { channelId } = useParams();
    const selectedUser = useMainStore(
        (state: MainState & Action) => state.selectedUser
    );
    const { data: channel, isFetching: channelIsFetching, isLoading: channelIsLoading, isError: channelIsError, error: channelError, isFetched: channelIsFetched, isSuccess: channelIsSucces } =
        useQuery(channelApi.channelQueries.details(selectedUser, channelId));
    const { data, isFetching, isLoading, isError, error, isFetched } = useQuery(postsApi.postsQueries.list(selectedUser, channelId));

    const [count] = useState(20);

    const { ref, inView } = useInView({
        threshold: 0,
    });


    const handleErrorClose = () => {
        // setPostsLoadingError(false);
    };

    useEffect(() => {
        // if (inView && data != undefined) {
        //     setOffset(() => data.posts.length);
        // }
    }, [inView]);


    return (
        <div className={styles.channel}>

            {
                !channelIsError &&
                <div className={styles.channel__info}>
                    {
                        (channelIsLoading || channelIsFetching) &&
                        <Loading />
                    }
                    {
                        (channelIsFetched || channelIsSucces) &&
                        <ChannelMainInfo
                            id={channelId === undefined ? 0 : +channelId}
                            title={channel == null ? '' : channel.title}
                        />
                    }
                </div>
            }

            <div className={styles.channel__posts}>

                {
                    isFetched &&
                    data?.posts.length === 0 &&
                    <div className={styles['posts-no-data']}>
                        <NoChannelData userName={selectedUser} channelId={channelId ? +channelId : undefined} />
                    </div>
                }

                {
                    data?.posts.length !== 0 &&
                    <>
                        {
                            data?.posts.map((post) => (
                                <PostWidget key={post.id} {...post} />
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

                <div className={styles['intersection-guard']} ref={ref} >
                    {`Header inside viewport ${inView}.`}
                </div>

            </div>


            <ScrollToTopButton />

            <Snackbar
                open={channelIsError}
                onClose={handleErrorClose}
                autoHideDuration={6000}
                message={channelError?.message}
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

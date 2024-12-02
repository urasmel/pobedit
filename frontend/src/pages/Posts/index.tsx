import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostWidget from "@/components/features/PostWidget";
import { Snackbar } from "@mui/material";
import { useInView } from "react-intersection-observer";
import Loading from "@/components/common/Loading";
import { NoChannelData } from "@/components/common/NoChannelData";
import { ChannelMainInfo } from "@/components/common/ChannelMainInfo";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import { ErrorAction } from "@/components/common/ErrorrAction";
import { UseChannelInfoFetch, UseChannelPostsFetch } from "@/hooks";


const Posts = () => {
    const { user, channelId } = useParams();
    const [count] = useState(20);

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const { channel, channelLoading, channelLoadingError } = UseChannelInfoFetch(user, channelId);
    const { posts, postsLoading, postsLoadingError, setOffset, setPostsLoadingError } = UseChannelPostsFetch(user, channelId);

    const handleErrorClose = () => {
        setPostsLoadingError(false);
    };

    useEffect(() => {
        if (inView) {
            setOffset(() => posts.length);
        }
    }, [inView]);


    return (
        <div className={styles.channel}>

            {
                !channelLoadingError &&
                <div className={styles.channel__info}>
                    {
                        channelLoading === 'Processing' &&
                        <Loading />
                    }
                    {
                        channelLoading === 'After' &&
                        <ChannelMainInfo
                            id={channelId === undefined ? 0 : +channelId}
                            title={channel === undefined ? '' : channel.title}
                        />
                    }
                </div>
            }

            <div className={styles.channel__posts}>

                {
                    postsLoading === 'After' &&
                    posts.length === 0 &&
                    <div className={styles['posts-no-data']}>
                        <NoChannelData userName={user} channelId={channelId ? +channelId : undefined} />
                    </div>
                }

                {
                    posts.length !== 0 &&
                    <>
                        {
                            posts.map((post) => (
                                <PostWidget key={post.postId} {...post} />
                            ))
                        }
                    </>
                }

                {
                    postsLoading === 'Processing' &&
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
                open={channelLoadingError}
                onClose={handleErrorClose}
                autoHideDuration={6000}
                message={"Error fetching channel info"}
                action={ErrorAction(handleErrorClose)}
            />

            <Snackbar
                open={postsLoadingError}
                onClose={handleErrorClose}
                autoHideDuration={6000}
                message={"Error fetching posts"}
                action={ErrorAction(handleErrorClose)}
            />

        </div >
    );
};

export default Posts;

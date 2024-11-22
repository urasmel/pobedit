import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { MainState, useMainStore } from "@/store/MainStore";
import { useParams } from "react-router-dom";
import PostWidget from "@/components/features/PostWidget";
import { IconButton, Snackbar } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useInView } from "react-intersection-observer";
import Loading from "@/components/common/Loading";
import { NoChannelData } from "@/components/common/NoChannelData";
import { fetchChannelNameById } from "@/api/channels";
import { ChannelMainInfo } from "@/components/common/ChannelMainInfo";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import InfoPapper from "@/components/common/InfoPapper";


const Posts = () => {
    const { user, channelId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [offset, setOffset] = useState(0);
    const [count] = useState(20);
    const [channelTitle, setChannelName] = useState<string>('');

    const channelPostsDict = useMainStore(
        (state: MainState) => state.channelPostsDict
    );

    const fetchChannelPosts = useMainStore(
        (state: MainState) => state.fetchChannelPosts
    );

    const handleErrorClose = () => {
        setOpenErrorMessage(false);
    };

    const errorAction = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleErrorClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    // For intersection-guard.
    // const { ref, inView, entry } = useInView({
    const { ref, inView } = useInView({
        /* Optional options */
        threshold: 0,
    });

    useEffect(() => {
        const fetchChannelName = async () => {

            const channelName = await fetchChannelNameById(user, channelId ? +channelId : undefined);
            setChannelName(channelName.title);
        };

        fetchChannelName();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            if (typeof user !== "string" || !user) {
                return;
            }

            setIsLoading(() => true);
            setIsError(() => false);
            if (channelId && inView) {
                const wasSuccess = await fetchChannelPosts(
                    user,
                    parseInt(channelId),
                    offset,
                    count
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setOffset(() => offset + count);
                if (!wasSuccess) {
                    setIsError(() => true);
                    setErrorMessage("Error while fetching channel posts");
                    setOpenErrorMessage(true);
                }
            }
            setIsLoading(false);
        };

        fetchPosts();
    }, [inView]);

    return (
        <div className={styles.posts}>

            {
                isLoading
                    ?
                    <Loading />
                    :
                    <>

                        {
                            isError
                                ?
                                <InfoPapper message={'Во время запроса данных произошла ошибка...'} />
                                :
                                <>
                                    <div className={styles['posts-channel']}>
                                        <ChannelMainInfo id={channelId === undefined ? 0 : +channelId} title={channelTitle} />
                                    </div>
                                    {
                                        channelPostsDict.posts.length == 0
                                            ?
                                            <div className={styles['posts-no-data']}>
                                                <NoChannelData userName={user} channelId={channelId ? +channelId : undefined} />
                                            </div>
                                            :
                                            <>
                                                {
                                                    channelPostsDict.posts.map((post) => (
                                                        <PostWidget key={post.postId} {...post} />
                                                    ))
                                                }

                                            </>
                                    }
                                </>
                        }
                    </>
            }

            <div className={styles['intersection-guard']} ref={ref} >
                {`Header inside viewport ${inView}.`}
            </div>

            <ScrollToTopButton />

            <Snackbar
                open={openErrorMessage}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                message={errorMessage}
                action={errorAction}
            />

        </div>
    );
};

export default Posts;

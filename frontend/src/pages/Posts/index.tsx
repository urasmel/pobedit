import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { MainState, useMainStore } from "@/store/MainStore";
import { useNavigate, useParams } from "react-router-dom";
import PostWidget from "@/components/features/PostWidget";
import { Button, IconButton, Snackbar } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useInView } from "react-intersection-observer";
import Loading from "@/components/common/Loading";
import { NoChannelData } from "@/components/common/NoChannelData";
import { fetchChannelNameById } from "@/api/channels";



const Posts = () => {
    const { user, channelId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [offset, setOffset] = useState(0);
    const [count, setCount] = useState(20);
    const [channelName, setChannelName] = useState("");

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
    const { ref, inView, entry } = useInView({
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
                    setErrorMessage("Error while fetching channel posts");
                    setOpenErrorMessage(true);
                }
            }
            setIsLoading(false);
        };

        fetchPosts();
    }, [inView]);

    return (
        <div className={styles["main_container"]}>

            <div>{channelName}</div>

            {
                channelPostsDict.posts.length == 0 && !isLoading
                    ?
                    <NoChannelData userName={user} channelId={channelId ? +channelId : undefined} />
                    :
                    <>
                        {
                            channelPostsDict.posts.map((post) => (
                                <PostWidget key={post.postId} {...post} />
                            ))
                        }

                    </>
            }

            <div className={styles['intersection-guard']} ref={ref} >
                {`Header inside viewport ${inView}.`}
            </div>

            <Loading isLoading={isLoading} />
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

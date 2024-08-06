import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { MainState, useMainStore } from "@/store/MainStore";
import { useParams } from "react-router-dom";
import PostWidget from "@/components/features/PostWidget/PostWidget";
import { Button, IconButton, Snackbar } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

//const Posts = ({ user, chatId }: PostsProps) => {
const Posts = () => {
    const { user, channelId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [offset, setOffset] = useState(0);
    const [count, setCount] = useState(20);

    const channelPostsDict = useMainStore(
        (state: MainState) => state.channelPostsDict
    );
    const fetchChannelPosts = useMainStore(
        (state: MainState) => state.fetchChannelPosts
    );

    useEffect(() => {
        const fetchPosts = async () => {
            if (typeof user !== "string" || !user) {
                return;
            }

            setIsLoading(true);
            if (channelId) {
                const wasSuccess = await fetchChannelPosts(
                    user,
                    parseInt(channelId),
                    offset,
                    count
                );
                if (!wasSuccess) {
                    setErrorMessage("Error while fetching channel posts");
                    setOpenErrorMessage(true);
                }
            }
            setIsLoading(false);
        };

        console.log("user " + user);
        console.log("channelId " + channelId);
        fetchPosts();
    }, []);

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

    return (
        <div className={styles["main_container"]}>
            {channelPostsDict.posts.length == 0 ? (
                <>Пока в базе данных нет записей из этого канала</>
            ) : (
                channelPostsDict.posts.map((post) => (
                    <PostWidget key={post.postId} {...post} />
                ))
            )}

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

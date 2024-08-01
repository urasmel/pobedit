import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { MainState, useMainStore } from "@/store/MainStore";
import { useParams } from "react-router-dom";
import PostWidget from "@/components/features/PostWidget/PostWidget";
import { Button } from "@mui/material";

//const Posts = ({ user, chatId }: PostsProps) => {
const Posts = () => {
    const { user, channelId } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const channelPostsDict = useMainStore(
        (state: MainState) => state.channelPostsDict
    );
    const fetchChannelPosts = useMainStore(
        (state: MainState) => state.fetchChannelPosts
    );
    const updateAndFetchChannelPosts = useMainStore(
        (state: MainState) => state.updateAndFetchChannelPosts
    );

    useEffect(() => {
        const fetchPosts = async () => {
            if (typeof user !== "string" || !user) {
                return;
            }

            setIsLoading(true);
            if (channelId) {
                await fetchChannelPosts(user, parseInt(channelId));
            }
            setIsLoading(false);
        };

        console.log("user " + user);
        console.log("channelId " + channelId);
        fetchPosts();
    }, []);

    const UpdtePosts = async () => {
        if (typeof user !== "string" || !user) {
            return;
        }
        setIsLoading(true);
        if (channelId) {
            await updateAndFetchChannelPosts(user, parseInt(channelId));
        }
        setIsLoading(false);
    };

    return (
        <div className={styles["main_container"]}>
            {channelPostsDict.posts.length == 0 ? (
                <>Пока в базе данных нет записей из этого канала</>
            ) : (
                channelPostsDict.posts.map((post) => (
                    <PostWidget key={post.postId} {...post} />
                ))
            )}
            <Button onClick={UpdtePosts} variant="contained">
                Обновить данные
            </Button>
        </div>
    );
};

export default Posts;

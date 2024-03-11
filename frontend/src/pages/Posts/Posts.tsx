import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { MainState, useMainStore } from "@/store/MainStore";
import { useParams } from "react-router-dom";
import PostWidget from "@/components/features/PostWidget/PostWidget";

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

    return (
        <div className={styles["main_container"]}>
            {channelPostsDict.posts.map((post) => (
                <PostWidget {...post} />
            ))}
        </div>
    );
};

export default Posts;
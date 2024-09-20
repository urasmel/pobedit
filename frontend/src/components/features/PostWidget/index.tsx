import styles from "./styles.module.css";
import type { Post } from "@/types/Post";

const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

const PostWidget = (post: Post) => {
    return (
        <div className={styles["widget"]}>
            <div className={styles["widget__header"]}>
                Ид. канала: {post.peerId}, ид. сообщения: {post.postId}, дата:{" "}
                {new Date(post.date).toLocaleString("ru-RU")}
            </div>
            <div className={styles["widget__message-container"]}>
                <pre className={styles["widget__message"]}>{post.message}</pre>
            </div>
        </div>
    );
};

export default PostWidget;

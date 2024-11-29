import styles from "./styles.module.css";
import type { Post } from "types/Post";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from "@mui/material";
import plural from 'plural-ru';

const PostWidget = (post: Post) => {
    return (
        <div className={styles.post}>
            <div className={styles.post__header}>
                Ид. сообщения: {post.id}, время:{" "}
                {new Date(post.date).toLocaleString("ru-RU")}
            </div>
            <div className={styles["post__message-container"]}>
                <pre className={styles.post__message}>{post.message}</pre>
            </div>
            {
                post.commentsCount !== 0 &&
                <div className={styles.post__comments}>
                    <div className={styles["post__comments-count"]}>
                        {post.commentsCount + ' ' + plural(post.commentsCount, 'комментарий', 'комментария', 'комментариев')}
                    </div>
                    <div className={styles["post__comments-link"]}>
                        <Link target="_blank" href={`/posts/${post.postId}/channels/${post.peerId}/comments`}>
                            <ChevronRightIcon />
                        </Link>
                    </div>
                </div>
            }
        </div >
    );
};

export default PostWidget;

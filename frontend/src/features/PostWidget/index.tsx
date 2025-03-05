import { Post } from "@/entities";
import styles from "./styles.module.css";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import plural from 'plural-ru';
import { NavLink } from "react-router-dom";

const PostWidget = ({ post, user, channelId }: { post: Post, user: string | undefined, channelId: string | undefined; }) => {
    return (
        <div className={styles.post}>

            <div className={styles.post__header}>
                Ид. сообщения: {post.tlgId}, время:{" "}
                {new Date(post.date).toLocaleString("ru-RU")}
            </div>

            <div className={styles["post__message-container"]}>
                <pre className={styles.post__message}>{post.message}</pre>
            </div>

            {
                // post.commentsCount &&
                <div className={styles.post__comments}>
                    <div className={styles["post__comments-count"]}>
                        {
                            (post.commentsCount ? post.commentsCount : 0) +
                            ' ' +
                            plural((post.commentsCount ? post.commentsCount : 0), 'комментарий', 'комментария', 'комментариев')
                        }
                    </div>
                    {
                        <NavLink
                            className={styles["post__comments-link"]}
                            to={`/channels/${channelId}/posts/${post.tlgId}/comments`}
                        >
                            <ChevronRightIcon />
                        </NavLink>
                    }
                </div>
            }
        </div >
    );
};

export default PostWidget;

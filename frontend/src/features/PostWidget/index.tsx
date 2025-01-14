import { Post } from "@/entities";
import styles from "./styles.module.css";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import plural from 'plural-ru';
import { NavLink } from "react-router-dom";

const PostWidget = ({ post, user, channelId }: { post: Post, user: string | undefined, channelId: string | undefined; }) => {
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
                post.commentsCount &&
                <div className={styles.post__comments}>
                    <div className={styles["post__comments-count"]}>
                        {post.commentsCount + ' ' + plural(post.commentsCount, 'комментарий', 'комментария', 'комментариев')}
                    </div>
                    {
                        user != undefined &&
                        channelId != undefined &&
                        post.commentsCount > 0 &&
                        <NavLink
                            className={styles["post__comments-link"]}
                            to={`/user/${user}/channels/${channelId}/posts/${post.id}/comments`}
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

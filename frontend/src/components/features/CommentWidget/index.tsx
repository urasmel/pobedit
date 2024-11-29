import { PostComment } from "@/types";
import styles from './styles.module.css';

export const CommentWidget = (comment: PostComment) => {
    return (<div className={styles.post}>
        <div className={styles.post__header}>
            Ид. комментария: {comment.commentId}, время:{" "}
            {new Date(comment.date).toLocaleString("ru-RU")}
        </div>

        <div className={styles["post__message-container"]}>
            <pre className={styles.post__message}>{comment.message}</pre>
        </div>
    </div >
    );
};

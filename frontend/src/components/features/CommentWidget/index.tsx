import { PostComment } from "@/types";
import styles from './styles.module.css';
import { NavLink } from "react-router-dom";

export const CommentWidget = (comment: PostComment) => {
    return (
        <div className={styles.comment}>
            <NavLink
                className={styles["post__comments-link"]}
                to={`/users/${comment.author.accountId}`}
            >
                <div className={styles.comment__ava}>

                    <img
                        src={`data:image/jpeg;base64,${comment.author.ava}`}
                    />
                </div>
            </NavLink>

            <div className={styles.comment__info}>
                <div className={styles.comment__header}>

                    {comment.author.accountName}&nbsp;
                    Ид. комментария: {comment.commentId}, время:{" "}
                    {new Date(comment.date).toLocaleString("ru-RU")}
                </div>


                <div className={styles.comment__text}>
                    {comment.message}
                </div>
            </div>
        </div >
    );
};

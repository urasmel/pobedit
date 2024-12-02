import { PostComment } from "@/types";
import styles from './styles.module.css';
import { NavLink, useParams } from "react-router-dom";

export const CommentWidget = (comment: PostComment) => {
    return (
        <div className={styles.comment}>
            <div className={styles.connent__ava}>

                <NavLink
                    className={styles["post__comments-link"]}
                    to={`/users/${comment.author.accountId}`}
                >
                    <img
                        src={`data:image/jpeg;base64,${comment.author.ava}`}
                    />
                </NavLink>
            </div>

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

import { Comment } from '@/entities/comments/model/Comment';
import styles from './styles.module.css';
import { NavLink } from "react-router-dom";

export const CommentWidget = (comment: Comment) => {
    return (
        <div className={styles.comment}>
            <NavLink
                className={styles["post__comments-link"]}
                to={`/account/${comment.from.tlg_id}`}
            >
                <div className={styles.comment__ava}>

                    {
                        comment.from.photo !== null ?
                            <img
                                src={`data:image/jpeg;base64,${comment.from.photo}`}
                                alt='User Avatar'
                            />
                            :
                            <img
                                src={`${import.meta.env.BASE_URL}ava.png`}
                                alt='User Avatar'
                            />
                    }
                </div>
            </NavLink>

            <div className={styles.comment__info}>
                <div className={styles.comment__header}>

                    {comment.from.username}&nbsp;
                    Ид. комментария: {comment.tlgId}, время:{" "}
                    {new Date(comment.date).toLocaleString("ru-RU")}
                </div>


                <div className={styles.comment__text}>
                    {comment.message}
                </div>
            </div>
        </div >
    );
};

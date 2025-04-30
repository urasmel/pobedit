import { Comment } from '@/entities/comments/model/Comment';
import styles from './styles.module.css';
import { NavLink } from "react-router-dom";
import { Avatar } from '@mui/material';

export const CommentWidget = (comment: Comment) => {

    return (
        <div className={styles.comment}>
            <NavLink
                className={styles["post__comments-link"]}
                to={`/accounts/${comment.from.tlg_id}`}
            >
                {
                    comment.from.photo !== null ?
                        <Avatar
                            sx={{ width: 56, height: 56 }}
                            alt="User Avatar"
                            src={`data:image/jpeg;base64,${comment.from.photo}`}
                        />
                        :
                        <Avatar
                            sx={{ width: 56, height: 56 }}
                            alt="User Avatar"
                            src={`${import.meta.env.BASE_URL}ava.png`}
                        />
                }
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

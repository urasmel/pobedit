import styles from "./Comments.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { useInView } from "react-intersection-observer";
import Loading from '@/shared/components/Loading';
import ScrollToTopButton from "@/shared/components/ScrollToTopButton";
import { ErrorAction } from "@/shared/components/ErrorrAction";
import { CommentWidget } from "@/features/CommentWidget";
import UseCommentsFetch from "@/shared/api/hooks/UseCommentsFetch";
import { NoCommentsData } from "@/shared/components/NoCommentsData";


export const Comments = () => {
    const { user, channelId, postId } = useParams();
    const [count] = useState(20);


    const { ref, inView } = useInView({
        threshold: 0,
    });


    const { comments, commentsLoading, commentsLoadingError, setOffset, setCommentsLoadingError } = UseCommentsFetch(user, channelId, postId);

    const handleErrorClose = () => {
        setCommentsLoadingError(false);
    };

    useEffect(() => {
        if (inView) {
            setOffset(() => comments.length);
        }
    }, [inView]);

    return (
        <div className={styles.post__comments}>

            {
                commentsLoading === 'After' &&
                comments.length === 0 &&
                <div className={styles['posts-no-data']}>
                    <NoCommentsData userName={user} channelId={channelId ? +channelId : undefined} postId={postId ? +postId : undefined} />
                </div>
            }

            {
                comments.length !== 0 &&
                <>
                    {
                        comments.map((comment) => (
                            <CommentWidget key={comment.commentId} {...comment} />
                        ))
                    }
                </>
            }

            {
                commentsLoading === 'Processing' &&
                <div className="channel__posts-loading">
                    <Loading />
                </div>
            }

            <div className={styles['intersection-guard']} ref={ref} >
                {`Header inside viewport ${inView}.`}
            </div>

            <div className={styles['intersection-guard']} ref={ref} >
                {`Header inside viewport ${inView}.`}
            </div>

            <ScrollToTopButton />

            <Snackbar
                open={commentsLoadingError}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                message={"Error fetching comments"}
                action={ErrorAction(handleErrorClose)}
            />

        </div>
    );
};

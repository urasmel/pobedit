import styles from "./Comments.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { useInView } from "react-intersection-observer";
import Loading from '@/shared/components/Loading';
import ScrollToTopButton from "@/shared/components/ScrollToTopButton";
import { ErrorAction } from "@/shared/components/ErrorrAction";
import { CommentWidget } from "@/features/CommentWidget";
import { NoCommentsData } from "@/shared/components/NoCommentsData";
import { Action, MainState, useMainStore } from "@/app/stores";
import { commentApi } from "@/entities/comments/intex";
import { useQuery } from "@tanstack/react-query";


export const Comments = () => {

    const { channelId, postId } = useParams();
    const selectedUser = useMainStore(
        (state: MainState & Action) => state.selectedUser
    );

    const [count] = useState(20);
    const { ref, inView } = useInView({
        threshold: 0,
    });

    const { data, isFetching, isLoading, isError, error, isFetched } = useQuery(commentApi.commentQueries.list(selectedUser, channelId, postId));

    const handleErrorClose = () => {
        // setCommentsLoadingError(false);
    };

    useEffect(() => {
        // if (inView) {
        //     setOffset(() => comments.length);
        // }
    }, [inView]);

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <Loading />
            </div>
        );
    }

    return (
        <div className={styles.post__comments}>

            {
                isFetched &&
                data?.comments.length === 0 &&
                <div className={styles['posts-no-data']}>
                    <NoCommentsData
                        userName={selectedUser}
                        channelId={channelId ? +channelId : undefined}
                        postId={postId ? +postId : undefined}
                    />
                </div>
            }

            {
                data?.comments.length !== 0 &&
                <>
                    {
                        data?.comments.map((comment) => (
                            <CommentWidget key={comment.tlgId} {...comment} />
                        ))
                    }
                </>
            }

            {
                isFetching &&
                <div className="channel__posts-loading">
                    <Loading />
                </div>
            }

            <div className={styles['intersection-guard']} ref={ref} >
                {`Header inside viewport ${inView}.`}
            </div>

            <ScrollToTopButton />

            <Snackbar
                open={isError}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                message={error?.message}
                action={ErrorAction(handleErrorClose)}
            />

        </div>
    );
};

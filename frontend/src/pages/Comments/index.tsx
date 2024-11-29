import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { useInView } from "react-intersection-observer";
import Loading from "@/components/common/Loading";
import { NoChannelData } from "@/components/common/NoChannelData";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import InfoPapper from "@/components/common/InfoPapper";
import { ErrorAction } from "@/components/common/ErrorrAction";
import { CommentWidget } from "@/components/features/CommentWidget";
import { fetchComments } from "@/api/comments";
import { PostComment } from "@/types";


const Comments = () => {
    const { user, channelId, postId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [offset, setOffset] = useState(0);
    const [count] = useState(20);
    const [comments, setComments] = useState<PostComment[]>([]);

    const handleErrorClose = () => {
        setOpenErrorMessage(false);
    };

    // For intersection-guard.
    // const { ref, inView, entry } = useInView({
    const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(() => true);
            setIsError(() => false);
            if (channelId && inView) {
                const fetchedComments = await fetchComments(
                    user,
                    parseInt(channelId),
                    postId,
                    offset,
                    count
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setOffset(() => offset + count);
                if (fetchedComments == undefined) {
                    setIsError(() => true);
                    setErrorMessage("Ошибка загрузки комментариев к посту");
                    setOpenErrorMessage(true);
                }
                else {
                    setComments([...comments, ...fetchedComments]);
                }
            }
            setIsLoading(false);
        };

        fetchData().catch(console.error);
    }, [inView]);

    return (
        <div className={styles.comments}>

            {
                isLoading
                    ?
                    <Loading />
                    :
                    <>

                        {
                            isError
                                ?
                                <InfoPapper message={'Во время запроса комментариев произошла ошибка...'} />
                                :
                                <>

                                    {
                                        comments == undefined || comments.length == 0
                                            ?
                                            <div className={styles['comments-no-data']}>
                                                <NoChannelData userName={user} channelId={channelId ? +channelId : undefined} />
                                            </div>
                                            :
                                            <>
                                                {
                                                    comments.map((comment: Comment) => (
                                                        <CommentWidget  {...comment} key={comment.} />
                                                    ))
                                                }

                                            </>
                                    }
                                </>
                        }
                    </>
            }

            <div className={styles['intersection-guard']} ref={ref} >
                {`Header inside viewport ${inView}.`}
            </div>

            <ScrollToTopButton />

            <Snackbar
                open={openErrorMessage}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                message={errorMessage}
                action={ErrorAction(handleErrorClose)}
            />

        </div>
    );
};

export default Comments;

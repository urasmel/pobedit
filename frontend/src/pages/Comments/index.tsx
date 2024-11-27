import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { MainState, Action, useMainStore } from "@/store/MainStore";
import { useParams } from "react-router-dom";
import PostWidget from "@/components/features/PostWidget";
import { Snackbar } from "@mui/material";
import { useInView } from "react-intersection-observer";
import Loading from "@/components/common/Loading";
import { NoChannelData } from "@/components/common/NoChannelData";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import InfoPapper from "@/components/common/InfoPapper";
import { ErrorAction } from "@/components/common/ErrorrAction";


const Comments = () => {
    const { user, channelId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [offset, setOffset] = useState(0);
    const [count] = useState(20);

    const channelPostsDict = useMainStore(
        (state: MainState) => state.channelPostsDict
    );

    const handleErrorClose = () => {
        setOpenErrorMessage(false);
    };

    // For intersection-guard.
    // const { ref, inView, entry } = useInView({
    const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        const fetchComments = async () => {
            if (typeof user !== "string" || !user) {
                return;
            }

            setIsLoading(() => true);
            setIsError(() => false);
            if (channelId && inView) {
                const wasSuccess = await fetchChannelPosts(
                    user,
                    parseInt(channelId),
                    offset,
                    count
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setOffset(() => offset + count);
                if (!wasSuccess) {
                    setIsError(() => true);
                    setErrorMessage("Error while fetching channel posts");
                    setOpenErrorMessage(true);
                }
            }
            setIsLoading(false);
        };

        fetchComments().catch(console.error);
    }, [inView]);

    return (
        <div className={styles.posts}>

            {
                isLoading
                    ?
                    <Loading />
                    :
                    <>

                        {
                            isError
                                ?
                                <InfoPapper message={'Во время запроса данных произошла ошибка...'} />
                                :
                                <>

                                    {
                                        channelPostsDict.posts.length == 0
                                            ?
                                            <div className={styles['posts-no-data']}>
                                                <NoChannelData userName={user} channelId={channelId ? +channelId : undefined} />
                                            </div>
                                            :
                                            <>
                                                {
                                                    channelPostsDict.posts.map((post) => (
                                                        <PostWidget key={post.postId} {...post} />
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

import { useQuery } from "@tanstack/react-query";
import { postsApi } from "..";
import { getLocalizedErrorMessage } from "@/shared/errors/errorMessages";
import { t } from "i18next";
import { useEffect, useState } from "react";

export const useFetchPosts = (channelId: string | undefined, offset: number, limit: number) => {

    const { data,
        isFetching,
        isLoading,
        isError,
        error,
        isFetched } = useQuery(postsApi.postsQueries.list(channelId, offset, limit));

    const [postsError, setPostsError] = useState(false);
    const postsErrorMsg = getLocalizedErrorMessage(error, t);

    useEffect(() => {
        if (error) {
            setPostsError(true);
        }
    }, [error]);

    const handlePostsErrorClose = () => {
        setPostsError(false);
    };

    return {
        posts: data?.posts,
        postsError,
        postsErrorMsg,
        isFetched,
        isFetching,
        isLoading,
        isError,
        handlePostsErrorClose
    };
};

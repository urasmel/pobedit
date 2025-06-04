import { useQuery } from "@tanstack/react-query";
import { postsApi } from "..";
import { getLocalizedString } from "@/shared/locales/localizing";
import { t } from "i18next";
import { useEffect, useState } from "react";

export const useFetchPostsCount = (channelId: string | undefined) => {

    const { data, error, isLoading } = useQuery(postsApi.postsQueries.count(channelId?.toString()));
    const [postsCountError, setPostsCountError] = useState(false);
    const postsCountErrorMsg = getLocalizedString(error, t);

    useEffect(() => {
        if (error) {
            setPostsCountError(true);
        }
    }, [error]);

    const handlePostsCountErrorClose = () => {
        setPostsCountError(false);
    };

    return {
        postsCount: data?.posts_count,
        postsCountError,
        postsCountErrorMsg,
        isPostsCountLoading: isLoading,
        handlePostsCountErrorClose
    };
};

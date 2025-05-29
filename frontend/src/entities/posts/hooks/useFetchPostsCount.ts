import { useQuery } from "@tanstack/react-query";
import { postsApi } from "..";
import { getLocalizedErrorMessage } from "@/shared/errors/errorMessages";
import { t } from "i18next";
import { useEffect, useState } from "react";

export const useFetchPostsCount = (channelId: string | undefined) => {

    const { data: count, error: postsCountError } = useQuery(postsApi.postsQueries.count(channelId?.toString()));
    const [countError, setCountError] = useState(false);
    const postCountMsg = getLocalizedErrorMessage(postsCountError, t);

    useEffect(() => {
        if (postsCountError) {
            setCountError(true);
        }
    }, [postsCountError]);

    const handlePostCountErrorClose = () => {
        setCountError(false);
    };

    return {
        count,
        countError,
        postCountMsg,
        handlePostCountErrorClose
    };
};

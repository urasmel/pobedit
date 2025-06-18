import { useQuery } from "@tanstack/react-query";
import { commentsApi } from "..";
import { getLocalizedString } from "@/shared/locales/localizing";
import { t } from "i18next";
import { useEffect, useState } from "react";

export const useFetchCommentsCount = (channelId: string | undefined, postId: string | undefined) => {

    const { data, error, isLoading } = useQuery(commentsApi.commentsQueries.count(channelId?.toString(), postId?.toString()));
    const [commentsCountError, setCommentsCountError] = useState(false);
    const commentsCountErrorMsg = getLocalizedString(error, t);

    useEffect(() => {
        if (error) {
            setCommentsCountError(true);
        }
    }, [error]);

    const handleCommentsCountErrorClose = () => {
        setCommentsCountError(false);
    };

    return {
        commentsCount: data,
        commentsCountError,
        commentsCountErrorMsg,
        isCommentsCountLoading: isLoading,
        handleCommentsCountErrorClose
    };
};

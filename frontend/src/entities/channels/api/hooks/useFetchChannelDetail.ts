import { useQuery } from "@tanstack/react-query";
import { getLocalizedErrorMessage } from "@/shared/errors/errorMessages";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { channelsApi } from "../..";

export const useFetchChannelDetail = (channelId: string | undefined) => {

    const { data,
        isError,
        isLoading,
        error
    } = useQuery(channelsApi.channelQueries.details(channelId));

    const [channelInfoError, setChannelInfoError] = useState(false);
    const channelInfoErrorMsg = getLocalizedErrorMessage(error, t);

    useEffect(() => {
        if (error) {
            setChannelInfoError(true);
        }
    }, [error]);

    const handleChannelInfoErrorClose = () => {
        setChannelInfoError(false);
    };

    return {
        channelInfo: data,
        channelInfoError,
        channelInfoIsLoading: isLoading,
        channelInfoErrorMsg,
        channelInfoIsError: isError,
        handleChannelInfoErrorClose
    };
};

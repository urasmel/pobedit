import { useQuery } from "@tanstack/react-query";
import { channelsApi } from "@/entities/channels";
import { useSnackbar } from 'notistack';
import { useTranslation } from "react-i18next";
import { getLocalizedString } from "@/shared/locales/localizing";

export const useChannelsQuery = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    return useQuery({
        ...channelsApi.channelQueries.list(),
        onError: (error) => {
            const errorMsg = getLocalizedString(error, t);
            enqueueSnackbar(errorMsg, { variant: 'error' });
        }
    });
};

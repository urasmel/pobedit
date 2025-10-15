import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from "react-i18next";
import { getLocalizedString } from "@/shared/locales/localizing";
import { queryClient } from "@/shared/api/query-client";
import { channelsApi } from "@/entities/channels";
import { Action, useMainStore } from "@/app/stores";

export const useChannelsActions = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const updateChannels = useMainStore((action: Action) => action.fetchUpdatedChannels);

    const handleUpdateChannels = useCallback(async () => {
        try {
            await updateChannels();
            await queryClient.invalidateQueries({
                queryKey: channelsApi.channelQueries.channels()
            });
            enqueueSnackbar(
                t("channels.updateSuccess") || "Каналы успешно обновлены.",
                { variant: 'success' }
            );
            return true;
        } catch (error) {
            const errorMsg = getLocalizedString(error as Error, t);
            enqueueSnackbar(errorMsg, { variant: 'error' });
            return false;
        }
    }, [updateChannels, enqueueSnackbar, t]);

    return { handleUpdateChannels };
};

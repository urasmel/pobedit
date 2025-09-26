import { settingsApi } from "@/entities/settings";
import { Box, Skeleton, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { saveSettings } from "@/entities/settings/api";
import { useEffect, useMemo } from "react";
import { queryClient } from "@/shared/api/query-client";
import { Settings } from "@/entities/settings/model/settings";
import { LoadingWidget } from "@/shared/components/loading/loading-widget";
import { useTranslation } from 'react-i18next';
import { getLocalizedString } from "@/shared/locales/localizing";
import { CustomizedSlider } from "@/shared/components/number-input";
import { enqueueSnackbar } from "notistack";
import { debounce } from 'lodash';

export const SettingsPage = () => {
    const { t } = useTranslation();
    const { data, isLoading, isError, error } = useQuery(settingsApi.settingsQueries.all());

    const debouncedUpdate = useMemo(
        () => debounce((partialSettings: Partial<Settings>) => {
            if (!data) return;
            settingsMutation.mutate({ ...data, ...partialSettings });
        }, 300),
        [data]
    );

    useEffect(() => {
        if (isError) {
            enqueueSnackbar(getLocalizedString(error, t), { variant: 'error' });
        }
    }, [isError]);

    useEffect(() => {
        // Очистка debounce при размонтировании
        return () => {
            debouncedUpdate.cancel();
        };
    }, [debouncedUpdate]);

    const settingsMutation = useMutation({
        mutationFn: saveSettings,
        onSuccess: () => {
            enqueueSnackbar(t('success.updateSettings'), { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: settingsApi.settingsQueries.prefix });
        },
        onError: (error) => {
            enqueueSnackbar(getLocalizedString(error, t), { variant: 'error' });
        },
    });

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                }}
            >
                <LoadingWidget />

            </Box>
        );
    }

    if (!data) {
        return <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                fontSize: "1.2rem",
                fontFamily: "'Roboto', sans-serif",
                padding: "1rem",
            }}
        >
            {getLocalizedString(new Error('error.fetchSettings'), t)}
        </Box>;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 2,
                width: "350px",
                boxSizing: "content-box",
                fontFamily: "'Roboto', sans-serif",
                fontSize: "16px",
                p: 2,
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <Typography
                    lineHeight={"1rem"}
                    fontSize={"1.1rem"}
                    color="#717275"
                >
                    Стартовая дата загрузки
                </Typography>

                <DatePicker
                    sx={{
                        color: "#344767",
                        width: "100%",
                    }}
                    value={dayjs(data.startGatherDate)}
                    onChange={(value) => {
                        if (!value) return;
                        debouncedUpdate({
                            startGatherDate: value.toDate()
                        });
                    }}
                    disabled={settingsMutation.isPending}
                />
            </LocalizationProvider>

            <CustomizedSlider
                caption="Частота опроса каналов (ч.)"
                min={1}
                max={24}
                id="channel-polling-frequency"

                value={data?.channelPollingFrequency ?? 1}
                onChange={(value) => {
                    debouncedUpdate({ channelPollingFrequency: value });
                }}
                disabled={settingsMutation.isPending}
            />

            <CustomizedSlider
                caption="Задержка опроса комментариев (ч.)"
                min={1}
                max={24}
                id="comments-polling-delay"
                value={data?.commentsPollingDelay ?? 1}
                onChange={(value) => {
                    debouncedUpdate({ commentsPollingDelay: value });
                }}
                disabled={settingsMutation.isPending}
            />

        </Box>
    );
};

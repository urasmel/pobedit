import { settingsApi } from "@/entities/settings";
import { Box, Typography } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { saveSettings } from "@/entities/settings/api";
import { useEffect } from "react";
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

    useEffect(() => {
        if (isError) {
            enqueueSnackbar(getLocalizedString(error, t), { variant: 'error' });
        }
    }, [isError]);

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

    const handleUpdate = (partialSettings: Partial<Settings>) => {
        if (!data) return;
        settingsMutation.mutate({ ...data, ...partialSettings });
    };

    const debouncedUpdate = debounce(handleUpdate, 300);

    if (isLoading) {
        return (<Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <LoadingWidget />

        </Box>);
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
            }}
        >
            Не удалось получить настройки
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
                height: "100%",
                boxSizing: "border-box",
                fontFamily: "'Roboto', sans-serif",
                fontSize: "16px"
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
            />

        </Box>
    );
};

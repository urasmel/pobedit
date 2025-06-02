import { settingsApi } from "@/entities/settings";
import { Box } from "@mui/material";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { saveSettings } from "@/entities/settings/api";
import { useEffect, useState } from "react";
import { queryClient } from "@/shared/api/query-client";
import { Settings } from "@/entities/settings/model/settings";
import { LoadingWidget } from "@/shared/components/loading/loading-widget";
import { useTranslation } from 'react-i18next';
import { getLocalizedErrorMessage } from "@/shared/errors/errorMessages";
import CustomizedSlider from "@/shared/components/number-input/number-input";
import { enqueueSnackbar } from "notistack";

export const SettingsPage = () => {
    const { t } = useTranslation();
    const { data, isLoading, isError, error } = useQuery(settingsApi.settingsQueries.all());
    const [settings, setSettings] = useState<Settings>({ startGatherDate: new Date(), channelPollingFrequency: 3, commentsPollingDelay: 3 });

    useEffect(() => {
        if (isError) {
            enqueueSnackbar(getLocalizedErrorMessage(error, t), { variant: 'error' });
        }
    }, [isError]);

    useEffect(() => {
        if (data) {
            setSettings(data);
            console.log('data', data);
        }
    }, [data]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            mutation.mutate(settings);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [settings]);

    const mutation = useMutation({
        mutationFn: (settings: Settings) => { return saveSettings(settings); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settingsApi.settingsQueries.all() });
        },
    });

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
            {
                isLoading
                    ? <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <LoadingWidget />
                    </Box>
                    :
                    <>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                            <DemoContainer components={['DatePicker',]}>
                                <DemoItem label="Стартовая дата загрузки">
                                    <DatePicker
                                        defaultValue={dayjs(data?.startGatherDate)}
                                        onChange={(newValue) => {
                                            let newSettings = { ...settings, startGatherDate: newValue as Date } as Settings;
                                            setSettings(_ => newSettings);
                                        }}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>

                        <CustomizedSlider
                            caption="Частота опроса каналов (ч.)"
                            min={1}
                            max={24}
                            value={settings?.channelPollingFrequency ? settings?.channelPollingFrequency : 1}
                            id="channel-polling-frequency"
                            onChange={(newValue) => {
                                let newSettings = { ...settings, channelPollingFrequency: newValue as number } as Settings;
                                setSettings(_ => newSettings);
                            }}
                        />

                        <CustomizedSlider
                            caption="Задержка опроса комментариев (ч.)"
                            min={1}
                            max={24}
                            value={settings?.commentsPollingDelay ? settings?.commentsPollingDelay : 1}
                            id="comments-polling-delay"
                            onChange={(newValue) => {
                                let newSettings = { ...settings, commentsPollingDelay: newValue as number } as Settings;
                                setSettings(_ => newSettings);
                            }}
                        />
                    </>
            }

        </Box>
    );
};

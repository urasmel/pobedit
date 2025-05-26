import { settingsApi } from "@/entities/settings";
import { Alert, Box, Button, Snackbar } from "@mui/material";
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
import { Loading } from "@/shared/components/loading/loading-widget";
import { useTranslation } from 'react-i18next';
import { getLocalizedErrorMessage } from "@/shared/errors/errorMessages";

export const SettingsPage = () => {
    const { t } = useTranslation();
    const { data: settings, isLoading, isError, error } = useQuery(settingsApi.settingsQueries.all());
    const [errorMessage, setErrorMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const errorMsg = getLocalizedErrorMessage(error, t);

    useEffect(() => {
        if (isError) setSnackbarOpen(true);
    }, [isError]);

    const mutation = useMutation({
        mutationFn: (settings: Settings) => { return saveSettings(settings); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settingsApi.settingsQueries.all() });
        },
    });


    const closeError = () => {
        setErrorMessage("");
        setSnackbarOpen(false);
    };

    return (
        <Box
            sx={{
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 2,
                height: "100%",
                boxSizing: "border-box",
                fontFamily: "'Roboto', sans-serif",
            }}
        >
            {
                isLoading
                    ?
                    <Loading />
                    :
                    <>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                            <DemoContainer
                                components={[
                                    'DatePicker',
                                ]}
                            >
                                <DemoItem label="Стартовая дата загрузки">
                                    <DatePicker
                                        defaultValue={dayjs(settings?.startGatherDate)}
                                        onChange={(newValue) => {
                                            mutation.mutate({ startGatherDate: newValue as Date });
                                        }}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                    </>
            }



            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                // action={ErrorAction(closeError)}
                onClose={closeError}
            >
                <Alert
                    onClose={closeError}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
};

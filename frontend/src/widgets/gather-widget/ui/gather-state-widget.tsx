import { Box, Button } from "@mui/material";
import { GatherStateItem } from "./gather-state-item";
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useQuery } from "@tanstack/react-query";
import { gatherStateApi } from "@/entities/gather-state";
import { numToTime } from "@/shared/utils/num-to-time";
import { useEffect, useMemo, useState } from "react";
import { LoadingWidget } from "@/shared/components/loading/loading-widget";
import { enqueueSnackbar } from "notistack";
import { getLocalizedString } from "@/shared/locales/localizing";
import { t } from "i18next";
import { gatherStart } from "@/entities/gather-state/api";
import { gatherStop } from "@/entities/gather-state/api";
import { queryClient } from "@/shared/api/query-client";

export const GatherStateWidget = () => {

    const { data: gatherState, isLoading, isError, error } = useQuery(gatherStateApi.gatherStateQueries.gather_state());
    const [startResult, setStartResult] = useState(false);

    const errorMsg = getLocalizedString(error, t);

    const frendlyState = useMemo(() => {
        if (gatherState?.state === "running")
            return "Работает";
        else if (gatherState?.state === "stopped")
            return "Остановлено";
        else if (gatherState?.state === "paused")
            return "Пауза";
        return "Неизвестно";
    }, [gatherState?.state]);

    useEffect(() => {
        if (isError) {
            enqueueSnackbar(errorMsg, { variant: 'error' });
        }

    }, [isError]);

    const start = async () => {
        const result = await gatherStart();
        setStartResult(result);
        if (result) {
            enqueueSnackbar("Скачивание успешно запущено", { variant: 'success' });
            console.log('gather start success');
        }
        else {
            enqueueSnackbar("Запуск скачивания завершился неудачей", { variant: 'error' });
            console.log('gather start failure');
        }
        queryClient.invalidateQueries({ queryKey: gatherStateApi.gatherStateQueries.gather_state_key() });
    };

    const stop = async () => {
        const result = await gatherStop();
        setStartResult(result);
        if (result) {
            enqueueSnackbar("Скачивание успешно сотановлено", { variant: 'success' });
        }
        else {
            enqueueSnackbar("Остановка скачивания завершилось неудачей", { variant: 'error' });
        }
    };

    if (isLoading) {
        return (<Box
            sx={{
                p: 2,
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--strong-shadow)",
                gap: 2,
                minHeight: "18rem",
                minWidth: "15rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <LoadingWidget />
        </Box>);
    }

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--weak-shadow)",
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
        >
            <GatherStateItem
                caption="Состояние"
                value={frendlyState ?? "Неизвестно"}
                icon="Telegram"
                color="primary"
            />

            <GatherStateItem
                caption="До опроса каналов"
                value={numToTime(gatherState?.toPollingChannelsSecs ?? 0)}
                icon="Time"
                color="secondary" />

            <GatherStateItem
                caption="До опроса комментариев"
                value={numToTime(gatherState?.toPollingCommentsSecs ?? 0)}
                icon="Comment"
                color="ternary" />

            {
                gatherState?.state === "running" || gatherState?.state === "paused" ?
                    (!isError && <Button variant="outlined" onClick={stop} startIcon={<StopCircleIcon />}>
                        Остановить
                    </Button>)
                    :
                    (!isError && <Button variant="outlined" onClick={start} startIcon={<PlayCircleOutlineIcon />}>
                        Запустить
                    </Button>)
            }

        </Box >
    );
};

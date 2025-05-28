import { Box, Button } from "@mui/material";
import { GatherStateItem } from "./gather-state-item";
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useQuery } from "@tanstack/react-query";
import { gatherStateApi } from "@/entities/gather-state";
import { numToTime } from "@/shared/utils/num-to-time";
import { useMemo } from "react";

export const GatherStateWidget = () => {

    const { data: gatherState } = useQuery(gatherStateApi.gatherStateQueries.all());

    const frendlyState = useMemo(() => {
        return gatherState?.state === "running" ? "Работает" :
            gatherState?.state === "stopped" ? "Остановлено" : "Неизвестно";
    }, [gatherState?.state]);

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 1,
                boxShadow: "var(--shadow)",
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
                value={numToTime(gatherState?.toPollingChannels ?? 0)}
                icon="Time"
                color="secondary" />

            <GatherStateItem
                caption="До опроса комментариев"
                value={numToTime(gatherState?.toPollingComments ?? 0)}
                icon="Comment"
                color="ternary" />

            {
                gatherState?.state === "running" ?
                    <Button variant="outlined" startIcon={<StopCircleIcon />}>
                        Остановить
                    </Button>
                    :
                    <Button variant="outlined" startIcon={<PlayCircleOutlineIcon />}>
                        Запустить
                    </Button>
            }

        </Box >
    );
};

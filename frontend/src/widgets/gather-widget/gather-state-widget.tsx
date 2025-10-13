import { Box } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gatherStateApi } from "@/entities/gather-state";
import { gatherStart, gatherStop } from "@/entities/gather-state/api";
import { numToTime } from "@/shared/utils/num-to-time";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { enqueueSnackbar } from "notistack";
import { getLocalizedString } from "@/shared/locales/localizing";
import { useTranslation } from "react-i18next";
import { GatherStateItem } from "./ui/gather-state-item";
import { ActionButtons, LoadingState } from "./ui";

// Константы для избежания magic strings
const GATHER_STATES = {
    RUNNING: "running",
    STOPPED: "stopped",
    PAUSED: "paused",
} as const;

const POLLING_INTERVAL = 10000; // 10 секунд

export const GatherStateWidget = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Запрос состояния
    const {
        data: gatherState,
        isLoading,
        isError,
        error
    } = useQuery(gatherStateApi.gatherStateQueries.gather_state());

    // Мутации для старта/стопа
    const startMutation = useMutation({
        mutationFn: gatherStart,
        onSuccess: (result) => {
            if (result) {
                enqueueSnackbar(t("gather.startSuccess"), { variant: 'success' });
                // startPolling();
            } else {
                enqueueSnackbar(t("gather.startFailure"), { variant: 'error' });
            }
        },
        onError: () => {
            enqueueSnackbar(t("gather.startFailure"), { variant: 'error' });
        },
        onSettled: () => {
            invalidateGatherState();
        }
    });

    const stopMutation = useMutation({
        mutationFn: gatherStop,
        onSuccess: (result) => {
            if (result) {
                enqueueSnackbar(t("gather.stopSuccess"), { variant: 'success' });
            } else {
                enqueueSnackbar(t("gather.stopFailure"), { variant: 'error' });
            }
        },
        onError: () => {
            enqueueSnackbar(t("gather.stopFailure"), { variant: 'error' });
        },
        onSettled: () => {
            stopPolling();
            invalidateGatherState();
        }
    });

    // Логика опроса состояния
    const startPolling = useCallback(() => {
        stopPolling(); // Останавливаем предыдущий таймер

        timerRef.current = setInterval(() => {
            console.log("Polling... state");
            invalidateGatherState();
        }, POLLING_INTERVAL);
    }, []);

    const stopPolling = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const invalidateGatherState = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: gatherStateApi.gatherStateQueries.gather_state_key()
        });
    }, [queryClient]);

    // Обработка ошибок
    useEffect(() => {
        if (isError && error) {
            const errorMsg = getLocalizedString(error, t);
            enqueueSnackbar(errorMsg, { variant: 'error' });
        }
    }, [isError, error, t]);

    // Останавливаем опрос при размонтировании
    useEffect(() => {
        startPolling();
        return () => {
            stopPolling();
        };
    }, [stopPolling]);

    // useEffect(() => {
    //     startPolling();
    // }, []);

    // Мемоизированные значения
    const friendlyState = useMemo(() => {
        const stateMap = {
            [GATHER_STATES.RUNNING]: t("gather.stateRunning"),
            [GATHER_STATES.STOPPED]: t("gather.stateStopped"),
            [GATHER_STATES.PAUSED]: t("gather.statePaused"),
        };

        return gatherState?.state ? stateMap[gatherState.state] : t("gather.stateUnknown");
    }, [gatherState?.state, t]);

    const isRunning = gatherState?.state === GATHER_STATES.RUNNING;
    const isPaused = gatherState?.state === GATHER_STATES.PAUSED;
    const canStart = !isRunning && !isPaused;
    const canStop = isRunning || isPaused;

    // Обработчики
    const handleStart = useCallback(() => {
        startMutation.mutate();
    }, [startMutation]);

    const handleStop = useCallback(() => {
        stopMutation.mutate();
    }, [stopMutation]);

    // Состояния загрузки
    const isStopping = stopMutation.isPending;
    const isStarting = startMutation.isPending;
    const isActionInProgress = isStopping || isStarting;

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <Box sx={containerStyles}>
            <GatherStateItem
                caption={t("gather.state")}
                value={friendlyState}
                icon="Telegram"
                color="primary"
            />

            <GatherStateItem
                caption={t("gather.toPollingChannels")}
                value={numToTime(gatherState?.toPollingChannelsSecs ?? 0)}
                icon="Time"
                color="secondary"
            />

            <GatherStateItem
                caption={t("gather.toPollingComments")}
                value={numToTime(gatherState?.toPollingCommentsSecs ?? 0)}
                icon="Comment"
                color="ternary"
            />

            {!isError && (
                <ActionButtons
                    canStart={canStart}
                    canStop={canStop}
                    onStart={handleStart}
                    onStop={handleStop}
                    isActionInProgress={isActionInProgress}
                    isStopping={isStopping}
                    isStarting={isStarting}
                />
            )}
        </Box>
    );
};

// Стили
const containerStyles = {
    p: 2,
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--weak-shadow)",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: "280px"
};

import { Button } from "@mui/material";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopCircleIcon from '@mui/icons-material/StopCircle';

interface ActionButtonsProps {
    canStart: boolean;
    canStop: boolean;
    onStart: () => void;
    onStop: () => void;
    isActionInProgress: boolean;
    isStopping: boolean;
    isStarting: boolean;
}

export const ActionButtons = ({
    canStart,
    canStop,
    onStart,
    onStop,
    isActionInProgress,
    isStopping,
    isStarting
}: ActionButtonsProps) => {
    if (canStop) {
        return (
            <Button
                variant="outlined"
                onClick={onStop}
                startIcon={<StopCircleIcon />}
                disabled={isActionInProgress}
                loading={isStopping}
            >
                {isStopping ? "Останавливается..." : "Остановить"}
            </Button>
        );
    }

    if (canStart) {
        return (
            <Button
                variant="outlined"
                onClick={onStart}
                startIcon={<PlayCircleOutlineIcon />}
                disabled={isActionInProgress}
                loading={isStarting}
            >
                {isStarting ? "Запускается..." : "Запустить"}
            </Button>
        );
    }

    return null;
};

ActionButtons.displayName = 'ActionButtons';

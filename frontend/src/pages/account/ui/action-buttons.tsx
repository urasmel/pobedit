import { LoadingWidget } from "@/shared/components/loading";
import { Stack, Button } from "@mui/material";

export interface ActionButtonsProps {
    isTracking: boolean;
    isUpdating: boolean;
    onTrackingToggle: (shouldTrack: boolean) => void;
    onUpdateInfo: () => void;
    onNavigateToComments: () => void;
}

export const ActionButtons = ({
    isTracking,
    isUpdating,
    onTrackingToggle,
    onUpdateInfo,
    onNavigateToComments
}: ActionButtonsProps) => (
    <Stack direction="row" spacing={1}>
        <Button
            variant="contained"
            onClick={onNavigateToComments}
        >
            Все комментарии
        </Button>

        <Button
            variant="contained"
            onClick={onUpdateInfo}
            disabled={isUpdating}
        >
            Обновить информацию
        </Button>

        <Button
            variant="contained"
            onClick={() => onTrackingToggle(!isTracking)}
            color={isTracking ? 'secondary' : 'primary'}
        >
            {isTracking ? 'Перестать отслеживать' : 'Начать отслеживать'}
        </Button>

        {isUpdating && <LoadingWidget size={30} style={{ width: 'auto' }} />}
    </Stack>
);

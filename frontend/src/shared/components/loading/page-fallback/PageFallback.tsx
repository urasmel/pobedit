import { Box } from '@mui/material';
import { LoadingWidget } from '../loading-widget';

export const PageFallback = () => {

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
        }}>
            <LoadingWidget />
        </Box>
    );
};

PageFallback.displayName = 'PageFallback';

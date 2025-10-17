import { LoadingWidget } from "@/shared/components/loading";
import { Box } from "@mui/material";

export const LoadingState = () => (
    <Box sx={loadingContainerStyles}>
        <LoadingWidget />
    </Box>
);

LoadingState.displayName = 'LoadingState';

const loadingContainerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
};

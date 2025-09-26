import { LoadingWidget } from "@/shared/components/loading";
import { Box } from "@mui/material";

export const LoadingState = () => (
    <Box sx={loadingContainerStyles}>
        <LoadingWidget />
    </Box>
);


const loadingContainerStyles = {
    p: 2,
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--strong-shadow)",
    gap: 2,
    minHeight: "18rem",
    minWidth: "15rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

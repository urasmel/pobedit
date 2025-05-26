import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

export const ErrorActionButton = (handleErrorClose: () => void) => (
    <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleErrorClose}
    >
        <CloseIcon fontSize="small" />
    </IconButton>
);

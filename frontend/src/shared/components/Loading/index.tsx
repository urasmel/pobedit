import { Box, CircularProgress } from "@mui/material";

const Loading = () => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
            <CircularProgress />
        </Box>
    );
};

export default Loading;

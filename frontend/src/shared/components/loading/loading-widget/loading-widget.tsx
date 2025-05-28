import { Box, CircularProgress } from "@mui/material";

export const LoadingWidget = () => {


    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            width: "100%",
            aspectRatio: "1 / 1",
            maxWidth: "100px",
        }}>
            <CircularProgress size={"100%"} />
        </Box >
    );
};

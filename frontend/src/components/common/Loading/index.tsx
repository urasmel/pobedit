import { LoadingProps } from "types/Props";
import { Box, CircularProgress } from "@mui/material";

const Loading = (props: LoadingProps) => {
    return (
        props.isLoading
            ?
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, minWidth: 300, alignSelf: "center" }}>
                <CircularProgress />
            </Box>
            :
            <></>
    );
};

export default Loading;

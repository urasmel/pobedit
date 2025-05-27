import { Box } from "@mui/material";
import { ServiceStateItem } from "./service-state-item";

export const ServiceStateWidget = () => {

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 1,
                boxShadow: "var(--shadow)",
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
        >
            <ServiceStateItem caption="Состояние" value="Выполняется" icon="Telegram" color="primary" />
            <ServiceStateItem caption="До опроса каналов" value="1:28" icon="Time" color="secondary" />
            <ServiceStateItem caption="До опроса комментариев" value="2:34" icon="Comment" color="ternary" />

        </Box >
    );
};

import { channelsApi } from "@/entities/channels";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const ChannelPage = () => {
    const { channelId } = useParams();
    const { data: info } = useQuery(channelsApi.channelQueries.details(channelId));

    return (
        <Box
            sx={{
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 2,
                height: "100%",
                boxSizing: "border-box",
                fontFamily: "'Roboto', sans-serif",
            }}
        >
            <Box sx={{ display: "flex", columnGap: "1rem" }}>
                <Box sx={{ width: "10rem", height: "10rem" }}>
                    {
                        info?.image
                            ?
                            <img
                                src={`data:image/jpeg;base64,${info?.image}`}
                            />
                            :
                            <img src="./images/no_image.svg" alt="Нет изображения" width={"100%"} />
                    }
                </Box>
                <Box sx={{ alignSelf: "center", whiteSpace: "pre-wrap" }}>
                    {info?.about}
                </Box>
            </Box>

            <Box sx={{ marginTop: "2rem" }}>
                Подписчиков: {info?.participantsCount}
            </Box>
        </Box>
    );
};

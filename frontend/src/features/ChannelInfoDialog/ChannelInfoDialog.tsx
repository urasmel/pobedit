import { Channel } from "@/entities";
import { Box } from "@mui/material";

export const ChannelInfoDialog = (props: { channel: Channel; }) => {


    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Roboto', sans-serif",
            padding: "1rem",
        }}>
            <Box sx={{ display: "flex", columnGap: "1rem" }}>
                <Box sx={{ width: "10rem", height: "10rem" }}>
                    {
                        props.channel.image
                            ?
                            <img
                                src={`data:image/jpeg;base64,${props.channel.image}`}
                            />
                            :
                            <img src="./images/no_image.svg" alt="Нет изображения" width={"100%"} />
                    }
                </Box>
                <Box sx={{ alignSelf: "center", whiteSpace: "pre-wrap" }}>
                    {props.channel.about}
                </Box>
            </Box>

            <Box sx={{ marginTop: "2rem" }}>
                Подписчиков: {props.channel.participantsCount}
            </Box>
        </Box>
    );
};

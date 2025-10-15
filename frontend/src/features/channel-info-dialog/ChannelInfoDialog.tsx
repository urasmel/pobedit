import { Channel } from "@/entities";
import { Box, Typography, useTheme } from "@mui/material";

export const ChannelInfoDialog = (props: { channel: Channel; }) => {
    const theme = useTheme();


    console.log(props);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            fontFamily: theme.typography.fontFamily,
            padding: "1rem",
        }}>
            <Box sx={{ display: "flex", columnGap: "1rem", alignItems: "center" }}>
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        flexShrink: 0,
                        position: "relative",
                        backgroundColor: theme.palette.grey[200],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>

                    {props.channel.image ? (
                        <img
                            src={`data:image/jpeg;base64,${props.channel.image}`}
                            alt={`Изображение канала ${props.channel.title}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <img
                            src="./images/no_image.svg"
                            alt="Нет изображения"
                            style={{ width: "60%", opacity: 0.6 }}
                        />
                    )}
                </Box>

                {/* Описание канала */}
                <Typography
                    variant="body2"
                    sx={{
                        alignSelf: "center",
                        whiteSpace: "pre-wrap",
                        color: theme.palette.text.secondary,
                        lineHeight: 1.4,
                    }}
                >
                    {props.channel.about || "Описание отсутствует"}
                </Typography>
            </Box>

            {/* Счетчик подписчиков */}
            <Typography
                variant="subtitle2"
                sx={{ marginTop: 3, color: theme.palette.text.primary }}
            >
                Подписчиков: {props.channel.participantsCount.toLocaleString()}
            </Typography>
        </Box>
    );
};

ChannelInfoDialog.displayName = 'ChannelInfoDialog';

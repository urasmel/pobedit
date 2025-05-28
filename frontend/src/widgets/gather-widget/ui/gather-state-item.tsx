import { Box, Typography } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import CommentIcon from '@mui/icons-material/Comment';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

type GatherStateItemProps = {
    caption: string;
    value: string;
    icon: "Telegram" | "Comment" | "Time",
    color: "primary" | "secondary" | "ternary";
};

export const GatherStateItem = (props: GatherStateItemProps) => {

    const IconHelper = (icon: "Telegram" | "Comment" | "Time", color: "primary" | "secondary" | "ternary") => {
        if (icon === "Telegram") {
            return (<TelegramIcon
                sx={{
                    fontSize: 20,
                    color: `${colorIconHelper(color)}`
                }}
            />);
        }
        else if (icon === "Comment")
            return (<CommentIcon
                sx={{
                    fontSize: 20,
                    color: `${colorIconHelper(color)}`
                }}
            />
            );
        else if (icon === "Time")
            return (<TimelapseIcon
                sx={{
                    fontSize: 20,
                    color: `${colorIconHelper(color)}`
                }}
            />);
        else {
            console.log("Ошибка в аргументе выбора иконки");
            return (<AccessAlarmIcon
                sx={{
                    fontSize: 20,
                    color: `${colorIconHelper(color)}`
                }}
            />);
        }
    };

    const colorIconHelper = (color: "primary" | "secondary" | "ternary") => {
        if (color === "primary")
            return "#4d7df2";
        else if (color === "secondary")
            return "#00d41a";
        else if (color === "ternary")
            return "#ff8600";
        else {
            console.log("Ошибка в аргументе выбора цвета иконки");
            return "#e5393";
        }
    };

    const colorBackHelper = (color: "primary" | "secondary" | "ternary") => {
        if (color === "primary")
            return "rgba(77,125,242,.15)";
        else if (color === "secondary")
            return "rgba(0,212,26,.15)";
        else if (color === "ternary")
            return "rgba(255,134,0,.15)";
        else {
            console.log("Ошибка в аргументе выбора цвета фона иконки");
            return "rgba(229,57,53,.15)";
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1
            }}>
            <Box sx={{
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: `${colorBackHelper(props.color)}`,
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {IconHelper(props.icon, props.color)}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}>

                <Typography
                    fontWeight={'fontWeightBold'}
                    lineHeight={"1.2rem"}
                    fontSize={"1.1rem"}
                    color='#29303b'
                >
                    {props.value}
                </Typography>
                <Typography
                    lineHeight={"1.2rem"}
                    fontSize={"1.1rem"}
                    color="#717275"
                >
                    {props.caption}
                </Typography>
            </Box>
        </Box>
    );
};

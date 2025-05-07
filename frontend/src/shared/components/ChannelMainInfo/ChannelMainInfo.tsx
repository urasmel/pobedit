import { ChannelMainInfoProps } from '@/entities/Props';
import { Box } from '@mui/material';

export const ChannelMainInfo = (props: ChannelMainInfoProps) => {
    return (
        <Box sx={{
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "medium",
            display: "flex",
            flexDirection: "column",
            justifyContent: 'start',
            gap: '.5rem',
            borderRadius: '.5rem',
            overflow: "hidden",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
            padding: ".5rem 1rem",
            fontWeight: "500",
            minHeight: "3rem",
            width: "100%",
            height: "100%",
            boxSizing: "border-box"
        }}>
            <Box sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word", color: "rgb(52, 71, 103)" }} >
                Канал: {props.title}
            </Box>
            <Box sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word", color: "rgb(52, 71, 103)" }}>
                Ид.: {props.id}
            </Box>
        </Box>
    );
};

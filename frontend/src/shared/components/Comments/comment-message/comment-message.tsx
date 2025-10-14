import { Box } from "@mui/material";

export const CommentMessage = (props: { message: string; }) => {
    return (
        <Box
            sx={{
                padding: 2,
                fontSize: 16,
                color: "#333",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
            }}>
            {props.message}
        </Box>
    );
};

CommentMessage.displayName = 'CommentMessage';

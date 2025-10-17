import { Box } from "@mui/material";

export const CommentContent = (props: { message: string; }) => {
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

CommentContent.displayName = 'CommentContent';

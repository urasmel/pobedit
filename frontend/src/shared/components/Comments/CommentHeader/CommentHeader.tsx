import { Box } from "@mui/material";
import { Comment } from '@/entities/comments/model/Comment';
import { useContext } from "react";
import { ThemeContext } from "@/app/theme";

export const CommentHeader = ({ comment, showUsername = true }: { comment: Comment; showUsername: boolean; }) => {

    const theme = useContext(ThemeContext);
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                width: "100%",
                backgroundColor: theme.palette.primary.main,
                color: "#333",
            }}
        >
            {showUsername && comment.from.username}&nbsp;
            Ид. комментария: {comment.tlgId}, время:{" "}
            {new Date(comment.date).toLocaleString("ru-RU")}
        </Box>
    );
};

import { Box, Avatar, Typography } from "@mui/material";
import { Comment } from '@/entities/comments/model/Comment';
import { useContext } from "react";
import { ThemeContext } from "@/app/theme";


export const CommentHeader = (props: { comment: Comment; }) => {

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
            {props.comment.from.username}&nbsp;
            Ид. комментария: {props.comment.tlgId}, время:{" "}
            {new Date(props.comment.date).toLocaleString("ru-RU")}
        </Box>
    );
};

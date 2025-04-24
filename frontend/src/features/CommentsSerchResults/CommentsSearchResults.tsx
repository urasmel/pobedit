import { CommentDto } from "@/entities/comments/api/dto/comment.dto";
import { Card, CardContent, Typography } from "@mui/material";

export const CommentsSearchResults = (props: { results: CommentDto[]; }) => {
    return (props.results.map((comment: CommentDto, index: number) => (
        <Card key={index} sx={{ width: "100%" }}>
            <CardContent>
                <Typography variant="body1">
                    <strong>Пользователь:</strong> {comment.from.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {new Date(comment.date).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                    {comment.message}
                </Typography>
            </CardContent>
        </Card>
    )));
};

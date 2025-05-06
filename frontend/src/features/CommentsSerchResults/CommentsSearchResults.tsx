import { CommentWidget } from "@/shared/components/Comments/CommentWidget";
import { Comment } from "@/entities/comments/model/Comment";

export const CommentsSearchResults = (props: { results: Comment[]; }) => {
    return (props.results.map((comment: Comment) => (
        <CommentWidget key={comment.tlgId} comment={comment} showChannel showUsername />
    )));
};

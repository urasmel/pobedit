import { CommentWidget } from "@/shared/components/Comments/comment-widget";
import { Comment } from "@/entities/comments/model/comment";

export const CommentsSearchResults = (props: { results: Comment[]; }) => {
    return (props.results.map((comment: Comment) => (
        <CommentWidget key={comment.tlgId} comment={comment} showPostLink showChannel showUsername />
    )));
};

import { CommentWidget } from "@/shared/components/Comments/comment-widget";
import { Comment } from "@/entities/comments/model/Comment";

export const CommentsSearchResults = (props: { results: Comment[]; }) => {
    return (props.results.map((comment: Comment) => (
        <CommentWidget key={comment.tlgId} comment={comment} showPostLink showChannel showUsername />
    )));
};

CommentsSearchResults.displayName = 'CommentsSearchResults';

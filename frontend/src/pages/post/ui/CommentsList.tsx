import { CommentWidget } from "@/shared/components/Comments/comment-widget";
import { Comment } from "@/entities/comments/model/Comment";

interface CommentsListProps {
    comments: Comment[];
}

export const CommentsList = ({ comments }: CommentsListProps) => (
    <>
        {comments.map((comment) => (
            <CommentWidget
                key={comment.tlgId}
                comment={comment}
                showChannel={false}
                showUsername={true}
                showPostLink={false}
            />
        ))}
    </>
);

CommentsList.displayName = 'CommentsList';

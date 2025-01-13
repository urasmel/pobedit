import { CommentDto } from "../dto/comment.dto";
import { Comment } from "../../model/Comment";

export const mapComment = (dto: CommentDto): Comment => ({
    commentId: dto.commentId,
    channelId: dto.channelId,
    author: dto.author,
    message: dto.message,
    date: dto.date,
    replyTo: dto.replyTo
});

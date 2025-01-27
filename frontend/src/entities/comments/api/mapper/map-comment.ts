import { CommentDto } from "../dto/comment.dto";
import { Comment } from "../../model/Comment";

export const mapComment = (dto: CommentDto): Comment => ({
    tlgId: dto.tlgId,
    postId: dto.postId,
    channelId: dto.channelId,
    author: dto.author,
    message: dto.message,
    date: dto.date,
    replyTo: dto.replyTo
});

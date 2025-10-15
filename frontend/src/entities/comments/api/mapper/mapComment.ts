import { CommentDto } from "../dto/Comment.dto";
import { Comment } from "../../model/Comment";

export const mapComment = (dto: CommentDto): Comment => ({
    tlgId: dto.tlgId,
    postId: dto.postId,
    postTlgId: dto.postTlgId,
    peerId: dto.peerId,
    from: dto.from,
    message: dto.message,
    date: dto.date,
    replyTo: dto.replyTo
});

export const mapComments = (dtos: CommentDto[]): Comment[] => {
    return dtos.map((dto: CommentDto) => mapComment(dto));
};

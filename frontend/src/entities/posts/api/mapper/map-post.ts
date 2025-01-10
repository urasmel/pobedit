import { PostDto } from "../dto/post.dto";
import { Post } from "../../model/Post";

export const mapPost = (dto: PostDto): Post => ({
    id: dto.id,
    peerId: dto.peerId,
    date: dto.date,
    message: dto.message,
    commentsCount: dto.commentsCount
});

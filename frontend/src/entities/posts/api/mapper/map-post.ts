import { PostDto } from "../dto/post.dto";
import { Post } from "../../model/post";

export const mapPost = (dto: PostDto): Post => ({
    tlgId: dto.tlgId,
    peerId: dto.peerId,
    date: dto.date,
    message: dto.message,
    commentsCount: dto.commentsCount
});

export const mapPosts = (dtos: PostDto[]): Post[] => dtos.map(mapPost);

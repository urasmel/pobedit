import { Post, ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";
import { SearchQuery } from "../model/SearchQuery";
import { CommentDto } from "@/entities/comments/api/dto/comment.dto";
import { PostDto } from "@/entities/posts/api/dto/post.dto";
import { mapComments } from "@/entities/comments/api/mapper/map-comment";
import { Comment } from "@/entities/comments/model/Comment";
import { mapPosts } from "@/entities/posts/api/mapper/map-post";


export const postSearch = async (query: SearchQuery | null): Promise<Comment[] | Post[]> => {
    if (query == null) {
        return Promise.resolve([]);
    }

    const result = await apiClient.post<ServiceResponse<CommentDto[] | PostDto[]>>(`search`, { 'body': query });

    if (result.data.length === 0) {
        return Promise.resolve([]);
    }

    if ('commentsCount' in result.data[0]) { // Assuming PostDto has a unique property like 'postId'
        return mapPosts(result.data as PostDto[]) as Post[];
    }
    return mapComments(result.data as CommentDto[]) as Comment[];
};

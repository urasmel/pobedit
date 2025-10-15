import { Post, ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";
import { SearchQuery } from "../model/SearchQuery";
import { CommentDto } from "@/entities/comments/api/dto/Comment.dto";
import { PostDto } from "@/entities/posts/api/dto/Post.dto";
import { mapComments } from "@/entities/comments/api/mapper/mapComment";
import { Comment } from "@/entities/comments/model/Comment";
import { mapPosts } from "@/entities/posts/api/mapper/mapPost";
import { SearchResult } from "../model/SearchResult";


export const postSearch = async (query: SearchQuery | null): Promise<SearchResult<Comment | Post>> => {

    try {
        if (query == null) {
            return Promise.resolve({ totalCount: 0, data: [] });
        }

        const result = await apiClient.post<ServiceResponse<SearchResult<CommentDto | PostDto>>>(`search`, { 'body': query });

        if (result.data.data.length === 0) {
            return Promise.resolve({ totalCount: 0, data: [] });
        }

        if ('commentsCount' in result.data.data[0]) {
            const posts = mapPosts(result.data.data as PostDto[]) as Post[];
            return { totalCount: result.data.totalCount, data: posts };
        }
        else {
            const comments = mapComments(result.data.data as CommentDto[]) as Comment[];
            return { totalCount: result.data.totalCount, data: comments };
        }
    } catch (error) {
        throw new Error("error.fetchSerchQuery");
    }
};

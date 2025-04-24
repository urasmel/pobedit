import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";
import { SearchQuery } from "../model/SearchQuery";
import { CommentDto } from "@/entities/comments/api/dto/comment.dto";
import { PostDto } from "@/entities/posts/api/dto/post.dto";


export const postSearch = async (query: SearchQuery | null): Promise<CommentDto[] | PostDto[]> => {
    if (query == null) {
        return Promise.resolve([]);
    }

    const result = await apiClient.post<ServiceResponse<CommentDto[] | PostDto[]>>(`search`, { 'body': query });

    return result.data as CommentDto[] | PostDto[];
};

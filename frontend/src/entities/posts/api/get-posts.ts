import { ServiceResponse, Post } from "@/entities";
import { apiClient } from "@/shared/api/base";
import { PostDto } from "./dto/post.dto";
import { mapPost } from "./mapper/map-post";

export const getPosts = async (channelId: string | undefined, offset: number, limit: number): Promise<{ posts: Post[]; }> => {
    if (channelId == undefined) {
        return Promise.resolve({ posts: [] });
    }

    const result = await apiClient.get<ServiceResponse<PostDto[]>>(`api/v1/info/channels/${channelId}/posts?offset=${offset}&limit=${limit}`);

    return ({
        posts: result.data.map((post: PostDto) => mapPost(post))
    });
};

export const getPostsCount = async (channelId: string | undefined): Promise<{ posts_count: number; }> => {
    if (channelId == undefined) {
        return Promise.resolve({ posts_count: 0 });
    }

    const result = await apiClient.get<ServiceResponse<number>>(`api/v1/info/channels/${channelId}/posts_count`);

    return ({
        posts_count: result.data
    });
};

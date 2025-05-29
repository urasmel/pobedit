import { ServiceResponse, Post } from "@/entities";
import { apiClient } from "@/shared/api/base";
import { PostDto } from "./dto/post.dto";
import { mapPost } from "./mapper/map-post";
import { ITEMS_PER_PAGE } from "@/shared/config";

export const getPosts = async (
    channelId: string | undefined,
    offset = 0,
    limit = ITEMS_PER_PAGE)
    : Promise<{ posts: Post[]; }> => {
    if (channelId == undefined) {
        return Promise.resolve({ posts: [] });
    }

    const result = await apiClient
        .get<ServiceResponse<PostDto[]>>
        (`channels/${channelId}/posts?offset=${offset}&limit=${limit}`);

    return ({
        posts: result.data.map((post: PostDto) => mapPost(post))
    });
};

export const getPost = async (
    channelId: number | undefined,
    postId: number | undefined)
    : Promise<{ post: Post; } | null> => {

    if (channelId == undefined) {
        return Promise.resolve(null);
    }

    const result = await apiClient
        .get<ServiceResponse<PostDto>>
        (`channels/${channelId}/posts/${postId}`);

    return ({
        post: mapPost(result.data)
    });
};

export const getPostsCount = async (channelId: string | undefined): Promise<{ posts_count: number; }> => {
    if (channelId == undefined) {
        return Promise.resolve({ posts_count: 0 });
    }

    try {
        const result = await apiClient.get<ServiceResponse<number>>(`channels/${channelId}/posts_count`);

        return ({
            posts_count: result.data
        });
    }
    catch (error: Error | any) {
        if (error.message.includes('404')) {
            throw new Error('channelNotFound');
        }
        else if (error.message.includes('500')) {
            throw new Error('serverError');
        }
        else {
            throw new Error('networkError');
        }
    }
};

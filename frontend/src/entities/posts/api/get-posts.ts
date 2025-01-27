import { ServiceResponse, Post } from "@/entities";
import { apiClient } from "@/shared/api/base";
import { PostDto } from "./dto/post.dto";
import { mapPost } from "./mapper/map-post";

export const getPosts = async (channelId: string | undefined): Promise<{ posts: Post[]; }> => {
    if (channelId == undefined) {
        return Promise.resolve({ posts: [] });
    }

    const result = await apiClient.get<ServiceResponse<PostDto[]>>(`api/v1/info/channels/${channelId}/posts`);

    return ({
        posts: result.data.map((post: PostDto) => mapPost(post))
    });
};

import { ServiceResponse, Post } from "@/entities";
import { apiClient } from "@/shared/api/base";
import { PostDto } from "./dto/post.dto";
import { mapPost } from "./mapper/map-post";

export const getPosts = async (user: string | undefined, channelId: string | undefined): Promise<{ posts: Post[]; }> => {
    if (user == undefined || channelId == undefined) {
        return Promise.resolve({ posts: [] });
    }

    const result = await apiClient.get<ServiceResponse<PostDto[]>>(`api/v1/info/users/${user}/channels/${channelId}/posts`);

    return ({
        posts: result.data.map((post: PostDto) => mapPost(post))
    });
};

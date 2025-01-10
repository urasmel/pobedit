import { API_URL } from "@/shared/config";
import { Post, ServiceResponse } from "@/entities";

export const fetchChannelPosts = async (username: string, channelId: number, offset = 0, count = 20): Promise<Post[]> => {

    const request = new Request(`${API_URL}/info/users/${username}/channels/${channelId}/posts?offset=${offset}&count=${count}`,
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
            },
            redirect: 'follow',
            cache: 'no-store'
        });

    const response = await fetch(request);

    if (!response.ok) {
        console.error("Ошибка загрузки постов канала.");
        throw new Error("Ошибка загрузки постов канала.");
    }

    const posts = (await response.json() as ServiceResponse<Post[]>).data;
    return posts;
};

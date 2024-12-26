import { serviceApiVersion, serviceDomain, servicePort, serviceProto } from "@/shared/constants";
import { PostComment, ServiceResponse } from '@/entities';

export const fetchComments = async (user: string, channelId: number, postId: number, offset: number, count: number): Promise<PostComment[] | undefined> => {

    const request = new Request(`${serviceProto}${serviceDomain}:${servicePort}/api/${serviceApiVersion}/info/users/${user}/channels/${channelId}/posts/${postId}/comments?offset=${offset}&count=${count}`,
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
            },
            redirect: 'follow'
        });

    const response = await fetch(request);

    if (!response.ok) {
        console.error('Ошибка загрузки комментариев.');
        throw new Error("Ошибка загрузки комментариев.");
    }

    const comments = (await response.json() as ServiceResponse<PostComment[]>).data;
    return comments;
};

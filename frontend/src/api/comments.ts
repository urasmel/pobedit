import { serviceApiVersion, serviceDomain, servicePort, serviceProto } from "@/constants";
import { PostComment, ServiceResponse } from "@/types";

export const fetchComments = async (user: string, channelId: number, postId: number, offset: number, count: number): Promise<PostComment[] | undefined> => {
    const request = new Request(`${serviceProto}${serviceDomain}:${servicePort}/api/${serviceApiVersion}/users/${user}/channels/${channelId}/posts/${postId}/comments`,
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

    let response;
    try {
        response = await fetch(request);

        if (!response.ok) {
            console.error('Ошибка загрузки комментариев.');
            return;
        }

        const response_content = await response.json() as ServiceResponse<PostComment[]>;
        const data = response_content.data;
        return data;
    } catch (error) {
        console.error(error);
        return;
    }
};

import { serviceApiVersion, serviceDomain, servicePort, serviceProto } from "@/constants";
import { Comment, ServiceResponse } from "@/types";

export const fetchComments = async (user: string, channelId: number, postId: number): Promise<Comment[]> => {
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

    const response = await fetch(request);

    if (!response.ok) {
        throw new Error('Error to fetch users!');
    }

    const response_content = await response.json() as ServiceResponse<Comment[]>;
    const data = response_content.data;
    return data;
};

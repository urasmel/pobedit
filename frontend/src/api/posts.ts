import { gatherDomain, gatherPort, gatherProto, gatherApiVersion } from "@/constants";

export const DownloadChannelPostsFromTelegram = async (userName: string, channelId: number) => {
    const request = new Request(`${gatherProto}${gatherDomain}:${gatherPort}/api/${gatherApiVersion}/info/users/${userName}/channels/${channelId}/updated_messages`,
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

    const { data = [] } = await response.json();

    return data;
};

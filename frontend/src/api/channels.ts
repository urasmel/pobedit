import { channelApiVersion, channelDomain, channelPort, channelProto } from "@/constants";
import { Channel } from "@/models/channel";
import { ServiceResponse } from "@/types";

export const fetchChannels = async (username: string) => {
    const url = `${channelProto}${channelDomain}:${channelPort}/api/${channelApiVersion}/info/users/${username}/channels`;
    const request = new Request(url,
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
        }
    );

    const response = await fetch(request);

    if (!response.ok) {
        throw new Error('Error fetching channels');
    }

    const channels = (await response.json() as ServiceResponse<Channel[]>).data;
    return channels;
};

export const fetchChannelNameById = async (username: string | undefined, channelId: number | undefined) => {

    if (username == undefined) {
        throw new Error("username is undefined");
    }

    if (channelId == undefined) {
        throw new Error("channel id is undefined");
    }

    const url = `${channelProto}${channelDomain}:${channelPort}/api/${channelApiVersion}/info/users/${username}/channels/${channelId}/info`;
    const request = new Request(url,
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
        }
    );

    const response = await fetch(request);

    if (!response.ok) {
        throw new Error('Error fetching channel info by id');
    }

    const channel = (await response.json() as ServiceResponse<Channel>).data;
    return channel;
};

import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapChannel } from "./mapper/map-channel";
import { ChannelDto } from "./dto/channel.dto";
import { Channel } from "../model/Channel";

export const getChannels = async (user: string | undefined): Promise<{ channels: Channel[]; }> => {
    if (!user) {
        return Promise.resolve({ channels: [] });
    }

    const result = await apiClient.get<ServiceResponse<ChannelDto[]>>(`api/v1/info/users/${user}/channels`);

    return ({
        channels: result.data.map((channel: ChannelDto) => mapChannel(channel))
    });
};

export const getChannel = async (user: string | undefined, channelId: string | undefined): Promise<Channel | null> => {
    if (user == undefined || channelId == undefined) {
        return Promise.resolve(null);
    }

    const result = await apiClient.get<ServiceResponse<ChannelDto>>(`api/v1/info/users/${user}/channels/${channelId}/info`);
    return (
        mapChannel(result.data)
    );
};

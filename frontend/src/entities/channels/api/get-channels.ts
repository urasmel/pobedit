import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapChannel } from "./mapper/map-channel";
import { ChannelDto } from "./dto/channel.dto";
import { Channel } from "../model/channel";

export const getChannels = async (): Promise<{ channels: Channel[]; }> => {
    const result = await apiClient.get<ServiceResponse<ChannelDto[]>>(`channels`);

    return ({
        channels: result.data.map((channel: ChannelDto) => mapChannel(channel))
    });
};

export const getChannel = async (channelId: string | undefined): Promise<Channel | null> => {
    if (channelId == undefined) {
        return Promise.resolve(null);
    }

    const result = await apiClient.get<ServiceResponse<ChannelDto>>(`channels/${channelId}/info`);
    return (
        mapChannel(result.data)
    );
};

export const updateChannelInfo = async (channelId: string | undefined): Promise<Channel | null> => {
    if (channelId == undefined) {
        return Promise.resolve(null);
    }

    const result = await apiClient.get<ServiceResponse<ChannelDto>>(`channels/${channelId}/update_info`);
    return (
        mapChannel(result.data)
    );
};

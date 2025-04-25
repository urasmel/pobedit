import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapChannel } from "./mapper/map-channel";
import { ChannelDto } from "./dto/channel.dto";
import { Channel } from "../model/Channel";

export const getChannels = async (): Promise<{ channels: Channel[]; }> => {
    const result = await apiClient.get<ServiceResponse<ChannelDto[]>>(`info/channels`);

    return ({
        channels: result.data.map((channel: ChannelDto) => mapChannel(channel))
    });
};

export const getChannel = async (channelId: string | undefined): Promise<Channel | null> => {
    if (channelId == undefined) {
        return Promise.resolve(null);
    }

    const result = await apiClient.get<ServiceResponse<ChannelDto>>(`info/channels/${channelId}/info`);
    return (
        mapChannel(result.data)
    );
};

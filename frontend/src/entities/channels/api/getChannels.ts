import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapChannel } from "./mapper/mapChannel";
import { ChannelDto } from "./dto/Channel.dto";
import { Channel } from "../model/Channel";

export const getChannels = async (): Promise<{ channels: Channel[]; }> => {
    try {
        const result = await apiClient.get<ServiceResponse<ChannelDto[]>>(`channels`);

        return ({
            channels: result.data.map((channel: ChannelDto) => mapChannel(channel))
        });
    } catch (error) {
        throw new Error("error.fetchAllChannels");
    }
};

export const getChannel = async (channelId: string | undefined): Promise<Channel | null> => {
    try {
        if (channelId == undefined) {
            return Promise.resolve(null);
        }

        const result = await apiClient.get<ServiceResponse<ChannelDto>>(`channels/${channelId}/info`);
        return (
            mapChannel(result.data)
        );
    } catch (error) {
        throw new Error("error.fetchChannel");
    }
};

export const updateChannelInfo = async (channelId: string | undefined): Promise<Channel | null> => {
    try {
        if (channelId == undefined) {
            return Promise.resolve(null);
        }

        const result = await apiClient.post<ServiceResponse<ChannelDto>>(`channels/${channelId}/update`, { body: "" });
        return (
            mapChannel(result.data)
        );
    } catch (error) {
        throw new Error("error.fetchChannelInfo");
    }
};

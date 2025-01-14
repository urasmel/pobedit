import { ChannelDto } from "../dto/channel.dto";
import { Channel } from "@/entities/channels/model/Channel";

export const mapChannel = (dto: ChannelDto): Channel => ({
    id: dto.id,
    userId: dto.userId,
    mainUsername: dto.mainUsername,
    isChannel: dto.isChannel,
    isGroup: dto.isGroup,
    about: dto.about,
    participantsCount: dto.participantsCount,
    image: dto.image,
    title: dto.title,
});

import { ChannelDto } from "../dto/channel.dto";
import { ChannelInfo } from "@/entities/channels/model/ChannelInfo";

export const mapChannel = (dto: ChannelDto): ChannelInfo => ({
    id: dto.id,
    about: dto.about,
    participantsCount: dto.participantsCount,
    image: dto.image,
    title: dto.title
});

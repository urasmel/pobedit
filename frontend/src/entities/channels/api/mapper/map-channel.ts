import { ChannelDto } from "../dto/channel.dto";
import { Channel } from "@/entities/channels/model/Channel";

export const mapChannel = (dto: ChannelDto): Channel => ({
    id: dto.id,
    tlgId: dto.tlgId,
    mainUsername: dto.mainUsername,
    title: dto.title,
    image: dto.image,
    about: dto.about,
    participantsCount: dto.participantsCount,
    ownerId: dto.ownerId,
});

import { SettingsDto } from "../dto/settings.dto";
import { Settings } from "@/entities/settings/model/settings";

export const mapSettings = (dto: SettingsDto): Settings => ({
    startGatherDate: dto.startGatherDate,
    channelPollingFrequency: dto.channelPollingFrequency,
    commentsPollingDelay: dto.commentsPollingDelay
});

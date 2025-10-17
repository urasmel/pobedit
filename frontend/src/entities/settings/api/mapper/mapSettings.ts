import { SettingsDto } from "../dto/Settings.dto";
import { Settings } from "@/entities/settings/model/Settings";

export const mapSettings = (dto: SettingsDto): Settings => ({
    startGatherDate: dto.startGatherDate,
    channelPollingFrequency: dto.channelPollingFrequency,
    commentsPollingDelay: dto.commentsPollingDelay
});

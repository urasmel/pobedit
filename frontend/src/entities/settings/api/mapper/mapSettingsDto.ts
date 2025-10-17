import { SettingsDto } from "../dto/Settings.dto";
import { Settings } from "@/entities/settings/model/Settings";

export const mapSettingsDto = (settings: Settings): SettingsDto => ({
    startGatherDate: settings.startGatherDate,
    channelPollingFrequency: settings.channelPollingFrequency,
    commentsPollingDelay: settings.commentsPollingDelay
});

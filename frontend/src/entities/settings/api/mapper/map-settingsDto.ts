import { SettingsDto } from "../dto/settings.dto";
import { Settings } from "@/entities/settings/model/settings";

export const mapSettingsDto = (settings: Settings): SettingsDto => ({
    startGatherDate: settings.startGatherDate
});

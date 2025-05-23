import { SettingsDto } from "../dto/settings.dto";
import { Settings } from "@/entities/settings/model/ttt";

export const mapChannel = (dto: SettingsDto): Settings => ({
    startGatherDate: dto.startGatherDate
});

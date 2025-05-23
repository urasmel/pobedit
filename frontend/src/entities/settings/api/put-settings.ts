import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";
import { Settings } from "../model/settings";
import { mapSettingsDto } from "./mapper/map-settingsDto";

export const saveSettings = async (settings: Settings): Promise<boolean> => {

    const settingsDto = mapSettingsDto(settings);
    const result = await apiClient.post<ServiceResponse<boolean>>(`settings`, { body: settingsDto });

    const success = result.data;
    return success;
};

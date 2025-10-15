import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";
import { Settings } from "../model/Settings";
import { mapSettingsDto } from "./mapper/mapSettingsDto";

export const saveSettings = async (settings: Settings): Promise<boolean> => {

    const settingsDto = mapSettingsDto(settings);
    try {
        const result = await apiClient.post<ServiceResponse<boolean>>(`settings`, { body: settingsDto });

        const success = result.data;
        return success;

    } catch (error) {
        throw new Error("error.updateSettings");
    }
};

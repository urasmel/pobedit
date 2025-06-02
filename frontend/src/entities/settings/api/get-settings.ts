import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapSettings } from "./mapper/map-settings";
import { SettingsDto } from "./dto/settings.dto";
import { Settings } from "../model/settings";

export const getSettings = async (): Promise<Settings> => {
    try {
        const result = await apiClient.get<ServiceResponse<SettingsDto>>(`settings`);

        const set = mapSettings(result.data);
        return (set);

    } catch (error) {
        throw new Error("fetchSettingsError");
    }
};

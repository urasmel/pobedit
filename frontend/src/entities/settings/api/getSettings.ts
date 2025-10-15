import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapSettings } from "./mapper/mapSettings";
import { SettingsDto } from "./dto/Settings.dto";
import { Settings } from "../model/Settings";

export const getSettings = async (): Promise<Settings> => {
    try {
        const result = await apiClient.get<ServiceResponse<SettingsDto>>(`settings`);

        const set = mapSettings(result.data);
        return (set);

    } catch (error) {
        throw new Error("error.fetchSettings");
    }
};

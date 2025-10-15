import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapGatherState } from "./mapper/mapGatherState";
import { GatherState } from "../model/GatherState";
import { GatherStateDto } from "./dto/gatherState.dto";

export const getGatherState = async (): Promise<GatherState> => {
    try {
        const result = await apiClient.get<ServiceResponse<GatherStateDto>>(`gather/state`);

        const set = mapGatherState(result.data);
        return (set);
    } catch (error) {
        throw new Error("error.fetchGatherState");
    }
};

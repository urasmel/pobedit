import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapGatherState } from "./mapper/map-gather-state";
import { GatherState } from "../model/gather-state";
import { GatherStateDto } from "./dto/gather-state.dto";

export const getGatherState = async (): Promise<GatherState> => {
    try {
        const result = await apiClient.get<ServiceResponse<GatherStateDto>>(`gather/state`);

        const set = mapGatherState(result.data);
        return (set);
    } catch (error) {
        throw new Error("error.fetchGatherState");
    }
};

import { ServiceResponse } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapServiceState } from "./mapper/map-service-state";
import { ServiceState } from "../model/service-state";
import { ServiceStateDto } from "./dto/service-state.dto";

export const getServiceState = async (): Promise<ServiceState> => {
    const result = await apiClient.get<ServiceResponse<ServiceStateDto>>(`service_state`);

    const set = mapServiceState(result.data);
    return (set);
};

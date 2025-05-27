import { ServiceStateDto } from "../dto/service-state.dto";
import { ServiceState } from "@/entities/service-state/model/service-state";

export const mapServiceState = (dto: ServiceStateDto): ServiceState => ({
    state: dto.state,
    toPollingChannels: dto.toPollingChannels,
    toPollingComments: dto.toPollingComments
});

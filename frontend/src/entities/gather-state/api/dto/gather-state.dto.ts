export interface GatherStateDto {
    state: "stopped" | "running";
    toPollingChannels: number;
    toPollingComments: number;
}

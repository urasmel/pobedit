export interface GatherState {
    state: "stopped" | "running";
    toPollingChannels: number;
    toPollingComments: number;
}

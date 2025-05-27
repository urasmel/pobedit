export interface ServiceState {
    state: "stopped" | "running";
    toPollingChannels: number;
    toPollingComments: number;
}

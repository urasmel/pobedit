export type AccountsFilterProps = {
    trackingFilter: TrackingOptions;
    loginFilter: string;
    onIsTrackingChange: (value: TrackingOptions) => void;
    onLoginFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export enum TrackingOptions { All, Tracking, NoTracking };

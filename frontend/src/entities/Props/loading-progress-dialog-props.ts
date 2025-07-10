export interface LoadingProgressDialogProps {
    open: boolean;
    date: string;
    type: "comment" | "post";
    cancellLoading: () => void;
}

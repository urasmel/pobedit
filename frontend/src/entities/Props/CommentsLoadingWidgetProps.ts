export interface CommentsLoadingWidgetProps {
    channelId: number | undefined;
    postId: number;
    invalidateCashe: () => void;
    setLoadingError: (description: string) => void;
}

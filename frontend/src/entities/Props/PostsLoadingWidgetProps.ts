export interface PostsLoadingWidgetProps {
    channelId: number | undefined;
    invalidateCashe: () => void;
    setLoadingError: (description: string) => void;
}

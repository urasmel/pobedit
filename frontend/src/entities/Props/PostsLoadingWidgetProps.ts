export interface PostsLoadingWidgetProps {
    channelId: number | undefined;
    invalidateCache: () => void;
    setLoadingError: (description: string) => void;
}

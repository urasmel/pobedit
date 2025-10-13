export interface PostsUpdatingWidgetProps {
    channelId: number | undefined;
    invalidateCache: () => void;
    setLoadingError: (description: string) => void;
}

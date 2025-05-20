export interface CommentsUpdatingWidgetProps {
    channelId: number | undefined;
    postId: number;
    invalidateCache: () => void;
    setUpdatingError: (description: string) => void;
}

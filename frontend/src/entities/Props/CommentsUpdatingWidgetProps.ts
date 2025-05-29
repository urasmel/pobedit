export interface CommentsUpdatingWidgetProps {
    channelId: number | undefined;
    postId: number;
    invalidateCache: () => void;
    setUpdatingResult: (success: boolean, description: string) => void;
}

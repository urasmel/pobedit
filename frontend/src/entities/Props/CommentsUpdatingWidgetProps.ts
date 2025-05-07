export interface CommentsUpdatingWidgetProps {
    channelId: number | undefined;
    postId: number;
    invalidateCashe: () => void;
    setUpdatingError: (description: string) => void;
}

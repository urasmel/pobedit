import { ServiceResponse } from "@/entities";
import { Comment } from "../model/Comment";
import { apiClient } from "@/shared/api/base";

import { mapComment } from "./mapper/map-comment";
import { CommentDto } from "./dto/comment.dto";

export const getComments = async (user: string | undefined, channelId: string | undefined, postId: string | undefined): Promise<{ comments: Comment[]; }> => {
    if (user == undefined || channelId == undefined || postId == undefined) {
        return Promise.resolve({ comments: [] });
    }

    const result = await apiClient.get<ServiceResponse<CommentDto[]>>(`api/v1/info/users/${user}/channels/${channelId}/posts/${postId}/comments`);

    return ({
        comments: result.data.map((comment: CommentDto) => mapComment(comment))
    });
};

export const getComment = async (user: string | undefined, channelId: string | undefined, postId: string | undefined, commentId: string | undefined): Promise<{ comment: Comment | null; }> => {
    if (user == undefined || channelId == undefined || postId == undefined || commentId == undefined) {
        return Promise.resolve({ comment: null });
    }

    const result = await apiClient.get<ServiceResponse<CommentDto>>(`api/v1/info/users/${user}/channels/${channelId}/posts/${postId}/comments/${commentId}`);

    return ({
        comment: mapComment(result.data)
    });
};

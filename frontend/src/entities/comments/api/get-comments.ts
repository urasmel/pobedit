import { ServiceResponse } from "@/entities";
import { Comment } from "../model/Comment";
import { apiClient } from "@/shared/api/base";

import { mapComment, mapComments } from "./mapper/map-comment";
import { CommentDto } from "./dto/comment.dto";
import { ITEMS_PER_PAGE } from "@/shared/config";

export const getComments = async (
    channelId: string | undefined,
    postId: string | undefined,
    offset = 0,
    limit = ITEMS_PER_PAGE)
    : Promise<{ comments: Comment[]; }> => {

    if (channelId == undefined || postId == undefined) {
        return Promise.resolve({ comments: [] });
    }

    const result = await apiClient
        .get<ServiceResponse<CommentDto[]>>
        (`channels/${channelId}/posts/${postId}/comments?offset=${offset}&limit=${limit}`);

    return ({
        comments: result.data.map((comment: CommentDto) => mapComment(comment))
    });
};

export const getComment = async (channelId: string | undefined, postId: string | undefined, commentId: string | undefined): Promise<{ comment: Comment | null; }> => {
    if (channelId == undefined || postId == undefined || commentId == undefined) {
        return Promise.resolve({ comment: null });
    }

    const result = await apiClient.get<ServiceResponse<CommentDto>>(`channels/${channelId}/posts/${postId}/comments/${commentId}`);

    return ({
        comment: mapComment(result.data)
    });
};

export const getPostCommentsCount = async (channelId: string | undefined, postId: string | undefined): Promise<number> => {
    if (channelId == undefined || postId == undefined) {
        return Promise.resolve(0);
    }

    const result = await apiClient.get<ServiceResponse<number>>(`channels/${channelId}/posts/${postId}/comments_count`);

    return (
        result.data as number
    );
};

export const getAllAccountComments = async (accountId: string | undefined, offset = 0, limit = ITEMS_PER_PAGE): Promise<Comment[]> => {
    if (accountId == undefined) {
        return Promise.resolve([]);
    }

    const result = await apiClient
        .get<ServiceResponse<CommentDto[]>>
        (`accounts/${accountId}/comments?offset=${offset}&limit=${limit}`);

    return mapComments(result.data);
};

export const getAllAccountCommentsCount = async (accountId: string | undefined): Promise<number> => {
    if (accountId == undefined) {
        return Promise.resolve(0);
    }

    const result = await apiClient
        .get<ServiceResponse<number>>
        (`accounts/${accountId}/comments_count`);

    return result.data;
};

import { ServiceResponse } from "@/entities";
import { Comment } from "../model/Comment";
import { apiClient } from "@/shared/api/base";

import { mapComment, mapComments } from "./mapper/mapComment";
import { CommentDto } from "./dto/Comment.dto";
import { PAGE_SIZE } from "@/shared/config";

export const getComments = async (
    channelId: string | undefined,
    postId: string | undefined,
    offset = 0,
    limit = PAGE_SIZE)
    : Promise<{ comments: Comment[]; }> => {

    try {
        if (channelId == undefined || postId == undefined) {
            return Promise.resolve({ comments: [] });
        }

        const result = await apiClient
            .get<ServiceResponse<CommentDto[]>>
            (`comments/${channelId}/${postId}?offset=${offset}&limit=${limit}`);

        return ({
            comments: result.data.map((comment: CommentDto) => mapComment(comment))
        });
    } catch (error) {
        throw new Error("error.fetchPostComments");
    }
};

export const getComment = async (channelId: string | undefined, postId: string | undefined, commentId: string | undefined): Promise<{ comment: Comment | null; }> => {
    try {
        if (channelId == undefined || postId == undefined || commentId == undefined) {
            return Promise.resolve({ comment: null });
        }

        const result = await apiClient.get<ServiceResponse<CommentDto>>(`comments/${channelId}/${postId}/${commentId}`);

        return ({
            comment: mapComment(result.data)
        });
    } catch (error) {
        throw new Error("error.fetchComment");
    }
};

export const getPostCommentsCount = async (channelId: string | undefined, postId: string | undefined): Promise<number> => {
    try {
        if (channelId == undefined || postId == undefined) {
            return Promise.resolve(0);
        }

        const result = await apiClient.get<ServiceResponse<number>>(`comments/${channelId}/${postId}/count`);

        return (
            result.data as number
        );
    } catch (error) {
        throw new Error("error.fetchPostCommentsCount");
    }
};

export const getAllAccountComments = async (accountId: string | undefined, offset = 0, limit = PAGE_SIZE): Promise<Comment[]> => {
    try {
        if (accountId == undefined) {
            return Promise.resolve([]);
        }

        const result = await apiClient
            .get<ServiceResponse<CommentDto[]>>
            (`accounts/${accountId}/comments?offset=${offset}&limit=${limit}`);

        return mapComments(result.data);
    } catch (error) {
        throw new Error("error.fetchAccountAllComments");
    }
};

export const getAllAccountCommentsCount = async (accountId: string | undefined): Promise<number> => {
    try {
        if (accountId == undefined) {
            return Promise.resolve(0);
        }

        const result = await apiClient
            .get<ServiceResponse<number>>
            (`accounts/${accountId}/comments_count`);

        return result.data;
    } catch (error) {
        throw new Error("error.fetchAccountCommentsCount");
    }
};

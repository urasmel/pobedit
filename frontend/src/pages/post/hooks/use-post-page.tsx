import { useFetchChannelDetail } from "@/entities/channels/api/hooks";
import { commentsApi } from "@/entities/comments";
import { commentsKeys } from "@/entities/comments/api/comments.keys";
import { postsApi } from "@/entities/posts";
import { PAGE_SIZE } from "@/shared/config";
import { getLocalizedString } from "@/shared/locales";
import { usePagination } from "./use-pagination";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useState, useMemo, useEffect, useCallback, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

// Кастомный хук для управления состоянием страницы
export const usePostPage = (channelId?: string, postId?: string) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const [offset, setOffset] = useState(0);
    const limit = PAGE_SIZE;

    // Валидация параметровlimit
    const isValidParams = useMemo(() => {
        return channelId !== undefined && postId !== undefined;
    }, [channelId, postId]);

    const numericChannelId = useMemo(() => Number(channelId), [channelId]);
    const numericPostId = useMemo(() => Number(postId), [postId]);

    // Запросы данных
    const commentsQuery = useQuery(
        commentsApi.commentsQueries.list(channelId, postId, offset, limit)
    );

    const countQuery = useQuery(
        commentsApi.commentsQueries.count(channelId, postId)
    );

    const postQuery = useQuery(
        postsApi.postsQueries.one(numericChannelId, numericPostId),
        // { enabled: isValidParams }
    );


    const channelDetailQuery = useFetchChannelDetail(channelId);

    // Обработка ошибок
    useEffect(() => {
        if (commentsQuery.isError && commentsQuery.error) {
            const errorMsg = getLocalizedString(commentsQuery.error, t);
            enqueueSnackbar(errorMsg, { variant: 'error' });
        }
    }, [commentsQuery.isError, commentsQuery.error, t]);

    // Пагинация
    const { pagesCount } = usePagination(countQuery.data, limit);

    const handlePageChange = useCallback((_event: ChangeEvent<unknown>, page: number) => {
        setOffset(limit * (page - 1));
    }, [limit]);

    // Инвалидация кэша
    const invalidateCache = useCallback(() => {
        const queries = [
            [...commentsKeys.list, channelId, postId, offset, limit],
            [...commentsKeys.count, channelId, postId],
            ["posts", channelId]
        ].filter(Boolean);

        queries.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey });
        });
    }, [channelId, postId, offset, limit, queryClient]);

    const setUpdatingResult = useCallback((success: boolean, description: string) => {
        enqueueSnackbar(description, { variant: success ? "success" : "error" });
    }, []);

    return {
        // Параметры
        channelId,
        postId,
        numericChannelId,
        numericPostId,
        isValidParams,

        // Данные
        comments: commentsQuery.data?.comments || [],
        post: postQuery.data?.post,
        channelInfo: channelDetailQuery.channelInfo,
        totalCount: countQuery.data || 0,

        // Состояния
        offset,
        limit,
        pagesCount,
        isLoading: commentsQuery.isLoading || postQuery.isLoading,
        isFetching: commentsQuery.isFetching,
        isError: commentsQuery.isError,
        error: commentsQuery.error,

        // Обработчики
        handlePageChange,
        invalidateCache,
        setUpdatingResult,
    };
};

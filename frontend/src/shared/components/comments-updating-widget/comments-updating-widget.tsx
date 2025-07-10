import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { CommentsUpdatingWidgetProps } from '@/entities/Props/comments-updating-widget-props';
import plural from 'plural-ru';
import { LoadingProgressDialog } from '../loading/loading-progress-dialog';
import { WS_API_URL } from "@/shared/config";
import { useFetchCommentsCount } from '@/entities/comments/hooks';
import { enqueueSnackbar } from 'notistack';

export const CommentsUpdatingWidget = (props: CommentsUpdatingWidgetProps) => {

    const { channelId, postId, invalidateCache, setUpdatingResult } = props;
    const URL = `${WS_API_URL}channels/${channelId}/posts/${postId}/update_comments`;
    const [isWSLoading, setIsWSLoading] = useState(false);
    const [response, setResponse] = useState<string>('');

    const {
        commentsCount,
        commentsCountError,
        commentsCountErrorMsg,
        isCommentsCountLoading,
        handleCommentsCountErrorClose

    } = useFetchCommentsCount(channelId?.toString(), postId.toString());

    const wsRef = useRef<WebSocket>(null);

    const SyncPostComments = () => {

        wsRef.current = new WebSocket(URL);

        wsRef.current.onopen = () => {
            try {
                wsRef.current?.send("");
                setIsWSLoading(true);
            }
            catch (error) {
                setIsWSLoading(false);
                setUpdatingResult(false, "Ошибка отправки запроса на обновление комментариев канала.");
            }
        };

        wsRef.current.onmessage = e => {
            setResponse(() => e.data);
            wsRef.current?.send('keep going');
        };

        wsRef.current.onclose = (event: CloseEvent) => {
            setIsWSLoading(false);
            if (1001 <= event.code && event.code <= 1015) {
                console.error(`Запрос завершился ошибкой. ${event.reason}`);
                setUpdatingResult(false, `Запрос завершился ошибкой. ${event.reason}`);
            }
            else {
                if (event.reason === "Closed by client") {
                    setUpdatingResult(true, 'Загрузка комментариев остановлена пользователем');
                }
                else
                    setUpdatingResult(true, 'Комментарии успешно обновлены');
            }
            invalidateCache();
            setResponse("");
        };

        wsRef.current.onerror = () => {
            setIsWSLoading(false);
            setUpdatingResult(false, "Ошибка отправки запроса на обновление комментариев.");
            invalidateCache();
            setResponse("");
        };
    };

    const btnStopDownloading_handler = () => {
        if (wsRef.current != undefined) {
            wsRef.current.close();
        }
    };

    const btnSendRequest_handler = () => {
        SyncPostComments();
    };

    if (props.channelId == undefined) {
        return (
            <Box sx={{
                fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "medium",
                fontWeight: "500",
                color: "rgb(52, 71, 103)"
            }}>
                Ошибка. Не определен идентификатор канала.
            </Box>);
    }

    if (props.postId == undefined) {
        return (
            <Box sx={{
                fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "medium",
                fontWeight: "500",
                color: "rgb(52, 71, 103)"
            }}>
                Ошибка. Не определен идентификатор поста.
            </Box>);
    }

    useEffect(() => {
        if (commentsCountError) {
            enqueueSnackbar(commentsCountErrorMsg, { variant: 'error' });
        }
    }, [commentsCountError]);

    if (isCommentsCountLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    boxSizing: "border-box",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                    padding: 1,
                }}>
                <CircularProgress />
            </Box>
        );
    }

    if (commentsCountError) {
        return (
            <Box sx={{
                fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "medium",
                fontWeight: "500",
                color: "rgb(52, 71, 103)"
            }}>
                Ошибка загрузки информации о комментариях поста.
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "1rem",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
                fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
        >

            {
                commentsCount == 0
                    ?
                    <Typography>
                        Пока в базе данных нет комментариев к посту с идентификатором <b>{postId}</b>
                    </Typography>
                    :
                    <Typography>
                        В базе данных {commentsCount}&nbsp;
                        {plural((commentsCount ? commentsCount : 0), 'комментарий', 'комментария', 'комментариев')}&nbsp;
                        к посту с ид. {postId}
                    </Typography>
            }

            <Button
                variant="contained"
                onClick={btnSendRequest_handler}
                disabled={isWSLoading}
            >
                Обновить комментарии поста
            </Button>

            <LoadingProgressDialog
                date={response}
                cancellLoading={btnStopDownloading_handler}
                open={isWSLoading}
                type='comment'
            />
        </Box>
    );
};

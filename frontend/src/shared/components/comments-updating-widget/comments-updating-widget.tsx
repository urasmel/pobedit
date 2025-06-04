import { Box, Button, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { CommentsUpdatingWidgetProps } from '@/entities/Props/CommentsUpdatingWidgetProps';
import { commentsApi } from '@/entities/comments';
import { useQuery } from '@tanstack/react-query';
import plural from 'plural-ru';
import { LoadingProgessDialog } from '../loading/loading-progess-dialog';


export const CommentsUpdatingWidget = (props: CommentsUpdatingWidgetProps) => {

    const { channelId, postId, invalidateCache, setUpdatingResult } = props;
    const URL = `ws://localhost:5037/api/v1/channels/${channelId}/posts/${postId}/update_comments`;
    const [isWSLoading, setIsWSLoading] = useState(false);
    const [response, setResponse] = useState<string>('');

    const { data: comments_count }
        = useQuery(commentsApi.commentsQueries.count(channelId?.toString(), postId?.toString()));

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
            setUpdatingResult(true, 'Комментарии успешно обновлены');
            invalidateCache();
        };

        wsRef.current.onerror = () => {
            setIsWSLoading(false);
            setUpdatingResult(false, "Ошибка отправки запроса на обновление данных канала.");
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
                comments_count == 0
                    ?
                    <Typography>
                        Пока в базе данных нет комментариев к посту с идентификатором <b>{postId}</b>
                    </Typography>
                    :
                    <Typography>
                        В базе данных {comments_count}&nbsp;
                        {plural((comments_count ? comments_count : 0), 'комментарий', 'комментария', 'комментариев')}&nbsp;
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

            <LoadingProgessDialog
                date={response}
                cancellLoading={btnStopDownloading_handler}
                open={isWSLoading}
            />
        </Box>
    );
};

import { PostsLoadingWidgetProps } from '@/entities/Props';
import { Box, Button } from '@mui/material';
import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/entities/posts';
import plural from 'plural-ru';
import { LoadingProgessDialog } from '@/shared/components/loading/loading-progess-dialog';

class CloseEvent {
    readonly code: number;
    readonly reason?: string;

    constructor(code: number, reason?: string) {
        this.code = code;
        this.reason = reason;
    }
}

export const PostsLoadingWidget = ({ channelId, invalidateCache: invalidateCache, setLoadingError }: PostsLoadingWidgetProps) => {

    const URL = `ws://localhost:5037/api/v1/channels/${channelId}/update_posts`;
    const [isWSLoading, setIsWSLoading] = useState(false);
    const [response, setResponse] = useState<string>('');


    const { data, isError } = useQuery(postsApi.postsQueries.count(channelId?.toString()));

    const wsRef = useRef<WebSocket>(null);

    const SyncChannelPosts = () => {

        wsRef.current = new WebSocket(URL);

        wsRef.current.onopen = () => {
            try {
                wsRef.current?.send("");
                setIsWSLoading(true);
            }
            catch (error) {
                setIsWSLoading(false);
                setLoadingError("Ошибка отправки запроса на обновление данных канала.");
            }
        };

        wsRef.current.onmessage = e => {
            setResponse(() => e.data);
            wsRef.current?.send('keep going');
        };

        wsRef.current.onclose = (event: CloseEvent) => {

            setIsWSLoading(false);
            if (1001 <= event.code && event.code <= 1015) {
                setLoadingError(`Запрос завершился ошибкой. ${event.reason}`);
                console.error(`Запрос завершился ошибкой: ${event.reason}`);
            }
            invalidateCache();
        };

        wsRef.current.onerror = () => {
            setIsWSLoading(false);
            setLoadingError("Ошибка отправки запроса на обновление данных канала.");
            invalidateCache();
        };
    };

    const btnStopDownloading_handler = () => {
        if (wsRef.current != undefined) {
            wsRef.current.close();
        }
    };

    const btnSendRequest_handler = () => {
        SyncChannelPosts();
    };

    if (channelId == undefined) {
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

    if (isError) {
        return (<Box sx={{
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "medium",
            fontWeight: "500",
            color: "rgb(52, 71, 103)"
        }}>
            Ошибка загрузки информации о постах канала.
        </Box>);
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            padding: "1rem",
            width: "100%",
            boxSizing: "border-box"
        }}>

            <Box sx={{ fontSize: "1rem" }}>
                {
                    data?.posts_count == 0
                        ?
                        `Пока в базе данных нет записей канала с идентификатором ${channelId}`
                        :
                        `В базе данных ${data?.posts_count} ${plural((data?.posts_count ? data.posts_count : 0), 'запись', 'записи', 'записей')} канала с ид. ${channelId}`


                }
            </Box>

            <Button
                variant="contained"
                onClick={btnSendRequest_handler}
                disabled={isWSLoading}
            >
                Обновить записи канала
            </Button>

            <LoadingProgessDialog
                date={response}
                cancellLoading={btnStopDownloading_handler}
                open={isWSLoading}
            />
        </Box>
    );
};

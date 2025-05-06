import { PostsLoadingWidgetProps } from '@/entities/Props';
import { Button, Snackbar } from '@mui/material';
import { useRef, useState } from 'react';
import styles from './styles.module.css';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/entities/posts';
import plural from 'plural-ru';
import { LoadingProgessDialog } from '../LoadingProgessDialogProps';

class CloseEvent {
    readonly code: number;
    readonly reason?: string;

    constructor(code: number, reason?: string) {
        this.code = code;
        this.reason = reason;
    }
}

export const PostsLoadingWidget = ({ channelId, invalidateCashe, setLoadingError }: PostsLoadingWidgetProps) => {

    const URL = `ws://localhost:5037/api/v1/channels/${channelId}/update_posts`;
    const [isWSLoading, setIsWSLoading] = useState(false);
    const [response, setResponse] = useState<string>('');


    const { data, isFetching, isLoading, isError, error } = useQuery(postsApi.postsQueries.count(channelId?.toString()));

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
            else {
                invalidateCashe();
            }
        };

        wsRef.current.onerror = (event: Event) => {
            setIsWSLoading(false);
            setLoadingError("Ошибка отправки запроса на обновление данных канала.");
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
        return (<div className={styles.error}>Ошибка. Не определен идентификатор канала.</div>);
    }

    if (isError) {
        return (<div className={styles.error}>Ошибка.Ошибка загрузки информации о постах канала.</div>);
    }

    return (
        <div className={styles.block}>

            <div className={styles.block__text}>
                {
                    data?.posts_count == 0
                        ?
                        `Пока в базе данных нет записей канала с идентификатором ${channelId}`
                        :
                        `В базе данных ${data?.posts_count} ${plural((data?.posts_count ? data.posts_count : 0), 'запись', 'записи', 'записей')} канала с ид. ${channelId}`


                }
            </div>

            <div className={styles.block__button}>
                <Button
                    variant="contained"
                    onClick={btnSendRequest_handler}
                    disabled={isWSLoading}
                >
                    Обновить записи канала
                </Button>
            </div>

            <LoadingProgessDialog
                date={response}
                cancellLoading={btnStopDownloading_handler}
                open={isWSLoading}
            />
        </div>
    );
};

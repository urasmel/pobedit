import { Button } from '@mui/material';
import styles from './styles.module.css';
import { useRef, useState } from 'react';
import { LoadingProgessDialog } from '../LoadingProgessDialogProps';
import { CommentsLoadingWidgetProps } from '@/entities/Props/CommentsLoadingWidgetProps';
import { commentsApi } from '@/entities/comments';
import { useQuery } from '@tanstack/react-query';
import plural from 'plural-ru';


export const CommentsLoadingWidget = (props: CommentsLoadingWidgetProps) => {

    const { channelId, postId, invalidateCashe, setLoadingError } = props;
    const URL = `ws://localhost:5037/api/v1/info/channels/${channelId}/posts/${postId}/update_comments`;
    const [isWSLoading, setIsWSLoading] = useState(false);
    const [response, setResponse] = useState<string>('');

    const { data: comments_count, isError }
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
                setLoadingError("Ошибка отправки запроса на обновление комментариев канала.");
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
                setLoadingError(`Запрос завершился ошибкой. ${event.reason}`);
            }
            invalidateCashe();
        };

        wsRef.current.onerror = () => {
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
        SyncPostComments();
    };

    if (channelId == undefined) {
        return (<div className={styles.error}>Ошибка. Не определен идентификатор канала.</div>);
    }

    if (postId === 0) {
        return (<div className={styles.error}>Ошибка. Не определен идентификатор поста.</div>);
    }

    if (isError) {
        return (<div className={styles.error}>Ошибка.Ошибка загрузки информации о комментариях поста.</div>);
    }

    return (
        <div className={styles.block}>

            {
                comments_count == 0
                    ?
                    <div className={styles.block__text}>
                        Пока в базе данных нет комментариев к посту с идентификатором <b>{postId}</b>
                    </div>
                    :
                    <div className={styles.block__text}>
                        В базе данных {comments_count}&nbsp;
                        {plural((comments_count ? comments_count : 0), 'комментарий', 'комментария', 'комментариев')}&nbsp;
                        к посту с ид. {postId}
                    </div>
            }

            <div className={styles.block__button}>
                <Button
                    variant="contained"
                    onClick={btnSendRequest_handler}
                    disabled={isWSLoading}
                >
                    Обновить комментарии поста
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

import { NoChannelDataProps as ChannelPostsWidgetProps } from '@/entities/Props';
import getStatusCodeString from '@/shared/api/socket';
import { Button, Snackbar, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ErrorAction } from '../ErrorrAction';
import Loading from '../Loading';
import styles from './styles.module.css';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/entities/posts';

class CloseEvent {
    readonly code: number;
    readonly reason?: string;

    constructor(code: number, reason?: string) {
        this.code = code;
        this.reason = reason;
    }
}

export const ChannelPostsWidget = ({ channelId }: ChannelPostsWidgetProps) => {

    const URL = `ws://localhost:5037/api/v1/info/channels/${channelId}/update_posts`;
    const [isWSLoading, setIsWSLoading] = useState(false);
    const [response, setResponse] = useState<string>();
    const [isConnected, setIsConnected] = useState(false);
    const [isWSError, setIsWSError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const { data, isFetching, isLoading, isError, error } = useQuery(postsApi.postsQueries.count(channelId?.toString()));

    const wsRef = useRef<WebSocket>();

    const SyncChannelPosts = () => {

        wsRef.current = new WebSocket(URL);

        wsRef.current.onopen = () => {
            try {
                wsRef.current?.send("");
                setIsConnected(true);
                setIsWSLoading(true);
            }
            catch (error) {
                setErrorMessage("Ошибка выполнения запроса.");
            }
            finally {
                setIsConnected(false);
                setIsWSLoading(false);
                setIsWSError(true);
            }
        };

        wsRef.current.onmessage = e => {
            setResponse(() => e.data);
        };

        wsRef.current.onclose = (event: CloseEvent) => {
            console.log(event);


            setIsConnected(false);
            setIsWSLoading(false);
            console.log(`Connection closed with status reason ${getStatusCodeString(event.code)}`);

            if (1001 <= event.code && event.code <= 1015) {
                setErrorMessage(`Запрос завершился ошибкой.`);
                setIsWSError(true);
                console.error(`Запрос завершился ошибкой: ${event.reason}`);
            }
            else {
                navigate(0);
            }
        };

        wsRef.current.onerror = (event: Event) => {
            setIsConnected(false);
            setIsWSLoading(false);
            setErrorMessage("Ошибка отправки запроса на обновление данных канала.");
            setIsWSError(true);
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

    const handleErrorClose = () => {
        setIsWSError(false);
    };

    if (channelId == undefined) {
        return (<div className={styles.error}>Ошибка. Не определен идентификатор канала.</div>);
    }

    if (isError) {
        return (<div className={styles.error}>Ошибка.Ошибка загрузки идентификатора канала.</div>);
    }

    return (
        <div className={styles.block}>

            <div className={styles.block__text}>
                {
                    data?.posts_count == 0
                        ?
                        `Пока в базе данных нет записей канала с идентификатором ${channelId}`
                        :
                        `В базе данных ${data?.posts_count} запис(и,ь,ей) канала с ид. ${channelId}`
                }
            </div>

            <div className={styles.block__button}>
                <Button
                    variant="contained"
                    onClick={btnSendRequest_handler}>
                    Обновить записи канала
                </Button>
            </div>


            {
                isWSLoading &&
                <>
                    <Typography component="h6" variant="h6">
                        <Loading />
                        Время создания загружаемой записи: {response}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={btnStopDownloading_handler}>
                        Прервать загрузку
                    </Button>
                </>
            }

            {
                isConnected &&
                <div>Connected</div>
            }

            <Snackbar
                open={isWSError}
                onClose={handleErrorClose}
                autoHideDuration={6000}
                message={errorMessage}
                action={ErrorAction(handleErrorClose)}
            />
        </div>
    );
};

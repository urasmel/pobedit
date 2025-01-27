import { Button, Snackbar, Typography } from '@mui/material';
import styles from './styles.module.css';
import { useRef, useState } from 'react';
import Loading from '../Loading';
import { NoChannelDataProps } from '@/entities/Props';
import { ErrorAction } from '../ErrorrAction';
import getStatusCodeString from '@/shared/api/socket';
import { useNavigate } from "react-router-dom";

class CloseEvent {
    readonly code: number;
    readonly reason?: string;

    constructor(code: number, reason?: string) {
        this.code = code;
        this.reason = reason;
    }
}

export const NoChannelData = ({ channelId }: NoChannelDataProps) => {

    const URL = `ws://localhost:5037/api/v1/info/channels/${channelId}/update_posts`;
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<string>();
    const [isConnected, setIsConnected] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const wsRef = useRef<WebSocket>();

    const connectWs = () => {

        wsRef.current = new WebSocket(URL);

        wsRef.current.onopen = () => {
            try {
                wsRef.current?.send("Message from client");
                setIsConnected(true);
                setIsLoading(true);
            }
            catch (error) {
                setIsConnected(false);
                setIsLoading(false);
                setIsError(true);
                setErrorMessage("Ошибка отправки запроса на обновление данных канала.");
            }
        };

        wsRef.current.onmessage = e => {
            setResponse(() => e.data);
        };

        wsRef.current.onclose = (event: CloseEvent) => {
            setIsConnected(false);
            setIsLoading(false);
            console.log(`Connection closed with status reason ${getStatusCodeString(event.code)}`);

            if (1001 <= event.code && event.code <= 1015) {
                setIsError(true);
                setErrorMessage("Запрос на обновление постов канала завершился ошибкой");
                console.error(getStatusCodeString(event.code));
            }
            else {
                navigate(0);
            }
        };

        wsRef.current.onerror = (event: Event) => {
            setIsConnected(false);
            setIsLoading(false);
            setIsError(true);
            setErrorMessage("Ошибка отправки запроса на обновление данных канала.");
        };
    };

    const btnStopDownloading_handler = () => {
        if (wsRef.current != undefined) {
            wsRef.current.close();
        }
    };

    const btnSendRequest_handler = () => {
        connectWs();
    };

    const handleErrorClose = () => {
        setIsError(false);
    };

    return (
        <div className={styles.block}>
            {
                (channelId !== undefined)
                    ?
                    <>
                        <div className={styles.block__text}>Пока в базе данных нет записей канала с идентификатором <b>{channelId}</b></div>
                        <div className={styles.block__button}>
                            <Button
                                variant="contained"
                                onClick={btnSendRequest_handler}>
                                Загрузить записи канала
                            </Button>
                        </div>


                        {
                            isLoading
                                ?
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
                                :
                                <></>
                        }

                    </>
                    :
                    <></>
            }
            {
                isConnected
                    ?
                    <div>Connected</div>
                    :
                    <div>Disconnected</div>
            }

            <Snackbar
                open={isError}
                onClose={handleErrorClose}
                autoHideDuration={6000}
                message={errorMessage}
                action={ErrorAction(handleErrorClose)}
            />
        </div>
    );
};

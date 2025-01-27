import { Button, Typography } from '@mui/material';
import styles from './styles.module.css';
import { useRef, useState } from 'react';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom';
import { NoCommentsDataProps } from '@/entities/Props/NoCommentsDataProps';


export const NoCommentsData = ({ userName, channelId, postId }: NoCommentsDataProps) => {

    const URL = `ws://localhost:5037/api/v1/info/channels/${channelId}/post/${postId}/update_comments`;
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<string>();
    const [isConnected, setIsConnected] = useState(false);
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
            }
        };

        wsRef.current.onmessage = e => {
            setResponse(() => e.data);
        };

        wsRef.current.onclose = () => {
            setIsConnected(false);
            setIsLoading(false);
            navigate(0);
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

    return (
        <div className={styles.block}>
            {
                (userName !== undefined && channelId !== undefined)
                    ?
                    <>
                        <div className={styles.block__text}>Пока в базе данных нет комментариев к посту с идентификатором <b>{postId}</b></div>
                        <div className={styles.block__button}>
                            <Button
                                variant="contained"
                                onClick={btnSendRequest_handler}>
                                Загрузить комментарии поста
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
        </div>
    );
};

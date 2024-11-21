import { Button, Typography } from '@mui/material';
import styles from './styles.module.css';
import { NoChannelDataProps } from 'types/Props';
import { useRef, useState } from 'react';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom';


export const NoChannelData = ({ userName, channelId }: NoChannelDataProps) => {

    const URL = `ws://localhost:5037/api/v1/info/users/${userName}/channels/${channelId}/update_messages`;
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

    // const closeWs = () => {
    //     if (wsRef != undefined && wsRef.current != undefined) {
    //         wsRef.current.close();
    //     }
    // };

    const btnSendRequest_handler = () => {
        connectWs();
    };

    return (
        <div className={styles['block']}>
            {
                (userName !== undefined && channelId !== undefined)
                    ?
                    <>
                        <div className={styles['block__text']}>Пока в базе данных нет записей канала с идентификатором <b>{channelId}</b></div>
                        <div className={styles['block__button']}>
                            <Button
                                variant="contained"
                                onClick={btnSendRequest_handler}>
                                Загрузить записи канала
                            </Button>
                        </div>


                        {
                            isLoading
                                ?
                                <Typography component="h6" variant="h6">
                                    <Loading isLoading />
                                    Время создания загружаемой записи: {response}
                                </Typography>
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

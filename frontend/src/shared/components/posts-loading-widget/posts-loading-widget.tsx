import { Alert, Box, Button, CircularProgress, Snackbar } from '@mui/material';
import { useRef, useState } from 'react';
import { LoadingProgessDialog } from '@/shared/components/loading/loading-progess-dialog';
import { pluralRecords } from '@/shared/utils/plural-records';
import { WS_API_URL } from "@/shared/config";
import { queryClient } from '@/shared/api/query-client';
import { ErrorActionButton } from '../errors/errorr-action-button';
import { useFetchPostsCount } from '@/entities/posts/hooks/useFetchPostsCount';

// class CloseEvent {
//     readonly code: number;
//     readonly reason?: string;

//     constructor(code: number, reason?: string) {
//         this.code = code;
//         this.reason = reason;
//     }
// }

export const PostsLoadingWidget = (props: { channelId: string | undefined; }) => {

    const URL = `${WS_API_URL}channels/${props.channelId}/update_posts`;
    const [isWSLoading, setIsWSLoading] = useState(false);
    const [response, setResponse] = useState<string>('');

    const [isSocketError, setIsSocketError] = useState(false);
    const [socketErrorMessage, setSocketErrorMessage] = useState('');

    const {
        postsCount,
        postsCountError,
        postsCountErrorMsg,
        handlePostsCountErrorClose,
        isPostsCountLoading
    } = useFetchPostsCount(props.channelId);

    const setLoadingError = (description: string) => {
        setSocketErrorMessage(description);
        setIsSocketError(true);
    };

    const closeSocketError = () => {
        setIsSocketError(false);
    };


    const invalidateCache = () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
    };

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

        wsRef.current.onclose = (event) => {

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

    if (isPostsCountLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    boxSizing: "border-box",
                    borderRadius: 1,
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                    padding: 1,
                }}>
                <CircularProgress />
            </Box>
        );
    }

    if (postsCountError) {
        return (
            <Box sx={{
                fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "medium",
                fontWeight: "500",
                color: "rgb(52, 71, 103)"
            }}>
                Ошибка загрузки информации о постах канала.
            </Box>
        );
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
                    postsCount == undefined
                        ?
                        `Не удалось загрузить информацию о количестве записей канала с идентификатором ${props.channelId}`
                        :
                        postsCount == 0
                            ?
                            `Пока в базе данных нет записей канала с идентификатором ${props.channelId}`
                            :
                            `В базе данных ${postsCount} ${pluralRecords(postsCount)} канала с ид. ${props.channelId}`


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

            <Snackbar
                open={postsCountError}
                autoHideDuration={6000}
                action={ErrorActionButton(handlePostsCountErrorClose)}
                onClose={handlePostsCountErrorClose}
            >
                <Alert
                    onClose={handlePostsCountErrorClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {postsCountErrorMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={isSocketError}
                autoHideDuration={6000}
                action={ErrorActionButton(closeSocketError)}
                onClose={closeSocketError}
            >
                <Alert
                    onClose={closeSocketError}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {socketErrorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

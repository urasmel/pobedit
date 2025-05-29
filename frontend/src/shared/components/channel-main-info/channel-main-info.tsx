import { useFetchChannelDetail } from '@/entities/channels/api/hooks';
import { Alert, Box, CircularProgress, Snackbar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { ErrorActionButton } from '../errors/errorr-action-button';

export const ChannelMainInfo = (props: { channelId: string; }) => {

    const { channelInfo,
        channelInfoError,
        channelInfoErrorMsg,
        channelInfoIsLoading,
        channelInfoIsError,
        handleChannelInfoErrorClose } = useFetchChannelDetail(props.channelId);

    if (channelInfoIsLoading) {
        return (
            <Box sx={{
                fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "medium",
                display: "flex",
                flexDirection: "column",
                justifyContent: 'start',
                gap: '.5rem',
                borderRadius: '.5rem',
                overflow: "hidden",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
                padding: ".5rem 1rem",
                fontWeight: "500",
                minHeight: "3rem",
                width: "100%",
                height: "100%",
                boxSizing: "border-box"
            }}>
                <CircularProgress
                    size={24}
                    sx={{
                        color: "rgb(52, 71, 103)",
                        marginRight: "1rem"
                    }} />
                Загрузка информации о канале...
            </Box>
        );
    }

    if (channelInfoIsError) {
        return (
            <>
                <Box sx={{
                    fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "medium",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: 'start',
                    gap: '.5rem',
                    borderRadius: '.5rem',
                    overflow: "hidden",
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
                    padding: ".5rem 1rem",
                    fontWeight: "500",
                    minHeight: "3rem",
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box"
                }}>
                    Не удалось загрузить информацию о канале {props.channelId}
                </Box>
                <Snackbar
                    open={channelInfoError}
                    autoHideDuration={6000}
                    action={ErrorActionButton(handleChannelInfoErrorClose)}
                    onClose={handleChannelInfoErrorClose}
                >
                    <Alert
                        onClose={handleChannelInfoErrorClose}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {channelInfoErrorMsg}
                    </Alert>
                </Snackbar>
            </>);
    }

    return (
        <Box sx={{
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "medium",
            display: "flex",
            flexDirection: "column",
            justifyContent: 'start',
            gap: '.5rem',
            borderRadius: '.5rem',
            overflow: "hidden",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
            padding: ".5rem 1rem",
            fontWeight: "500",
            minHeight: "3rem",
            width: "100%",
            height: "100%",
            boxSizing: "border-box"
        }}>
            <Box sx={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                color: "rgb(52, 71, 103)"
            }} >
                Канал:&nbsp;
                <NavLink to={`/channels/${channelInfo?.tlgId}`}>
                    {channelInfo.title}
                </NavLink>
            </Box>
            <Box sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word", color: "rgb(52, 71, 103)" }}>
                id: {channelInfo.tlgId}
            </Box>
        </Box>
    );
};

import { useFetchChannelDetail } from '@/entities/channels/api/hooks';
import { Box, CircularProgress } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { ChannelMainInfoBox } from './channel-main-info-box';

export const ChannelMainInfo = (props: { channelId: string; }) => {

    const { channelInfo,
        channelInfoError,
        channelInfoErrorMsg,
        channelInfoIsLoading,
        channelInfoIsError
    } = useFetchChannelDetail(props.channelId);

    useEffect(() => {
        if (channelInfoError) {
            enqueueSnackbar(channelInfoErrorMsg, { variant: 'error' });
        }
    }, [channelInfoError]);

    if (channelInfoIsLoading) {
        return (
            <ChannelMainInfoBox>
                <CircularProgress
                    size={24}
                    sx={{
                        color: "rgb(52, 71, 103)",
                        marginRight: "1rem"
                    }} />
                Загрузка информации о канале...
            </ChannelMainInfoBox>
        );
    }

    if (channelInfoIsError) {
        return (
            <ChannelMainInfoBox>
                Не удалось загрузить информацию о канале {props.channelId}
            </ChannelMainInfoBox>);
    }

    return (
        <ChannelMainInfoBox>
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
        </ChannelMainInfoBox>
    );
};

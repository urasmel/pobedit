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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    boxSizing: "border-box",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                    padding: 1,
                    minHeight: "85px",
                }}>
                <CircularProgress
                    sx={{
                        color: "rgb(52, 71, 103)",
                    }} />
            </Box>
        );
    }

    if (channelInfoIsError) {
        return (
            <ChannelMainInfoBox>
                <Box
                    sx={{
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        color: "rgb(52, 71, 103)"
                    }} >
                    Не удалось загрузить информацию о канале {props.channelId}
                </Box>
            </ChannelMainInfoBox>);
    }

    return (
        <ChannelMainInfoBox>
            <Box
                sx={{
                    whiteSpace: "nowrap",
                    // wordWrap: "break-word",
                    color: "rgb(52, 71, 103)"
                }} >
                Канал:&nbsp;
                <NavLink to={`/channels/${channelInfo?.tlgId}`}>
                    {channelInfo?.title}
                </NavLink>
            </Box>
            <Box
                sx={{
                    whiteSpace: "nowrap",
                    // wordWrap: "break-word",
                    color: "rgb(52, 71, 103)"
                }}>
                id: {channelInfo?.tlgId}
            </Box>
        </ChannelMainInfoBox>
    );
};

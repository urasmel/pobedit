import { useFetchChannelDetail } from '@/entities/channels/api/hooks';
import { Typography, Skeleton, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { ChannelMainInfoBox } from './channel-main-info-box';

interface ChannelMainInfoProps {
    channelId: string;
}

const textStyles = {
    color: "rgb(52, 71, 103)",
    whiteSpace: "nowrap" as const,
};



export const ChannelMainInfo = ({ channelId }: ChannelMainInfoProps) => {

    const theme = useTheme();

    const {
        channelInfo,
        channelInfoErrorMsg,
        channelInfoIsLoading,
        channelInfoIsError
    } = useFetchChannelDetail(channelId);

    const linkStyle = {
        color: theme.palette.primary.dark,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    };

    useEffect(() => {
        if (channelInfoIsError && channelInfoErrorMsg) {
            enqueueSnackbar(channelInfoErrorMsg, { variant: 'error' });
        }
    }, [channelInfoIsError, channelInfoErrorMsg]);

    if (channelInfoIsError) {
        return (
            <ChannelMainInfoBox>
                <Typography sx={{ ...textStyles, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                    Не удалось загрузить информацию о канале {channelId}
                </Typography>
            </ChannelMainInfoBox>
        );
    }

    return (
        <ChannelMainInfoBox>
            {channelInfoIsLoading ? (
                // Скелетон-загрузка с той же структурой, что и реальный контент
                <>
                    <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={20} />
                </>
            ) : !channelInfo ? (
                <Typography sx={textStyles}>
                    Информация о канале не найдена
                </Typography>
            ) : (
                <>
                    <Typography sx={textStyles}>
                        Канал: {" "}
                        <NavLink
                            style={linkStyle}
                            to={`/channels/${channelInfo.tlgId}`}
                        >
                            <strong>
                                {channelInfo.title}
                            </strong>
                        </NavLink>
                    </Typography>
                    <Typography sx={textStyles}>
                        id: {channelInfo.tlgId}
                    </Typography>
                </>
            )}
        </ChannelMainInfoBox>
    );
};

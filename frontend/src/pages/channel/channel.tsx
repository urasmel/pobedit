import { channelsApi } from "@/entities/channels";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Chip,
    Stack,
    Skeleton,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ErrorOutline, People, Description } from "@mui/icons-material";

export const ChannelPage = () => {
    const { channelId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        data: info,
        isLoading,
        isError,
    } = useQuery({
        ...channelsApi.channelQueries.details(channelId!),
        enabled: !!channelId, // Запрос выполняется только если channelId существует
    });

    // Обработка состояний загрузки и ошибок
    if (!channelId) {
        return (
            <Box sx={containerStyles}>
                <Card sx={cardStyles}>
                    <CardContent sx={errorContentStyles}>
                        <ErrorOutline sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" align="center">
                            ID канала не указан
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={containerStyles}>
                <Card sx={cardStyles}>
                    <CardContent sx={errorContentStyles}>
                        <ErrorOutline sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                        <Typography variant="h6" color="error" gutterBottom>
                            Ошибка загрузки
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            Не удалось загрузить информацию о канале
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={containerStyles}>
            <Card sx={cardStyles}>
                <CardContent sx={cardContentStyles}>
                    {/* Заголовок */}
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={titleStyles}
                    >
                        {isLoading ? (
                            <Skeleton width={200} />
                        ) : (
                            info?.title || 'Без названия'
                        )}
                    </Typography>

                    {/* Основная информация в строку (на десктопе) или колонку (на мобильных) */}
                    <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={3}
                        alignItems={isMobile ? "center" : "flex-start"}
                        sx={mainContentStyles}
                    >
                        {/* Аватар канала */}
                        <Box sx={avatarContainerStyles}>
                            {isLoading ? (
                                <Skeleton
                                    variant="circular"
                                    width={120}
                                    height={120}
                                    sx={avatarSkeletonStyles}
                                />
                            ) : (
                                <Avatar
                                    src={info?.image ? `data:image/jpeg;base64,${info.image}` : undefined}
                                    variant="rounded"
                                    sx={avatarStyles}
                                    alt={info?.title ? `Аватар канала ${info.title}` : 'Аватар канала'}
                                >
                                    {!info?.image && (
                                        <Avatar
                                            sx={fallbackAvatarStyles}
                                            variant="rounded"
                                        >
                                            <img
                                                src="/images/no_image.svg"
                                                alt="Нет изображения"
                                                style={{ width: '60%', opacity: 0.5 }}
                                            />
                                        </Avatar>
                                    )}
                                </Avatar>
                            )}
                        </Box>

                        {/* Информация о канале */}
                        <Box sx={infoContainerStyles}>
                            {/* Статистика */}
                            <Stack direction="row" spacing={2} sx={statsStyles}>
                                {isLoading ? (
                                    <>
                                        <Skeleton width={120} height={32} />
                                        <Skeleton width={100} height={32} />
                                    </>
                                ) : (
                                    <>
                                        <Chip
                                            icon={<People />}
                                            label={`Подписчики: ${info?.participantsCount?.toLocaleString() || 0}`}
                                            variant="outlined"
                                            color="primary"
                                        />
                                        {info?.mainUsername && (
                                            <Chip
                                                label={`@${info.mainUsername}`}
                                                variant="outlined"
                                            />
                                        )}
                                    </>
                                )}
                            </Stack>

                            {/* Описание канала */}
                            <Box sx={descriptionContainerStyles}>
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    gutterBottom
                                    sx={descriptionTitleStyles}
                                >
                                    <Description sx={{ fontSize: 20, mr: 1 }} />
                                    Описание
                                </Typography>
                                {isLoading ? (
                                    <>
                                        <Skeleton width="100%" height={20} />
                                        <Skeleton width="90%" height={20} />
                                        <Skeleton width="80%" height={20} />
                                    </>
                                ) : (
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            ...descriptionTextStyles,
                                            color: info?.about ? 'text.primary' : 'text.secondary'
                                        }}
                                    >
                                        {info?.about || 'Описание отсутствует'}
                                    </Typography>
                                )}
                            </Box>

                            {/* Дополнительная информация */}
                            {info?.id && (
                                <Box sx={additionalInfoStyles}>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {info.id}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

// Стили вынесены в константы для лучшей читаемости
const containerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    py: 3,
    px: 2,
};

const cardStyles = {
    width: "100%",
    maxWidth: 800,
    boxShadow: 3,
    borderRadius: 2,
    overflow: 'visible',
};

const cardContentStyles = {
    p: 4,
    '&:last-child': {
        pb: 4,
    },
};

const errorContentStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    textAlign: 'center',
};

const titleStyles = {
    fontWeight: 600,
    color: 'primary.main',
    mb: 3,
};

const mainContentStyles = {
    width: '100%',
};

const avatarContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    flexShrink: 0,
};

const avatarStyles = {
    width: 120,
    height: 120,
    borderRadius: 2,
    boxShadow: 2,
};

const avatarSkeletonStyles = {
    borderRadius: 2,
};

const fallbackAvatarStyles = {
    width: 120,
    height: 120,
    borderRadius: 2,
    bgcolor: 'grey.200',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const infoContainerStyles = {
    flex: 1,
    minWidth: 0, // Для правильного работы text-overflow
};

const statsStyles = {
    mb: 3,
    flexWrap: 'wrap' as const,
    gap: 1,
};

const descriptionContainerStyles = {
    mb: 3,
};

const descriptionTitleStyles = {
    display: 'flex',
    alignItems: 'center',
    color: 'text.secondary',
    mb: 2,
};

const descriptionTextStyles = {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: 1.6,
    bgcolor: 'grey.50',
    p: 2,
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
};

const additionalInfoStyles = {
    mt: 2,
    pt: 2,
    borderTop: '1px solid',
    borderColor: 'divider',
};

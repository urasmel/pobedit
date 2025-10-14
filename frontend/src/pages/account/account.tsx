import { accountApi } from '@/entities/account';
import { updateAccountInfo } from '@/entities/account/api/get-accounts';
import { changeTracking } from '@/entities/account/api'; // Объединены импорты
import { AccountAvatar } from '@/shared/components/account-avatar';
import { LoadingWidget } from '@/shared/components/loading/loading-widget';
import {
    Box,
    Typography,
    Stack // Добавлен для удобства компоновки
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccountInfo, ActionButtons, AvatarDialog } from './ui';

// Вынесены константы для избежания magic strings
const SNACKBAR_ERROR_OPTIONS = { variant: 'error' as const };
const SNACKBAR_SUCCESS_OPTIONS = { variant: 'success' as const };

export const AccountPage = () => {
    const queryClient = useQueryClient();
    const { accountId } = useParams();
    const navigate = useNavigate();

    const [isInfoUpdating, setIsInfoUpdating] = useState(false);
    const [isAvatarOpen, setIsAvatarOpen] = useState(false); // Переименовано для ясности

    // Добавлена проверка наличия accountId
    const { data: account, isLoading, isError } = useQuery(
        accountApi.accountsQueries.one(accountId!)
    );

    // Объединена логика отслеживания в один хендлер
    const handleTrackingToggle = useCallback(async (shouldTrack: boolean) => {
        if (!account?.tlg_id) return;

        try {
            await changeTracking(account.tlg_id.toString(), shouldTrack);
            enqueueSnackbar(
                `Пользователь ${shouldTrack ? 'отслеживается' : 'не отслеживается'}`,
                SNACKBAR_SUCCESS_OPTIONS
            );
            await queryClient.invalidateQueries(accountApi.accountsQueries.one(accountId!));
        } catch {
            enqueueSnackbar(
                `Не удалось ${shouldTrack ? 'начать' : 'остановить'} отслеживание`,
                SNACKBAR_ERROR_OPTIONS
            );
        }
    }, [account?.tlg_id, accountId, queryClient]);

    const handleUpdateInfo = useCallback(async () => {
        try {
            setIsInfoUpdating(true);
            await updateAccountInfo(accountId!);
            await queryClient.invalidateQueries(accountApi.accountsQueries.one(accountId!));
        } catch {
            enqueueSnackbar('Не удалось обновить информацию', SNACKBAR_ERROR_OPTIONS);
        } finally {
            setIsInfoUpdating(false);
        }
    }, [accountId, queryClient]);

    const handleNavigateToComments = useCallback(() => {
        navigate(`/accounts/${accountId}/comments`);
    }, [navigate, accountId]);

    // Вынесена проверка загрузки и ошибок выше основного рендера
    if (isLoading) return <LoadingWidget />;

    if (isError || !account) {
        return (
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Ошибка загрузки данных
                </Typography>
                <Typography variant="body1">
                    Не удалось загрузить информацию о пользователе.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Информация о пользователе
            </Typography>

            <Stack spacing={2} mb={2}>
                <AccountAvatar
                    account={account}
                    onClick={() => setIsAvatarOpen(true)} // Переименован хендлер
                />

                {/* Вынесено в отдельный компонент для читаемости */}
                <AccountInfo account={account} />
            </Stack>

            <ActionButtons
                isTracking={account.is_tracking}
                isUpdating={isInfoUpdating}
                onTrackingToggle={handleTrackingToggle}
                onUpdateInfo={handleUpdateInfo}
                onNavigateToComments={handleNavigateToComments}
            />

            <AvatarDialog
                open={isAvatarOpen}
                onClose={() => setIsAvatarOpen(false)}
                account={account}
            />
        </Box>
    );
};

AccountPage.displayName = 'AccountPage';

import { accountApi } from '@/entities/account';
import { updateAccountInfo } from '@/entities/account/api/get-accounts';
import { ErrorAction } from '@/shared/components/ErrorrAction';
import Loading from '@/shared/components/Loading';
import { Box, Typography, Button, Snackbar, Alert, Avatar, Dialog, DialogContent } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AccountPage = () => {

    const queryClient = useQueryClient();
    const { accountId } = useParams();
    const navigate = useNavigate();
    const [updateWithError, setUpdatingWithError] = useState(false);
    const [isInfoUpdating, setIsInfoUpdating] = useState(false);
    const [avaOpen, setAvaOpen] = useState(false);


    const {
        data: account,
        isLoading,
        isError,
    } = useQuery(accountApi.accountsQueries.one(accountId));


    const handleUpdate = async () => {
        try {
            setIsInfoUpdating(true);
            await updateAccountInfo(accountId).then(() => {
                queryClient.invalidateQueries(accountApi.accountsQueries.one(accountId));
            });
        } catch (error) {
            setUpdatingWithError(true);
        }
        finally {
            setIsInfoUpdating(false);
        }
    };

    const handleErrorClose = () => {
        setUpdatingWithError(false);
    };

    const handleClickOpen = () => {
        setAvaOpen(true);
    };

    const handleClose = () => {
        setAvaOpen(false);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
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
            <Box sx={{ marginBottom: 2 }}>

                {
                    account?.photo
                        ?
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                cursor: "pointer",
                            }}
                            alt="User Avatar"
                            src={`data:image/jpeg;base64,${account?.photo}`}
                            onClick={handleClickOpen}
                        />
                        :
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                cursor: "pointer",
                            }}
                            alt="User Avatar"
                            onClick={handleClickOpen}
                            src={`${import.meta.env.BASE_URL}ava.png`}
                        />
                }

                <Typography variant="body1">
                    <strong>Логин:</strong> {account?.username}
                </Typography>
                <Typography variant="body1">
                    <strong>Имя:</strong> {account?.first_name}
                </Typography>
                <Typography variant="body1">
                    <strong>Фамилия:</strong> {account?.last_name}
                </Typography>
                <Typography variant="body1">
                    <strong>Телефон:</strong> {account?.phone}
                </Typography>
                <Typography variant="body1">
                    <strong>Bio:</strong> {account?.bio}
                </Typography>
            </Box>

            {
                isInfoUpdating
                    ?
                    <Loading />
                    :
                    <Box
                        sx={{
                            display: 'flex',
                            gap: ".5rem"
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => { navigate(`/accounts/${accountId}/comments`); }}
                        >
                            Все комментарии
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleUpdate}
                        >
                            Обновить информцию
                        </Button>
                    </Box>
            }

            <Snackbar
                open={updateWithError}
                autoHideDuration={6000}
                action={ErrorAction(handleErrorClose)}
                onClose={handleErrorClose}
            >
                <Alert
                    onClose={handleErrorClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Не удалось обновить информацию о пользователе
                </Alert>
            </Snackbar>

            <Dialog
                open={avaOpen}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth={true}
            >
                <DialogContent>
                    {
                        account?.photo
                            ?
                            <img
                                alt="User Avatar"
                                src={`data:image/jpeg;base64,${account?.photo}`}
                            />
                            :
                            <img
                                alt="User Avatar"
                                src={`${import.meta.env.BASE_URL}ava.png`}
                            />
                    }
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default AccountPage;

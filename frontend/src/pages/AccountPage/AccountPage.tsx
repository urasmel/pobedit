import { accountApi } from '@/entities/account';
import Loading from '@/shared/components/Loading';
import { Box, Typography, Button, Link } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

const AccountPage = () => {

    const { accountId } = useParams();
    const navigate = useNavigate();

    const {
        data: account,
        isFetching,
        isLoading,
        isError,
        error
    } = useQuery(accountApi.accountsQueries.one(accountId));


    if (isLoading) {
        return <Loading />;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Информация о пользователе
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
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
            <Box>
                <Button
                    variant="contained"
                    onClick={() => { navigate(`/accounts/${accountId}/comments`); }}
                >
                    Все комментарии
                </Button>
            </Box>
        </Box>
    );
};

export default AccountPage;

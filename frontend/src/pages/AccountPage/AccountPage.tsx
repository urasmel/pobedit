import { Box, Typography, Button, Link } from '@mui/material';

const AccountPage = () => {
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Информация о пользователе
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1">
                    <strong>Логин:</strong> John Doe
                </Typography>
                <Typography variant="body1">
                    <strong>Имя:</strong> john.doe@example.com
                </Typography>
                <Typography variant="body1">
                    <strong>Фамилия:</strong> john.doe@example.com
                </Typography>
                <Typography variant="body1">
                    <strong>Телефон:</strong> January 1, 2022
                </Typography>
                <Typography variant="body1">
                    <strong>Bio:</strong> January 1, 2022
                </Typography>
            </Box>
            <Box>
                <Link href="/comments" underline="none">
                    <Button variant="contained" color="primary">
                        View Comments
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};

export default AccountPage;

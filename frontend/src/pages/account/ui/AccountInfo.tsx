import { Account } from "@/entities";
import { Checkbox, Typography } from "@mui/material";

interface AccountInfoProps {
    account: Account; // Замените на реальный тип
}

export const AccountInfo = ({ account }: AccountInfoProps) => (
    <>
        <Typography variant="body1">
            <strong>Логин:</strong> {account.username || '—'}
        </Typography>
        <Typography variant="body1">
            <strong>Имя:</strong> {account.first_name || '—'}
        </Typography>
        <Typography variant="body1">
            <strong>Фамилия:</strong> {account.last_name || '—'}
        </Typography>
        <Typography variant="body1">
            <strong>Телефон:</strong> {account.phone || '—'}
        </Typography>
        <Typography variant="body1">
            <strong>Bio:</strong> {account.bio || '—'}
        </Typography>
        <Typography variant="body1" component="div">
            <strong>Отслеживается:</strong>
            <Checkbox checked={account.is_tracking} disabled />
        </Typography>
    </>
);

AccountInfo.displayName = 'AccountInfo';

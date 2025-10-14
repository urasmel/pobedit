import { Account } from "@/entities";
import { AccountAvatar } from "@/shared/components/account-avatar";
import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export interface AccountHeaderProps {
    accountId: string;
    account: Account; // Замените на реальный тип
    onAvatarClick: () => void;
}

export const AccountHeader = ({ accountId, account, onAvatarClick }: AccountHeaderProps) => (
    <Box sx={headerStyles}>
        <NavLink to={`/accounts/${accountId}`} style={{ textDecoration: 'none' }}>
            <AccountAvatar account={account} onClick={onAvatarClick} />
        </NavLink>

        <Typography variant="h5" component="h1">
            {account?.first_name || 'Пользователь'}
        </Typography>
    </Box>
);

const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 3,
    padding: 2,
    backgroundColor: 'primary.light',
    borderRadius: 'var(--radius-md)',
    gap: 2,
};

AccountHeader.displayName = 'AccountHeader';

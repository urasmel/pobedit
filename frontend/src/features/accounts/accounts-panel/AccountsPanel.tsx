import { Box } from '@mui/material';
import { AccountsPanelProps } from './AccountsPanelProps';
import { AccountCard } from '../account-card';

export const AccountsPanel = (props: AccountsPanelProps) => {
    return (
        <Box sx={{
            display: "flex",
            flex: 1,
            gap: "2rem",
            flexWrap: "wrap",
            alignItems: "start",
            width: "100%",
            height: "100%"
        }}>

            {
                props.accounts?.map(account =>
                    <AccountCard account={account} key={account.tlg_id} />
                )
            }

        </Box>
    );
};

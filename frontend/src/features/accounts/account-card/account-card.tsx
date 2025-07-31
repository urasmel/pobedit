import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import PhoneIcon from '@mui/icons-material/Phone';
import { Box, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Account } from '@/entities';
import { NavLink } from 'react-router-dom';
import { AccountAvatar } from '@/shared/components/account-avatar';

const StyledCard = styled(Card)(({ theme }) => ({
    width: 300,
    height: 300,
    borderRadius: 12,
    boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.24)'
    },
}));

export const AccountCard = (props: { account: Account; }) => {
    return (
        <StyledCard>
            <CardHeader
                sx={{
                    boxSizing: "border-box"
                }}
                avatar={
                    <NavLink
                        to={`/accounts/${props.account.tlg_id}`}
                    >
                        <AccountAvatar
                            account={props.account}
                            handleClick={() => { }}
                        />
                    </NavLink>
                }
                title={
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        maxWidth={"190px"}
                        noWrap
                    >
                        {props.account.main_username}
                    </Typography>
                }
                subheader={
                    <Typography
                        variant="subtitle2"
                        color="textSecondary">
                        Пользователь
                    </Typography>
                }
            />

            <Divider variant="middle" />

            <CardContent
                sx={{
                    marginBottom: "0px",
                    '&:last-child': {
                        marginBottom: "0px"
                    }
                }}
            >
                <Box mb={1}>
                    {
                        props.account.first_name &&
                        <>
                            <Typography variant="body2" color="textSecondary">
                                Имя
                            </Typography>
                            <Typography variant="h6" noWrap >
                                {props.account.first_name}
                            </Typography>
                        </>
                    }

                    {
                        props.account.last_name &&
                        <>
                            <Typography variant="body2" color="textSecondary">
                                Фамилия
                            </Typography>
                            <Typography variant="h6" noWrap >
                                {props.account.last_name}
                            </Typography>
                        </>
                    }

                </Box>

                {
                    props.account.phone &&
                    <>
                        <Box display="flex" alignItems="center">
                            <PhoneIcon color="primary" sx={{ mr: 1.5 }} />
                            <Typography variant="body1">
                                {props.account.phone}
                            </Typography>
                        </Box>
                    </>
                }

            </CardContent>
        </StyledCard>
    );
};

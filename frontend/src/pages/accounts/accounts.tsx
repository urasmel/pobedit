import { accountApi } from '@/entities/account';
import { changeTracking } from '@/entities/account/api';
import { updateAccountInfo } from '@/entities/account/api/get-accounts';
import { useFetchAccountsCount } from '@/entities/account/api/hooks/useFetchAccountsCount';
import { AccountAvatar } from '@/shared/components/account-avatar';
import { LoadingWidget } from '@/shared/components/loading/loading-widget';
import { ScrollToTopButton } from '@/shared/components/scroll-top-button';
import { PAGE_SIZE } from '@/shared/config';
import { Box, Typography, Button, Dialog, DialogContent, Checkbox, Pagination, FormControlLabel, Input, TextField } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const AccountsPage = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(PAGE_SIZE);
    const [isTracking, setIsTracking] = useState(false);
    const [pagesCount, setPagesCount] = useState(0);
    const [login, setLogin] = useState("");
    const [debouncedLogin, setDebouncedLogin] = useState("");

    const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);

    const {
        data: accounts,
        isLoading,
        isError,
    } = useQuery(accountApi.accountsQueries.all(offset, limit, isTracking, debouncedLogin));


    const {
        accountsCount,
        accountsCountError,
        accountsCountErrorMsg
    } = useFetchAccountsCount(isTracking, debouncedLogin);

    const onPageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setOffset(PAGE_SIZE * (page - 1));
    };

    const onLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setLogin(_ => value);
        if (debouncedSearchRef.current !== null) {
            debouncedSearchRef.current?.(value);
        }
    };

    const fetchResults = (query: string) => {
        setDebouncedLogin(query);
    };

    useEffect(() => {
        debouncedSearchRef.current = debounce(fetchResults, 500);

        return () => {
            debouncedSearchRef.current?.cancel();
        };
    }, []);

    useEffect(
        () => {
            if (accountsCount === undefined || accountsCount === 0) {
                setPagesCount(0);
                return;
            }

            if (accountsCount % PAGE_SIZE == 0) {
                setPagesCount(accountsCount / PAGE_SIZE);
            }
            else {
                setPagesCount(Math.ceil(accountsCount / PAGE_SIZE));
            }
        }, [accountsCount]
    );

    if (isLoading) {
        <Box sx={{ padding: 4 }}>
            return <LoadingWidget />
        </Box>;
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
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            rowGap: "2rem",
            alignItems: "start",
            width: "100%",
            height: "100%"
        }}>

            <FormControlLabel
                control=
                {
                    <Checkbox
                        checked={isTracking}
                        onChange={_ => setIsTracking(!isTracking)}
                    />
                }
                label="Отслеживаемые"
            />


            <TextField
                id="outlined-controlled"
                label="Логин"
                value={login}
                onChange={onLoginChange}
            />


            {
                accounts?.map(account =>
                    <Box sx={{ marginBottom: 2, display: 'flex' }} key={account.tlg_id}>

                        <NavLink
                            to={`/accounts/${account.tlg_id}`}
                        >
                            <AccountAvatar
                                account={account}
                                handleClick={() => { }}
                            />
                        </NavLink>

                        <Box sx={{ marginLeft: 2 }}>
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
                            <Typography variant="body1">
                                <strong>Отслеживается:</strong>
                                <Checkbox
                                    checked={account?.is_tracking}
                                />
                            </Typography>
                        </Box>

                    </Box>
                )
            }

            {
                !isError &&
                <Pagination
                    sx={{ marginTop: 'auto' }}
                    count={pagesCount}
                    variant="outlined"
                    shape="rounded"
                    onChange={onPageChange}
                />
            }

            <ScrollToTopButton />
        </Box>
    );
};

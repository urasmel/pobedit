import { accountApi } from '@/entities/account';
import { useFetchAccountsCount } from '@/entities/account/api/hooks/useFetchAccountsCount';
import { AccountsFilter } from '@/features/accounts/accounts-filter';
import { TrackingOptions } from '@/features/accounts/accounts-filter/accounts-filter-props';
import { AccountsPanel } from '@/features/accounts/accounts-panel';
import { LoadingWidget } from '@/shared/components/loading/loading-widget';
import { ScrollToTopButton } from '@/shared/components/scroll-top-button';
import { PAGE_SIZE } from '@/shared/config';
import { Box, Typography, Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

export const AccountsPage = () => {

    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(PAGE_SIZE);
    const [isTracking, setIsTracking] = useState<TrackingOptions>(TrackingOptions.All);
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

    const onIsTrackingChange = (value: TrackingOptions) => {
        setIsTracking(value);
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

            <AccountsFilter
                isTracking={isTracking}
                loginFilter={login}
                onIsTrackingChange={onIsTrackingChange}
                onLoginFilterChange={onLoginChange}
            />

            <AccountsPanel accounts={accounts} />

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

import { useQuery } from "@tanstack/react-query";
import { getLocalizedString } from "@/shared/locales/localizing";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { accountApi } from "../../";
import { TrackingOptions } from "@/features/accounts/accounts-filter/AccountsFilterProps";

export const useFetchAccountsCount = (isTracking: TrackingOptions, login: string) => {

    const { data,
        isError,
        isLoading,
        error
    } = useQuery(accountApi.accountsQueries.count(isTracking, login));

    const [accountsCountError, setAccountsCountError] = useState(false);
    const accountsCountErrorMsg = getLocalizedString(error, t);

    useEffect(() => {
        if (error) {
            setAccountsCountError(true);
        }
    }, [error]);

    const handleAccountsCountErrorClose = () => {
        setAccountsCountError(false);
    };

    return {
        accountsCount: data,
        accountsCountError,
        accountsCountIsLoading: isLoading,
        accountsCountErrorMsg,
        accountsCountIsError: isError,
        handleAccountsCountErrorClose
    };
};

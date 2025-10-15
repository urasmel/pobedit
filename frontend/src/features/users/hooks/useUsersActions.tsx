// users-actions.tsx
import { useCallback } from 'react';
import { GridRowId } from "@mui/x-data-grid";
import { User } from "@/entities/users/model/User";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export const useUsersActions = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    const handleDelete = useCallback((userId: GridRowId) => {
        // API call to delete user
        console.log('Delete user:', userId);
        enqueueSnackbar(t('users.deleteSuccess'), { variant: 'success' });
    }, [enqueueSnackbar, t]);

    const handleEdit = useCallback((user: User) => {
        // Edit logic
        console.log('Edit user:', user);
    }, []);

    const handleLogin = useCallback((user: User) => {
        // Login logic
        console.log('Login as user:', user);
        enqueueSnackbar(t('users.loginSuccess'), { variant: 'info' });
    }, [enqueueSnackbar, t]);

    return { handleDelete, handleEdit, handleLogin };
};


// users-columns.tsx
import { useMemo } from 'react';
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { User } from "@/entities/users/model/User";
import { useTranslation } from "react-i18next";
import { useUsersActions } from './useUsersActions';
import i18n from '@/app/i18n';
import { theme } from '@/app/theme';
import { Box } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LoginIcon from "@mui/icons-material/Login";

export const useUsersColumns = () => {
    const { t } = useTranslation();
    const { handleDelete, handleEdit, handleLogin } = useUsersActions();

    // Мемоизированные колонки с зависимостью от языка
    return useMemo<GridColDef<User>[]>(() => [
        {
            field: "userId",
            headerName: t('users.fields.id') || "ID",
            width: 80,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: "username",
            headerName: t('users.fields.username') || "Пользователь",
            width: 120,
            minWidth: 100
        },
        {
            field: "password",
            headerName: t('users.fields.password') || "Пароль",
            flex: 1,
            minWidth: 150,
            renderCell: () => (
                <Box sx={{ fontFamily: 'monospace' }}>
                    ••••••••
                </Box>
            )
        },
        {
            field: "phoneNumber",
            headerName: t('users.fields.phoneNumber') || "Тел. номер",
            width: 130,
            minWidth: 120
        },
        {
            field: "actions",
            type: "actions",
            width: 120,
            headerName: t('users.fields.actions') || "Операции",
            getActions: (params: GridRowParams<User>) => [
                <GridActionsCellItem
                    key="delete"
                    icon={<DeleteIcon />}
                    label={t('users.actions.delete')}
                    onClick={() => handleDelete(params.id)}
                    sx={{ color: theme.palette.error.main }}
                />,
                <GridActionsCellItem
                    key="edit"
                    icon={<EditIcon />}
                    label={t('users.actions.edit')}
                    onClick={() => handleEdit(params.row)}
                    showInMenu
                />,
                <GridActionsCellItem
                    key="login"
                    icon={<LoginIcon />}
                    label={t('users.actions.login')}
                    onClick={() => handleLogin(params.row)}
                    showInMenu
                />,
            ],
        },
    ], [t, i18n.language, handleDelete, handleEdit, handleLogin, theme]);


};

import {
    GridRowParams,
} from "@mui/x-data-grid";
import { useCallback } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { User } from "@/entities/users/model/user";
import { CustomNoRowsOverlay } from "@/shared/components/custom-no-rows-overlay";
import { DataGridTitle } from "@/shared/components/data-grid-title";
import { UserRow } from "@/entities";
import { Action, MainState, useMainStore } from "@/app/stores";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/users";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { useUsersColumns } from "./hooks";

interface UsersTableProps {
    onAddUser?: () => void;
    onRefresh?: () => void;
}

export const Users = ({ onAddUser, onRefresh }: UsersTableProps) => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const {
        data,
        isFetching,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        ...userApi.userQueries.list(),
        // onError: (error) => {
        //     const errorMsg = getLocalizedString(error, t);
        //     enqueueSnackbar(errorMsg, { variant: 'error' });
        // }
    });

    const setSelectedUser = useMainStore(
        (state: MainState & Action) => state.updateSelectedUser
    );


    const columns = useUsersColumns();

    const handleRowClick = useCallback((params: GridRowParams<UserRow>) => {
        setSelectedUser(params.row.username);
    }, [setSelectedUser]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const users = data?.users || [];

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            minHeight: 400,
            gap: 2,
        }}>
            <Box sx={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <DataGrid
                    sx={{
                        flex: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.shape.borderRadius,
                        color: "#344767",
                        '& .MuiDataGrid-cell': {
                            borderColor: theme.palette.divider,
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: theme.palette.background.default,
                            borderColor: theme.palette.divider,
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: theme.palette.action.hover,
                            cursor: "pointer",
                        },
                        '& .MuiDataGrid-cell:focus': {
                            outline: "none",
                        },
                    }}
                    onRowClick={handleRowClick}
                    rows={users}
                    columns={columns}
                    getRowId={(row: User) => row.userId}
                    loading={isLoading || isFetching}
                    disableColumnMenu
                    disableRowSelectionOnClick
                    slots={{
                        toolbar: DataGridTitle,
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    slotProps={{
                        toolbar: {
                            title: t("users.title") || "Пользователи",
                        },
                        loadingOverlay: {
                            variant: 'skeleton',
                            noRowsVariant: 'skeleton',
                        },
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                />
            </Box>

            <Box sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                flexWrap: 'wrap'
            }}>
                <Button
                    variant="outlined"
                    onClick={handleRefresh}
                    disabled={isFetching}
                    startIcon={<RefreshIcon />}
                    sx={{ minWidth: 120 }}
                >
                    {t('common.refresh')}
                </Button>

                <Button
                    variant="contained"
                    onClick={onAddUser}
                    startIcon={<AddIcon />}
                    sx={{ minWidth: 120 }}
                >
                    {t('common.add')}
                </Button>
            </Box>
        </Box>
    );
};

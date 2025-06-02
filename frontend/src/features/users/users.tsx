import {
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import {
    useEffect,
    useMemo,
} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LoginIcon from "@mui/icons-material/Login";
import {
    Box,
} from "@mui/material";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { User } from "@/entities/users/model/user";
import { CustomNoRowsOverlay } from "@/shared/components/custom-no-rows-overlay";
import { DataGridTitle } from "@/shared/components/data-grid-title";
import { UserRow } from "@/entities";
import { Action, MainState, useMainStore } from "@/app/stores";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/users";
import { useTranslation } from "react-i18next";
import { getLocalizedErrorMessage } from "@/shared/errors/errorMessages";
import { enqueueSnackbar } from "notistack";


export const Users = () => {
    const { t } = useTranslation();
    const { data, isFetching, isLoading, isError, error } = useQuery(userApi.userQueries.list());
    const errorMsg = getLocalizedErrorMessage(error, t);

    const setSelectedUser = useMainStore(
        (state: MainState & Action) => state.updateSelectedUser
    );

    useEffect(() => {
        if (isError) {
            enqueueSnackbar(errorMsg, { variant: 'error' });
        }
    }, [isError]);

    const columns = useMemo<GridColDef<User>[]>(
        () => [
            { field: "userId", headerName: "ID", width: 50 },
            { field: "username", headerName: "Пользователь", width: 100 },
            { field: "password", headerName: "Пароль", flex: 1 },
            { field: "phoneNumber", headerName: "Тел. номер", width: 150 },
            {
                field: "actions",
                type: "actions",
                flex: 1,
                headerName: "Операции",
                getActions: () => [
                    <GridActionsCellItem
                        key={0}
                        icon={<DeleteIcon />}
                        label="Удалить"
                    />,
                    <GridActionsCellItem
                        key={1}
                        icon={<EditIcon />}
                        label="Редактировать"
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={1}
                        icon={<LoginIcon />}
                        label="Логин"
                        showInMenu
                    />,
                ],
            },
        ],
        []
    );

    const handleRowClick = (params: GridRowParams<UserRow>) => {
        setSelectedUser(params.row.username);
        // TODO
        // Пользователи ничего не должны знать о таблице с каналами
        // Загрузка и перерисовка каналов там должна происходить сама собой
        // после выбора другого пользователя.
        // fetchChannels(params.row["username"]);
    };

    return (
        <Box sx={{
            minWidth: "12rem",
            width: "100%",
            '@media (min-width: 1078px)': {
                width: '49%',
            },
        }}>
            <div style={{ height: 400 }}>
                <DataGrid
                    sx={{
                        "--DataGrid-overlayHeight": "300px",
                        ".MuiDataGrid-cell:focus": {
                            outline: "none",
                        },
                        "& .MuiDataGrid-row:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onRowClick={handleRowClick}
                    slots={{
                        toolbar: () => DataGridTitle("Пользователи"),
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    rows={data ? data.users : []}
                    columns={columns}
                    getRowId={(row: User) => row.userId}
                    loading={isLoading || isFetching}
                />
            </div>

            <Box sx={{
                marginTop: "1rem",
                display: "flex",
                columnGap: "1rem"
            }}>
                <Button
                    sx={{
                        width: "100px",
                    }}
                    variant="contained"
                >
                    Обновить
                </Button>

                <Button
                    sx={{
                        width: "100px",
                    }}
                    variant="contained"
                >
                    Добавить
                </Button>
            </Box>
        </Box>
    );
};

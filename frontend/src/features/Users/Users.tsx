import {
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import {
    useMemo,
    useState,
} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LoginIcon from "@mui/icons-material/Login";
import {
    Alert,
    Box,
    Snackbar,
} from "@mui/material";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { User } from "@/entities/users/model/User";
import CustomNoRowsOverlay from "@/shared/components/CustomNoRowsOverlay";
import DataGridTitle from "@/shared/components/DataGridTitle";
import { UserRow } from "@/entities";
import { Action, MainState, useMainStore } from "@/app/stores";
import { ErrorAction } from "@/shared/components/ErrorrAction";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/users";


export const Users = () => {
    const { data, isFetching, isLoading, isError, error } = useQuery(userApi.userQueries.list());
    const [openErrorMessage, setOpenErrorMessage] = useState(false);

    const setSelectedUser = useMainStore(
        (state: MainState & Action) => state.updateSelectedUser
    );

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
                getActions: (params: GridRowParams) => [
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

    const loadUsers = async () => {
        // const data = await fetchUsers();
        // setUsers(() => data);
    };

    const onClickBtnLoadAccounts = async () => {
        await loadUsers();
    };

    const handleRowClick = (params: GridRowParams<UserRow>) => {
        setSelectedUser(params.row.username);
        // TODO
        // Пользователи ничего не должны знать о таблице с каналами
        // Загрузка и перерисовка каналов там должна происходить сама собой
        // после выбора другого пользователя.
        // fetchChannels(params.row["username"]);
    };

    const handleErrorClose = () => {
        setOpenErrorMessage(false);
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
                    onClick={() => onClickBtnLoadAccounts}
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

            <Snackbar
                open={isError}
                autoHideDuration={6000}
                action={ErrorAction(handleErrorClose)}
                onClose={handleErrorClose}
            >
                <Alert
                    onClose={handleErrorClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error?.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

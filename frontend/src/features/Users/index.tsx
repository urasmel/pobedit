import {
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LoginIcon from "@mui/icons-material/Login";
import {
    Snackbar,
} from "@mui/material";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import styles from "./styles.module.css";
import { User } from "@/entities/User";
import CustomNoRowsOverlay from "@/shared/components/CustomNoRowsOverlay";
import DataGridTitle from "@/shared/components/DataGridTitle";
import { UserRow } from "@/entities";
import { Action, MainState, useMainStore } from "@/app/stores";
import { ErrorAction } from "@/shared/components/ErrorrAction";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/entities/users";

export const Users = () => {
    //const [users, setUsers] = useState<User[]>([]);
    const {
        users: User[],
        error,
        isLoading,
        isError,
    } = useQuery(usersApi.usersQueries.detail({ id }));




    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [isUsersLoading, setIsUsersLoading] = useState(false);

    const setSelectedUser = useMainStore(
        (state: MainState & Action) => state.updateSelectedUser
    );

    useEffect(() => {

        const fetchData = async () => {
            setIsUsersLoading(true);

            try {
                const users: UserRow[] = await fetchUsers();
                setUsers(users);
            } catch (e: unknown) {
                setUsers([]);
                setOpenErrorMessage(true);
                setErrorMessage("Ошибка загрузки пользователей");
                console.log("Ошибка загрузки пользователейs");
                return;
            } finally {
                setIsUsersLoading(false);
            }
        };

        fetchData().catch(console.error);
    }, []);

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
        const data = await fetchUsers();
        setUsers(() => data);
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
        <section className={styles.users}>
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
                        toolbar: () => DataGridTitle("Users"),
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    rows={users}
                    columns={columns}
                    getRowId={(row: User) => row.userId}
                    loading={isUsersLoading}
                />
            </div>

            <div className={styles.users__buttons}>
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
            </div>

            <Snackbar
                open={openErrorMessage}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                message={errorMessage}
                action={ErrorAction(handleErrorClose)}
            />
        </section>
    );
};

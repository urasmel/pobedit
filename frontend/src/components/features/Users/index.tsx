import {
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import React, {
    MouseEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Snackbar,
    TextField,
} from "@mui/material";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
    addUser,
    deleteUser,
    editUser,
    fetchUsers as fetchUsers,
} from "@/api/users";
import styles from "./styles.module.css";
import { User } from "@/models/user";
import CustomNoRowsOverlay from "@/components/ui/CustomNoRowsOverlay";
import DataGridTitle from "@/components/ui/DataGridTitle";
import { UserRow } from "@/types";
import { Action, MainState, useMainStore } from "@/store/MainStore";
import { ErrorAction } from "@/components/common/ErrorrAction";

export const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [openAddUser, setOpenAddUser] = useState(false);
    const [openEditUser, setOpenEditUser] = useState(false);
    const [accId, setAccId] = useState(0);
    const [accUsername, setAccUsername] = useState("");
    const [accPhoneNumber, setAccPhoneNumber] = useState("");
    const [accPassword, setAccPassword] = useState("");
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
                setErrorMessage("Error loading users");
                console.log("Error loading users");
                return;
            } finally {
                setIsUsersLoading(false);
            }
        };

        fetchData().catch(console.error);
    }, []);

    const deleteUserIcon_handler = useCallback(
        (id: number) => () => {
            setTimeout(() => {
                deleteUser(id).then(() => { });
                setUsers((prevRows) => prevRows.filter((row) => row.userId !== id));
            });
        },
        []
    );

    const editUserIcon_handler = useCallback(
        (row: UserRow): MouseEventHandler<HTMLLIElement> | undefined => {
            setAccId(() => row.userId);
            setAccUsername(() => row.username);
            setAccPassword(() => row.password);
            setAccPhoneNumber(() => row.phoneNumber);
            setOpenEditUser(true);
            return;
        },
        []
    );

    // const loginUserIcon_handler = useCallback(
    //     async (
    //         row: UserRow
    //     ): Promise<MouseEventHandler<HTMLLIElement> | undefined> => {
    //         setAccId(() => row.userId);
    //         setAccUsername(() => row.username);
    //         setAccPassword(() => row.password);
    //         setAccPhoneNumber(() => row.phoneNumber);
    //         setOpenEditUser(true);

    //         await loginUser({
    //             username: row.username,
    //             password: row.password,
    //             phoneNumber: row.phoneNumber,
    //         });
    //         return;
    //     },
    //     []
    // );

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
                        onClick={() => deleteUserIcon_handler(params.row.userId)}
                    />,
                    <GridActionsCellItem
                        key={1}
                        icon={<EditIcon />}
                        label="Редактировать"
                        onClick={() => editUserIcon_handler(params.row)}
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
        [deleteUser]
    );

    const loadUsers = async () => {
        const data = await fetchUsers();
        setUsers(() => data);
    };

    const onClickBtnLoadAccounts = async () => {
        await loadUsers();
    };

    const handleClickOpenAddUser = () => {
        setOpenAddUser(true);
    };

    const addUserDialogClose_handler = () => {
        setOpenAddUser(false);
    };

    const editUserDialogClose_handler = () => {
        setOpenEditUser(false);
    };

    const addUserSave_handler = async () => {
        await addUser({
            username: accUsername,
            password: accPassword,
            phoneNumber: accPhoneNumber,
        });
        setOpenAddUser(false);
        await loadUsers();
        setAccId(0);
        setAccUsername("");
        setAccPassword("");
        setAccPhoneNumber("");
    };

    const editUserSave_handler = async () => {
        await editUser({
            userId: accId,
            username: accUsername,
            password: accPassword,
            phoneNumber: accPhoneNumber,
        });
        setOpenEditUser(false);
        await loadUsers();
        setAccId(0);
        setAccUsername("");
        setAccPassword("");
        setAccPhoneNumber("");
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
                    onClick={onClickBtnLoadAccounts}
                >
                    Обновить
                </Button>

                <Button
                    sx={{
                        width: "100px",
                    }}
                    variant="contained"
                    onClick={handleClickOpenAddUser}
                >
                    Добавить
                </Button>
            </div>

            <Dialog open={openAddUser} onClose={addUserDialogClose_handler}>
                <DialogTitle>Add user</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill in an user details
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="userName"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { setAccUsername(e.target.value); }}
                        value={accUsername}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="phoneNumber"
                        label="Phone number"
                        type="tel"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { setAccPhoneNumber(e.target.value); }}
                        value={accPhoneNumber}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { setAccPassword(e.target.value); }}
                        value={accPassword}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={addUserDialogClose_handler}>Cancel</Button>
                    <Button onClick={() => addUserSave_handler}>Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditUser} onClose={editUserDialogClose_handler}>
                <DialogTitle>Edit user</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill in an user details
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="userName"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { setAccUsername(e.target.value); }}
                        value={accUsername}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="phoneNumber"
                        label="Phone number"
                        type="tel"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { setAccPhoneNumber(e.target.value); }}
                        value={accPhoneNumber}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(e) => { setAccPassword(e.target.value); }}
                        value={accPassword}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={editUserDialogClose_handler}>
                        Cancel
                    </Button>
                    <Button onClick={() => editUserSave_handler}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openErrorMessage}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                message={errorMessage}
                // action={errorAction}
                action={ErrorAction(handleErrorClose)}
            />
        </section>
    );
};

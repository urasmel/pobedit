import {
    GridActionsCellItem,
    GridCallbackDetails,
    GridColDef,
    GridRowParams,
    MuiEvent,
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
    loginUser,
} from "@/api/users";
import styles from "./Users.module.css";
import { User } from "@/models/user";
import CustomNoRowsOverlay from "@/components/ui/CustomNoRowsOverlay/CustomNoRowsOverlay";
import { MainState, useMainStore } from "@/store/MainStore";
import DataGridTitle from "@/components/ui/DataGridTitle/DataGridTitle";

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
    //const { fetchChannels: fetchChannels, setSelectedUser: setSelectedUser } = useMainStore();

    const fetchChannels = useMainStore(
        (state: MainState) => state.fetchChannels
    );

    const setSelectedUser = useMainStore(
        (state: MainState) => state.setSelectedUser
    );

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUsers();
            if (data.length != 0) {
                setUsers(data);
            } else {
                setUsers([]);
                setOpenErrorMessage(true);
                setErrorMessage("Error loading users");
                // TODO добавить обработку ошибок
            }
        };

        fetchData();
    }, []);

    const deleteUserIcon_handler = useCallback(
        (id: number) => () => {
            setTimeout(() => {
                deleteUser(id);
                setUsers((prevRows) => prevRows.filter((row) => row.id !== id));
            });
        },
        []
    );

    const editUserIcon_handler = useCallback(
        (row: any): MouseEventHandler<HTMLLIElement> | undefined => {
            setAccId(() => row.id);
            setAccUsername(() => row.username);
            setAccPassword(() => row.password);
            setAccPhoneNumber(() => row.phoneNumber);
            setOpenEditUser(true);
            return;
        },
        []
    );

    const loginUserIcon_handler = useCallback(
        async (
            row: any
        ): Promise<MouseEventHandler<HTMLLIElement> | undefined> => {
            setAccId((_) => row.id);
            setAccUsername((_) => row.username);
            setAccPassword((_) => row.password);
            setAccPhoneNumber((_) => row.phoneNumber);
            setOpenEditUser(true);

            let result = await loginUser({
                Username: row.username,
                Password: row.password,
                PhoneNumber: row.PhoneNumber,
            });
            return;
        },
        []
    );

    const columns = useMemo<GridColDef<User>[]>(
        () => [
            { field: "id", headerName: "ID", width: 50 },
            { field: "username", headerName: "Username", width: 100 },
            { field: "password", headerName: "Password", flex: 1 },
            { field: "phoneNumber", headerName: "Phone Number", width: 150 },
            {
                field: "actions",
                type: "actions",
                flex: 1,
                headerName: "Actions",
                getActions: (params: GridRowParams) => [
                    <GridActionsCellItem
                        key={0}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => deleteUserIcon_handler(params.row.id)}
                    />,
                    <GridActionsCellItem
                        key={1}
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => editUserIcon_handler(params.row)}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={1}
                        icon={<LoginIcon />}
                        label="Login"
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

    const onClickBtnLoadAccaunts = async () => {
        loadUsers();
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
            userName: accUsername,
            password: accPassword,
            phoneNumber: accPhoneNumber,
        });
        setOpenAddUser(false);
        loadUsers();
        setAccId(0);
        setAccUsername("");
        setAccPassword("");
        setAccPhoneNumber("");
    };

    const editUserSave_handler = async () => {
        await editUser({
            id: accId,
            userName: accUsername,
            password: accPassword,
            phoneNumber: accPhoneNumber,
        });
        setOpenEditUser(false);
        loadUsers();
        setAccId(0);
        setAccUsername("");
        setAccPassword("");
        setAccPhoneNumber("");
    };

    const handleRowClick = (
        params: GridRowParams,
        event: MuiEvent<React.MouseEvent<HTMLElement>>,
        details: GridCallbackDetails
    ) => {
        setSelectedUser(params.row["username"]);
        fetchChannels(params.row["username"]);
    };

    const handleErrorClose = () => {
        setOpenErrorMessage(false);
    };

    const errorAction = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleErrorClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

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
                />
            </div>

            <div className={styles.users__buttons}>
                <Button
                    sx={{
                        width: "100px",
                    }}
                    variant="contained"
                    onClick={onClickBtnLoadAccaunts}
                >
                    Reload
                </Button>

                <Button
                    sx={{
                        width: "100px",
                    }}
                    variant="contained"
                    onClick={handleClickOpenAddUser}
                >
                    Add
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
                        onChange={(e) => setAccUsername(e.target.value)}
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
                        onChange={(e) => setAccPhoneNumber(e.target.value)}
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
                        onChange={(e) => setAccPassword(e.target.value)}
                        value={accPassword}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={addUserDialogClose_handler}>Cancel</Button>
                    <Button onClick={addUserSave_handler}>Add</Button>
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
                        onChange={(e) => setAccUsername(e.target.value)}
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
                        onChange={(e) => setAccPhoneNumber(e.target.value)}
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
                        onChange={(e) => setAccPassword(e.target.value)}
                        value={accPassword}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={editUserDialogClose_handler}>
                        Cancel
                    </Button>
                    <Button onClick={editUserSave_handler}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openErrorMessage}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                message={errorMessage}
                action={errorAction}
            />
        </section>
    );
};

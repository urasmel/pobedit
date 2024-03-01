import { GridActionsCellItem, GridCallbackDetails, GridColDef, GridRowParams, MuiEvent } from '@mui/x-data-grid';
import React, { MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LoginIcon from '@mui/icons-material/Login';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { addUser, deleteUser, editUser, fetchUsers as fetchUsers, loginUser } from '@/api/users';
import styles from './Users.module.css';
import { User } from '@/models/user';
import Box from '@mui/material/Box';
import CustomNoRowsOverlay from '@/components/ui/CustomNoRowsOverlay/CustomNoRowsOverlay';
import { useMainStore } from '@/store/MainStore';

const theme = createTheme({
    typography: {
        fontFamily: [
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});

function DataGridTitle() {
    return (

        <ThemeProvider theme={theme}>
            <Box style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Typography variant="h5">
                    Users
                </Typography>
            </Box>
        </ThemeProvider>

    );
}

export const Users = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [openAddUser, setOpenAddUser] = useState(false);
    const [openEditUser, setOpenEditUser] = useState(false);
    const [accId, setAccId] = useState(0);
    const [accUsername, setAccUsername] = useState('');
    const [accPhoneNumber, setAccPhoneNumber] = useState('');
    const [accPassword, setAccPassword] = useState('');
    const { fetchChannels: fetchChannels, setSelectedUser: setSelectedUser } = useMainStore();


    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUsers();
            if (data) {
                setUsers(data);
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
        [],
    );


    const editUserIcon_handler = useCallback(
        (row: any): MouseEventHandler<HTMLLIElement> | undefined => {
            setAccId(_ => row.id);
            setAccUsername(_ => row.username);
            setAccPassword(_ => row.password);
            setAccPhoneNumber(_ => row.phoneNumber);
            setOpenEditUser(true);
            return;
        }, []);


    const loginUserIcon_handler = useCallback(
        async (row: any): Promise<MouseEventHandler<HTMLLIElement> | undefined> => {
            setAccId(_ => row.id);
            setAccUsername(_ => row.username);
            setAccPassword(_ => row.password);
            setAccPhoneNumber(_ => row.phoneNumber);
            setOpenEditUser(true);

            let result = await loginUser({
                Username: row.username,
                Password: row.password,
                PhoneNumber: row.PhoneNumber
            });
            return;
        }, []);


    const columns = useMemo<GridColDef<User>[]>(
        () => [
            { field: 'id', headerName: 'ID', width: 50 },
            { field: 'username', headerName: 'Username', width: 100 },
            { field: 'password', headerName: 'Password', flex: 1, },
            { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
            {
                field: 'actions',
                type: 'actions',
                flex: 1,
                headerName: 'Actions',
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
                    />
                ],
            },
        ],
        [deleteUser]
    );


    const loadUsers = async () => {
        const data = await fetchUsers();
        setUsers(_ => data);
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
        await addUser({ userName: accUsername, password: accPassword, phoneNumber: accPhoneNumber });
        setOpenAddUser(false);
        loadUsers();
        setAccId(0);
        setAccUsername('');
        setAccPassword('');
        setAccPhoneNumber('');
    };


    const editUserSave_handler = async () => {
        await editUser({ id: accId, userName: accUsername, password: accPassword, phoneNumber: accPhoneNumber });
        setOpenEditUser(false);
        loadUsers();
        setAccId(0);
        setAccUsername('');
        setAccPassword('');
        setAccPhoneNumber('');
    };

    const handleRowClick = (
        params: GridRowParams,
        event: MuiEvent<React.MouseEvent<HTMLElement>>,
        details: GridCallbackDetails
    ) => {
        setSelectedUser(params.row['username']);
        fetchChannels(params.row['username']);
    };

    return (
        <section className={styles.users}>

            <div style={{ height: 400 }}>

                <DataGrid
                    sx={{
                        '--DataGrid-overlayHeight': '300px',
                        '.MuiDataGrid-cell:focus': {
                            outline: 'none'
                        },
                        '& .MuiDataGrid-row:hover': {
                            cursor: 'pointer'
                        }
                    }}
                    onRowClick={handleRowClick}
                    slots={{
                        toolbar: DataGridTitle,
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}

                    rows={users}
                    columns={columns}
                />

            </div>

            <div className={styles.users__buttons}>

                <Button
                    sx={{
                        width: '100px'
                    }}
                    variant="contained"
                    onClick={onClickBtnLoadAccaunts}
                >
                    Reload
                </Button>

                <Button
                    sx={{
                        width: '100px'
                    }}
                    variant="contained"
                    onClick={handleClickOpenAddUser}
                >
                    Add
                </Button>

            </div>

            <Dialog open={openAddUser} onClose={addUserDialogClose_handler}>
                <DialogTitle>
                    Add user
                </DialogTitle>
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
                        onChange={e => setAccUsername(e.target.value)}
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
                        onChange={e => setAccPhoneNumber(e.target.value)}
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
                        onChange={e => setAccPassword(e.target.value)}
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
                        onChange={e => setAccUsername(e.target.value)}
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
                        onChange={e => setAccPhoneNumber(e.target.value)}
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
                        onChange={e => setAccPassword(e.target.value)}
                        value={accPassword}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={editUserDialogClose_handler}>Cancel</Button>
                    <Button onClick={editUserSave_handler}>Save</Button>
                </DialogActions>
            </Dialog>

        </section>
    );
};

import { GridActionsCellItem, GridCallbackDetails, GridColDef, GridRowParams, MuiEvent } from '@mui/x-data-grid';
import React, { MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LoginIcon from '@mui/icons-material/Login';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { addAccount, deleteAccount, editAccount, fetchAccounts, loginAccount } from '../../api/accounts';
import styles from './Accounts.module.css';
import { Account } from '../../models/account';
import Box from '@mui/material/Box';
import CustomNoRowsOverlay from '../../ui/CustomNoRowsOverlay/CustomNoRowsOverlay';
import { useMainStore } from '../../store/MainStore';

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
                    Accounts
                </Typography>
            </Box>
        </ThemeProvider>

    );
}

export const Accounts = () => {

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [openAddAccount, setOpenAddAccount] = useState(false);
    const [openEditAccount, setOpenEditAccount] = useState(false);
    const [accId, setAccId] = useState(0);
    const [accUsername, setAccUsername] = useState('');
    const [accPhoneNumber, setAccPhoneNumber] = useState('');
    const [accPassword, setAccPassword] = useState('');
    const { fetchChats, setSelectedAccount } = useMainStore();


    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchAccounts();
            setAccounts(data);
        };

        fetchData();
    }, []);


    const deleteAccountIcon_handler = useCallback(
        (id: number) => () => {
            setTimeout(() => {
                deleteAccount(id);
                setAccounts((prevRows) => prevRows.filter((row) => row.id !== id));
            });
        },
        [],
    );


    const editAccountIcon_handler = useCallback(
        (row: any): MouseEventHandler<HTMLLIElement> | undefined => {
            setAccId(_ => row.id);
            setAccUsername(_ => row.username);
            setAccPassword(_ => row.password);
            setAccPhoneNumber(_ => row.phoneNumber);
            setOpenEditAccount(true);
            return;
        }, []);


    const loginAccountIcon_handler = useCallback(
        async (row: any): Promise<MouseEventHandler<HTMLLIElement> | undefined> => {
            setAccId(_ => row.id);
            setAccUsername(_ => row.username);
            setAccPassword(_ => row.password);
            setAccPhoneNumber(_ => row.phoneNumber);
            setOpenEditAccount(true);

            let result = await loginAccount({
                Username: row.username,
                Password: row.password,
                PhoneNumber: row.PhoneNumber
            });
            return;
        }, []);


    const columns = useMemo<GridColDef<Account>[]>(
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
                        onClick={() => deleteAccountIcon_handler(params.row.id)}
                    />,
                    <GridActionsCellItem
                        key={1}
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => editAccountIcon_handler(params.row)}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key={1}
                        icon={<LoginIcon />}
                        label="Login"
                        //onClick={() => loginAccountIcon_handler(params.row)}
                        showInMenu
                    />
                ],
            },
        ],
        [deleteAccount]
    );


    const loadAccounts = async () => {
        const data = await fetchAccounts();
        setAccounts(_ => data);
    };


    const onClickBtnLoadAccaunts = async () => {
        loadAccounts();
    };


    const handleClickOpenAddAccount = () => {
        setOpenAddAccount(true);
    };


    const addAccountDialogClose_handler = () => {
        setOpenAddAccount(false);
    };


    const editAccountDialogClose_handler = () => {
        setOpenEditAccount(false);
    };


    const addAccountSave_handler = async () => {
        await addAccount({ userName: accUsername, password: accPassword, phoneNumber: accPhoneNumber });
        setOpenAddAccount(false);
        loadAccounts();
        setAccId(0);
        setAccUsername('');
        setAccPassword('');
        setAccPhoneNumber('');
    };


    const editAccountSave_handler = async () => {
        await editAccount({ id: accId, userName: accUsername, password: accPassword, phoneNumber: accPhoneNumber });
        setOpenEditAccount(false);
        loadAccounts();
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
        setSelectedAccount(params.row['username']);
        fetchChats(params.row['username']);
    };

    return (
        <section className={styles.accounts}>

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

                    rows={accounts}
                    columns={columns}
                />

            </div>

            <div className={styles.accounts__buttons}>

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
                    onClick={handleClickOpenAddAccount}
                >
                    Add
                </Button>

            </div>

            <Dialog open={openAddAccount} onClose={addAccountDialogClose_handler}>
                <DialogTitle>
                    Add account
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill in an account details
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
                    <Button onClick={addAccountDialogClose_handler}>Cancel</Button>
                    <Button onClick={addAccountSave_handler}>Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditAccount} onClose={editAccountDialogClose_handler}>
                <DialogTitle>Edit account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill in an account details
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
                    <Button onClick={editAccountDialogClose_handler}>Cancel</Button>
                    <Button onClick={editAccountSave_handler}>Save</Button>
                </DialogActions>
            </Dialog>

        </section>
    );
};

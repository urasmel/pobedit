import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    TextField,
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridActionsCellItem,
} from "@mui/x-data-grid";
import React, {
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import styles from "./styles.module.css";
import CustomNoRowsOverlay from "@/shared/components/CustomNoRowsOverlay";
import { MainState, Action, useMainStore } from "@/app/stores";
import DataGridTitle from "@/shared/components/DataGridTitle";
const Loading = React.lazy(() => import("@/shared/components/Loading"));
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import { fetchChannels } from "@/shared/api/queries/channels";
import { ChannelInfo } from "@/entities";
import { ChannelInfoDialog } from "../ChannelInfoDialog";
import { ErrorAction } from "@/shared/components/ErrorrAction";

const Channels = () => {

    const navigate = useNavigate();
    const [openAddChannel, setOpenAddChannel] = useState(false);
    const [openShowChannelInfo, setOpenShowChannelInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const showChannelInfoDialogClose_handler = () => {
        setOpenShowChannelInfo(false);
    };
    const [channels, setChannels] = useState<ChannelInfo[]>([]);

    const selectedUser = useMainStore((state: MainState) => state.selectedUser);
    const fetchchannelInfo = useMainStore((state: MainState & Action) => state.fetchChannelInfo);
    const fetchUpdatedChannels = useMainStore((state: MainState & Action) => state.fetchUpdatedChannels);
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchData = useCallback(async (userName: string) => {

        if (typeof userName !== "string" || !userName) {
            return;
        }
        setIsLoading(true);

        try {
            const data = fetchChannels(userName);
            setChannels(await data);
        } catch (error) {
            console.error(error);
            setChannels([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedUser != undefined) {
            fetchData(selectedUser).catch(console.error);
        }
    }, [selectedUser]);

    // const onDeleteChannel = useCallback(
    //     (id: number) => () => {
    //         setTimeout(() => { });
    //     },
    //     []
    // );

    const columns = useMemo<GridColDef<ChannelInfo>[]>(() => [
        { field: "id", headerName: "ID", width: 100 },
        { field: "title", headerName: "Заголовок", flex: 1 },
        { field: "mainUsername", headerName: "Владелец", flex: 1 },
        {
            field: "isChannel",
            headerName: "Канал",
            type: "boolean",
            width: 100,
        },
        {
            field: "isGroup",
            headerName: "Группа",
            type: "boolean",
            width: 100,
        },
        {
            field: "actions",
            type: "actions",
            flex: 1,
            headerName: "Операции",
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    key={0}
                    icon={<InfoIcon />}
                    label="Показать информацию"
                    onClick={() => handleChannelInfoIconClick(params.row.id)}
                />,
            ],
        },
    ], []);

    const onBtnClickOpenAddChannel = () => { };

    const onBtnClickUpdateUserChannels = () => {
        const fetchData = async () => {
            if (typeof selectedUser !== "string" || !selectedUser) {
                return;
            }

            setIsLoading(true);
            await fetchUpdatedChannels(selectedUser);
            setIsLoading(false);
        };

        fetchData();
    };

    const onAddChannelDialogClose = () => {
        setOpenAddChannel(false);
    };

    const onAddChannelSave = () => { };

    const handleChannelInfoIconClick = async (channelId: number) => {
        const result = await fetchchannelInfo(channelId);
        if (result) { setOpenShowChannelInfo(true); }
        else {
            setErrorMessage("Ошибка загрузки информации о канале");
            setOpenErrorMessage(true);
        }
    };

    const handleChannelRowClick = (params: GridRowParams<ChannelInfo>) => {
        navigate(`/user/${selectedUser}/channels/${params.row.id}/posts`);
    };

    const handleErrorClose = () => {
        setOpenErrorMessage(false);
    };

    return (
        <section className={styles.channels}>
            <div style={{ height: 400, width: "100%" }}>
                <Suspense fallback={<Loading />}>
                    <DataGrid
                        sx={{
                            "--DataGrid-overlayHeight": "300px",
                            "& .MuiDataGrid-row:hover": {
                                cursor: "pointer",
                            },
                        }}
                        loading={isLoading}
                        onRowClick={handleChannelRowClick}
                        columnVisibilityModel={{
                            id: false,
                        }}
                        slots={{
                            toolbar: () => DataGridTitle("Channels"),
                            noRowsOverlay: CustomNoRowsOverlay,
                        }}
                        rows={channels}
                        columns={columns}
                    />
                </Suspense>
            </div>

            <div className={styles.channels__buttons}>
                <Button
                    sx={{
                        width: "100px",
                    }}
                    variant="contained"
                    onClick={onBtnClickOpenAddChannel}
                >
                    Добавить
                </Button>

                <Button
                    sx={{
                        width: "100px",
                    }}
                    variant="contained"
                    onClick={onBtnClickUpdateUserChannels}
                >
                    Обновить
                </Button>
            </div>

            <Dialog open={openAddChannel} onClose={onAddChannelDialogClose}>
                <DialogTitle>Add channel</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill in an channel details
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="userName"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="standard"
                    //onChange={e => setAccUsername(e.target.value)}
                    //value={accUsername}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="phoneNumber"
                        label="Phone number"
                        type="tel"
                        fullWidth
                        variant="standard"
                    //onChange={e => setAccPhoneNumber(e.target.value)}
                    //value={accPhoneNumber}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    //onChange={e => setAccPassword(e.target.value)}
                    //value={accPassword}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onAddChannelDialogClose}>Cancel</Button>
                    <Button onClick={onAddChannelSave}>Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openShowChannelInfo}
                onClose={showChannelInfoDialogClose_handler}
            >
                <DialogTitle>Channel info</DialogTitle>
                <DialogContent>
                    <ChannelInfoDialog />
                </DialogContent>

                <DialogActions>
                    <Button onClick={showChannelInfoDialogClose_handler}>
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>

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

export default Channels;

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    MuiEvent,
} from "@mui/x-data-grid";
import React, {
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import styles from "./Channels.module.css";
import { Channel } from "@/models/channel";
import CustomNoRowsOverlay from "@/components/ui/CustomNoRowsOverlay/CustomNoRowsOverlay";
import { MainState, useMainStore } from "@/store/MainStore";
import { ChannelInfo } from "../ChannelInfo/ChannelInfo";
import { ChannelProps } from "@/types/Props/ChannelProps";
import DataGridTitle from "@/components/ui/DataGridTitle/DataGridTitle";
const Loading = React.lazy(() => import("@/components/common/Loading/Loading"));

const Channels = ({ user }: ChannelProps) => {
    const [openAddChannel, setOpenAddChannel] = useState(false);
    const [openShowChannelInfo, setOpenShowChannelInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const showChannelInfoDialogClose_handler = () => {
        setOpenShowChannelInfo(false);
    };

    const channels = useMainStore((state: MainState) => state.channels);
    const fetchChannels = useMainStore(
        (state: MainState) => state.fetchChannels
    );
    const selectedChannelFullInfo = useMainStore(
        (state: MainState) => state.selectedChannelFullInfo
    );
    const fetchchannelFullInfo = useMainStore(
        (state: MainState) => state.fetchChannelInfo
    );
    const fetchUpdatedChannels = useMainStore(
        (state: MainState) => state.fetchUpdatedChannels
    );

    useEffect(() => {
        const fetchData = async () => {
            if (typeof user !== "string" || !user) {
                return;
            }
            setIsLoading(true);
            await fetchChannels(user);
            console.log(channels);
            setIsLoading(false);
        };

        fetchData();
    }, [user]);

    const onDeleteChannel = useCallback(
        (id: number) => () => {
            setTimeout(() => {});
        },
        []
    );

    const columns = useMemo<GridColDef<Channel>[]>(
        () => [
            { field: "id", headerName: "ID", width: 100 },
            { field: "title", headerName: "Title", flex: 1 },
            { field: "mainUsername", headerName: "Owner", flex: 1 },
            {
                field: "isChannel",
                headerName: "Is channel",
                type: "boolean",
                width: 100,
            },
            {
                field: "isGroup",
                headerName: "Is group",
                type: "boolean",
                width: 100,
            },
        ],
        []
    );

    const onBtnClickOpenAddChannel = () => {};

    const onBtnClickUpdateUserChannels = () => {
        const fetchData = async () => {
            if (typeof user !== "string" || !user) {
                return;
            }

            setIsLoading(true);
            fetchUpdatedChannels(user);
            setIsLoading(false);
        };

        fetchData();
    };

    const onAddChannelDialogClose = () => {
        setOpenAddChannel(false);
    };

    const onAddChannelSave = async () => {};

    const handleChannelRowClick = async (
        params: GridRowParams,
        event: MuiEvent<React.MouseEvent<HTMLElement>>
    ) => {
        await fetchchannelFullInfo(user, params.row["id"]);
        setOpenShowChannelInfo(true);
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
                    Add
                </Button>

                <Button
                    sx={{
                        width: "100px",
                    }}
                    variant="contained"
                    onClick={onBtnClickUpdateUserChannels}
                >
                    Update
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
                    <ChannelInfo />
                </DialogContent>

                <DialogActions>
                    <Button onClick={showChannelInfoDialogClose_handler}>
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    );
};

export default Channels;

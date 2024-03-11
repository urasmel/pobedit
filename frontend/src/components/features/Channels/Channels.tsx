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
                    <ChannelInfo
                        // chatId={123}
                        // about={'About text'}
                        // participantsCount={354}
                        // chatPhoto={'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'}
                        {...selectedChannelFullInfo}
                    />
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

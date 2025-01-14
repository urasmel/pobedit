import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridActionsCellItem,
} from "@mui/x-data-grid";
import React, {
    Suspense,
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
import { ErrorAction } from "@/shared/components/ErrorrAction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { channelApi } from "@/entities/channels";
import { Channel } from "@/entities/channels/model/Channel";
import { ChannelInfoDialog } from "../ChannelInfoDialog";

const Channels = () => {


    const selectedUser = useMainStore((state: MainState) => state.selectedUser);
    const [channelId, setChannelId] = useState<string | undefined>(undefined);

    const queryClient = useQueryClient();
    const { data, isFetching, isLoading, isError, error } = useQuery(channelApi.channelQueries.list(selectedUser));
    const { data: channelInfo } = useQuery(channelApi.channelQueries.details(selectedUser, channelId));

    const navigate = useNavigate();
    const [openShowChannelInfo, setOpenShowChannelInfo] = useState(false);

    const [openErrorMessage, setOpenErrorMessage] = useState(false);

    useEffect(() => {
        // if (selectedUser != undefined) {
        //     queryClient.invalidateQueries(channelApi.channelQueries.list().queryKey);
        // }
    }, [selectedUser]);

    const columns = useMemo<GridColDef<Channel>[]>(() => [
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
            getActions: (params: GridRowParams<Channel>) => [
                <GridActionsCellItem
                    key={0}
                    icon={<InfoIcon />}
                    label="Показать информацию"
                    onClick={() => {
                        setChannelId(params.row.id.toString());
                        setOpenShowChannelInfo(true);
                    }}
                />,
            ],
        },
    ], []);

    const handleChannelRowClick = (params: GridRowParams<Channel>) => {
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
                        onRowClick={handleChannelRowClick}
                        columnVisibilityModel={{
                            id: false,
                        }}
                        slots={{
                            toolbar: () => DataGridTitle("Channels"),
                            noRowsOverlay: CustomNoRowsOverlay,
                        }}
                        rows={data ? data.channels : []}
                        columns={columns}
                        loading={isLoading || isFetching}
                    />
                </Suspense>
            </div>

            <div className={styles.channels__buttons}>
                <Button
                    sx={{
                        width: "100px",
                    }}
                    variant="contained"
                >
                    Добавить
                </Button>

                <Button
                    sx={{
                        width: "100px",
                    }}
                    variant="contained"
                >
                    Обновить
                </Button>
            </div>

            {
                channelInfo != null && <Dialog
                    open={openShowChannelInfo}
                    onClose={() => { setOpenShowChannelInfo(false); }}
                >
                    <DialogTitle>Channel info</DialogTitle>
                    <DialogContent>
                        <ChannelInfoDialog channel={channelInfo} />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => { setOpenShowChannelInfo(false); }}>
                            Закрыть
                        </Button>
                    </DialogActions>
                </Dialog>}

            <Snackbar
                open={isError}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                message={error?.message}
                action={ErrorAction(handleErrorClose)}
            />
        </section>
    );
};

export default Channels;

import {
    Alert,
    Box,
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
import {
    Suspense,
    useEffect,
    useMemo,
    useState,
} from "react";
import CustomNoRowsOverlay from "@/shared/components/CustomNoRowsOverlay";
import { MainState, Action, useMainStore } from "@/app/stores";
import DataGridTitle from "@/shared/components/DataGridTitle";
import { Loading } from "@/shared/components/Loading";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import { ErrorAction } from "@/shared/components/ErrorrAction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { channelsApi } from "@/entities/channels";
import { Channel } from "@/entities/channels/model/Channel";
import { ChannelInfoDialog } from "@/features/ChannelInfoDialog";

export const Channels = () => {


    const selectedUser = useMainStore((state: MainState) => state.selectedUser);
    const updateChannels = useMainStore((action: Action) => action.fetchUpdatedChannels);
    const [channelId, setChannelId] = useState<string | undefined>(undefined);

    const queryClient = useQueryClient();
    const { data, isFetching, isLoading, isError, error } = useQuery(channelsApi.channelQueries.list());
    const { data: channelInfo } = useQuery(channelsApi.channelQueries.details(channelId));

    const navigate = useNavigate();
    const [openShowChannelInfo, setOpenShowChannelInfo] = useState(false);

    const [openErrorMessage, setOpenErrorMessage] = useState(false);

    useEffect(() => {
        // if (selectedUser != undefined) {
        //     queryClient.invalidateQueries(channelApi.channelQueries.list().queryKey);
        // }
    }, [selectedUser]);

    function getRowId(row: Channel) {
        return row.tlgId;
    }

    const columns = useMemo<GridColDef<Channel>[]>(() => [
        { field: "tlgId", headerName: "ID", width: 100 },
        { field: "title", headerName: "Заголовок", flex: 1 },
        { field: "mainUsername", headerName: "Владелец", flex: 1 },
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
                        setChannelId(params.row.tlgId.toString());
                        setOpenShowChannelInfo(true);
                    }}
                />,
            ],
        },
    ], []);

    const handleChannelRowClick = (params: GridRowParams<Channel>) => {
        navigate(`/channels/${params.row.tlgId}/posts`);
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
            <div style={{ height: 400, width: "100%" }}>
                <Suspense fallback={<Loading />}>
                    <DataGrid
                        getRowId={getRowId}
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
                            toolbar: () => DataGridTitle("Каналы"),
                            noRowsOverlay: CustomNoRowsOverlay,
                        }}
                        rows={data ? data.channels : []}
                        columns={columns}
                        loading={isLoading || isFetching}
                    />
                </Suspense>
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
                >
                    Добавить
                </Button>

                <Button
                    sx={{
                        width: "100px",
                    }}
                    variant="contained"
                    onClick={() => updateChannels()}
                >
                    Обновить
                </Button>
            </Box>

            {
                channelInfo != null &&
                <Dialog
                    sx={{ ".MuiPaper-root": { maxWidth: "none" } }}
                    open={openShowChannelInfo}
                    onClose={() => { setOpenShowChannelInfo(false); }}
                >
                    <DialogTitle>Информация о канале</DialogTitle>
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

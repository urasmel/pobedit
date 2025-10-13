// import {
//     Box,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
// } from "@mui/material";
// import {
//     DataGrid,
//     GridColDef,
//     GridRowParams,
//     GridActionsCellItem,
// } from "@mui/x-data-grid";
// import {
//     useCallback,
//     useMemo,
//     useState,
// } from "react";
// import { CustomNoRowsOverlay } from "@/shared/components/custom-no-rows-overlay";
// import { Action, useMainStore } from "@/app/stores";
// import { DataGridTitle } from "@/shared/components/data-grid-title";
// import InfoIcon from "@mui/icons-material/Info";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { channelsApi } from "@/entities/channels";
// import { Channel } from "@/entities/channels/model/channel";
// import { ChannelInfoDialog } from "@/features/channel-info-dialog";
// import { useTranslation } from "react-i18next";
// import { getLocalizedString } from "@/shared/locales/localizing";
// import { useSnackbar } from 'notistack';
// import { queryClient } from "@/shared/api/query-client";

// export const Channels = () => {

//     const { t, i18n } = useTranslation();
//     const { enqueueSnackbar } = useSnackbar();
//     const updateChannels = useMainStore((action: Action) => action.fetchUpdatedChannels);
//     const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>();
//     const navigate = useNavigate();

//     const {
//         data,
//         isFetching,
//         isLoading,
//         isError,
//         error
//     } = useQuery(channelsApi.channelQueries.list());

//     const { data: channelInfo } = useQuery({
//         ...channelsApi.channelQueries.details(selectedChannelId), enabled: !!selectedChannelId
//     });

//     const [isChannelInfoOpen, setIsChannelInfoOpen] = useState(false);

//     const columns = useMemo<GridColDef<Channel>[]>(() => [
//         {
//             field: "tlgId",
//             headerName: t("channels.id") || "ID",
//             width: 100
//         },
//         {
//             field: "title",
//             headerName: t("channels.title") || "Заголовок",
//             flex: 1
//         },
//         {
//             field: "mainUsername",
//             headerName: t("channels.owner") || "Владелец",
//             flex: 1
//         },
//         {
//             field: "actions",
//             type: "actions",
//             flex: 1,
//             headerName: t("channels.operations") || "Операции",
//             getActions: (params: GridRowParams<Channel>) => [
//                 <GridActionsCellItem
//                     key="info"
//                     icon={<InfoIcon />}
//                     label={t("channels.showInfo") || "Показать информацию"}
//                     onClick={() => handleShowChannelInfo(params.row.tlgId.toString())
//                     }
//                 />,
//             ],
//         },
//     ], []);

//     const handleShowChannelInfo = useCallback((channelId: string) => {
//         setSelectedChannelId(channelId);
//         setIsChannelInfoOpen(true);
//     }, []);

//     const handleCloseChannelInfo = useCallback(() => {
//         setIsChannelInfoOpen(false);
//         setSelectedChannelId(undefined);
//     }, []);

//     const handleChannelRowClick = useCallback((params: GridRowParams<Channel>) => {
//         navigate(`/channels/${params.row.tlgId}/posts`);
//     }, [navigate]);

//     const handleUpdateChannels = useCallback(async () => {
//         try {
//             await updateChannels();
//             queryClient.invalidateQueries({
//                 queryKey: channelsApi.channelQueries.channels()
//             });
//             enqueueSnackbar(
//                 t("channels.updateSuccess") || "Каналы успешно обновлены.",
//                 { variant: 'success' }
//             );
//         } catch (error) {
//             enqueueSnackbar(
//                 getLocalizedString(error as Error, t),
//                 { variant: 'error' }
//             );
//         }
//     }, [updateChannels, queryClient, enqueueSnackbar, t]);

//     // Обработка ошибки запроса
//     if (isError) {
//         enqueueSnackbar(
//             getLocalizedString(error, t),
//             { variant: 'error' }
//         );
//     }

//     return (
//         <Box sx={{
//             display: "flex",
//             flexDirection: "column",
//             width: "100%",
//             height: "100%",
//             minHeight: "400px", // Разумный минимум вместо 50%
//             boxSizing: "border-box",
//             minWidth: 0, // ⚠️ Разрешает сжатие
//             overflow: 'hidden', // Контролируем переполнение
//         }}>
//             <DataGrid
//                 getRowId={(row: Channel) => row.tlgId}
//                 sx={{
//                     "--DataGrid-overlayHeight": "300px",
//                     "& .MuiDataGrid-row:hover": {
//                         cursor: "pointer",
//                     },
//                     flex: 1, // Занимает доступное пространство
//                     minWidth: 0, // Разрешает сжатие
//                     overflow: 'auto', // Скролл внутри таблицы
//                 }}
//                 onRowClick={handleChannelRowClick}
//                 columnVisibilityModel={{
//                     id: false,
//                 }}
//                 slots={{
//                     toolbar: () => (
//                         <DataGridTitle
//                             title={t("channels.title") || "Каналы"}
//                         />
//                     ),
//                     noRowsOverlay: CustomNoRowsOverlay,
//                 }}
//                 slotProps={{
//                     loadingOverlay: {
//                         variant: 'skeleton',
//                         noRowsVariant: 'skeleton',
//                     },
//                 }}
//                 rows={data ? data.channels : []}
//                 columns={columns}
//                 loading={isLoading || isFetching}
//             />

//             <Box sx={{
//                 marginTop: "1rem",
//                 display: "flex",
//                 columnGap: "1rem"
//             }}>
//                 <Button
//                     sx={{ width: "100px", }}
//                     variant="contained"
//                 >
//                     {t("channels.add") || "Добавить"}
//                 </Button>

//                 <Button
//                     sx={{ minWidth: "100px" }}
//                     variant="contained"
//                     onClick={handleUpdateChannels}
//                     disabled={isFetching}
//                     loadingPosition="start"
//                     loading={isFetching}
//                 >
//                     {t("channels.update") || "Обновить"}
//                 </Button>
//             </Box>

//             <Dialog
//                 sx={{
//                     "& .MuiPaper-root": {
//                         width: "90%",
//                         maxWidth: "600px"
//                     }
//                 }}
//                 open={isChannelInfoOpen}
//                 onClose={handleCloseChannelInfo}
//             >
//                 <DialogTitle>
//                     {t("channels.channelInfo") || "Информация о канале"}
//                 </DialogTitle>

//                 <DialogContent>
//                     {channelInfo && <ChannelInfoDialog channel={channelInfo} />}
//                 </DialogContent>

//                 <DialogActions>
//                     <Button onClick={handleCloseChannelInfo}>
//                         {t("common.close") || "Закрыть"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box >
//     );
// };
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useTheme,
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridActionsCellItem,
} from "@mui/x-data-grid";
import {
    useCallback,
    useMemo,
    useState,
    useEffect,
} from "react";
import { CustomNoRowsOverlay } from "@/shared/components/custom-no-rows-overlay";
import { Action, useMainStore } from "@/app/stores";
import { DataGridTitle } from "@/shared/components/data-grid-title";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { channelsApi } from "@/entities/channels";
import { Channel } from "@/entities/channels/model/channel";
import { ChannelInfoDialog } from "@/features/channel-info-dialog";
import { useTranslation } from "react-i18next";
import { getLocalizedString } from "@/shared/locales/localizing";
import { useSnackbar } from 'notistack';
import { queryClient } from "@/shared/api/query-client";
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';

export const Channels = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const updateChannels = useMainStore((action: Action) => action.fetchUpdatedChannels);
    const [selectedChannelId, setSelectedChannelId] = useState<string>();
    const [isChannelInfoOpen, setIsChannelInfoOpen] = useState(false);

    // Запрос списка каналов
    const {
        data,
        isFetching,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        ...channelsApi.channelQueries.list(),
        onError: (err) => {
            const errorMsg = getLocalizedString(err, t);
            enqueueSnackbar(errorMsg, { variant: 'error' });
        }
    });

    // Запрос информации о канале (только при открытии диалога)
    const {
        data: channelInfo,
        isLoading: isChannelInfoLoading,
        error: channelInfoError
    } = useQuery({
        ...channelsApi.channelQueries.details(selectedChannelId!),
        // enabled: !!selectedChannelId,
    });

    // Обработка ошибки информации о канале
    useEffect(() => {
        if (channelInfoError && isChannelInfoOpen) {
            const errorMsg = getLocalizedString(channelInfoError, t);
            enqueueSnackbar(errorMsg, { variant: 'error' });
        }
    }, [channelInfoError, isChannelInfoOpen, enqueueSnackbar, t]);

    // Мемоизированные колонки с правильными зависимостями
    const columns = useMemo<GridColDef<Channel>[]>(() => [
        {
            field: "tlgId",
            headerName: t("channels.id") || "ID",
            width: 100,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "title",
            headerName: t("channels.title") || "Заголовок",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "mainUsername",
            headerName: t("channels.owner") || "Владелец",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "actions",
            type: "actions",
            width: 100,
            headerName: t("channels.operations") || "Операции",
            headerAlign: 'center',
            align: 'center',
            getActions: (params: GridRowParams<Channel>) => [
                <GridActionsCellItem
                    key="info"
                    icon={<InfoIcon />}
                    label={t("channels.showInfo") || "Показать информацию"}
                    onClick={() => handleShowChannelInfo(params.row.tlgId.toString())}
                    sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                        }
                    }}
                />,
            ],
        },
    ], [t, theme]);

    // Обработчики с useCallback
    const handleShowChannelInfo = useCallback((channelId: string) => {
        setSelectedChannelId(channelId);
        setIsChannelInfoOpen(true);
    }, []);

    const handleCloseChannelInfo = useCallback(() => {
        setIsChannelInfoOpen(false);
        setSelectedChannelId(undefined);
    }, []);

    const handleChannelRowClick = useCallback((params: GridRowParams<Channel>) => {
        navigate(`/channels/${params.row.tlgId}/posts`);
    }, [navigate]);

    const handleUpdateChannels = useCallback(async () => {
        try {
            await updateChannels();
            await queryClient.invalidateQueries({
                queryKey: channelsApi.channelQueries.channels()
            });
            enqueueSnackbar(
                t("channels.updateSuccess") || "Каналы успешно обновлены.",
                { variant: 'success' }
            );
        } catch (error) {
            const errorMsg = getLocalizedString(error as Error, t);
            enqueueSnackbar(errorMsg, { variant: 'error' });
        }
    }, [updateChannels, enqueueSnackbar, t]);

    const handleAddChannel = useCallback(() => {
        // TODO: Реализовать добавление канала
        enqueueSnackbar("Функция добавления канала в разработке", { variant: 'info' });
    }, [enqueueSnackbar]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const channels = data?.channels || [];

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            minHeight: 400,
            gap: 2,
        }}>
            {/* Таблица каналов */}
            <Box sx={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <DataGrid
                    getRowId={(row: Channel) => row.tlgId}
                    sx={{
                        flex: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.shape.borderRadius,
                        color: "#344767",
                        '& .MuiDataGrid-cell': {
                            borderColor: theme.palette.divider,
                            '&:focus': { outline: 'none' },
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: theme.palette.background.default,
                            borderColor: theme.palette.divider,
                        },
                        '& .MuiDataGrid-row': {
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                cursor: "pointer",
                            },
                        },
                    }}
                    onRowClick={handleChannelRowClick}
                    rows={channels}
                    columns={columns}
                    loading={isLoading || isFetching}
                    disableColumnMenu
                    disableRowSelectionOnClick
                    slots={{
                        toolbar: DataGridTitle,
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    slotProps={{
                        toolbar: {
                            title: t("channels.title") || "Каналы",
                        },
                        loadingOverlay: {
                            variant: 'skeleton',
                            noRowsVariant: 'skeleton',
                        },
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                />
            </Box>

            {/* Кнопки действий */}
            <Box sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                flexWrap: 'wrap'
            }}>
                <Button
                    onClick={handleUpdateChannels}
                    disabled={isFetching}
                    sx={{ minWidth: 120 }}
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    sx={{ minWidth: 120 }}
                >
                    {t("channels.update") || "Обновить"}
                </Button>

                <Button
                    variant="contained"
                    onClick={handleRefresh}
                    disabled={isFetching}
                    startIcon={<AddIcon />}
                    sx={{ minWidth: 120 }}
                >
                    {t("channels.add") || "Добавить"}
                </Button>

            </Box>

            {/* Диалог информации о канале */}
            <Dialog
                open={isChannelInfoOpen}
                onClose={handleCloseChannelInfo}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: theme.shape.borderRadius,
                        minHeight: 400,
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.default,
                }}>
                    {t("channels.channelInfo") || "Информация о канале"}
                </DialogTitle>

                <DialogContent sx={{ py: 2 }}>
                    {channelInfo && <ChannelInfoDialog channel={channelInfo} />}
                </DialogContent>

                <DialogActions sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    padding: theme.spacing(1, 2),
                }}>
                    <Button
                        onClick={handleCloseChannelInfo}
                        variant="outlined"
                    >
                        {t("common.close") || "Закрыть"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

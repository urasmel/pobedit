import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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

export const Channels = () => {

    const { t, i18n } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const updateChannels = useMainStore((action: Action) => action.fetchUpdatedChannels);
    const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>();
    const navigate = useNavigate();

    const {
        data,
        isFetching,
        isLoading,
        isError,
        error
    } = useQuery(channelsApi.channelQueries.list());

    const { data: channelInfo } = useQuery({
        ...channelsApi.channelQueries.details(selectedChannelId), enabled: !!selectedChannelId
    });

    const [isChannelInfoOpen, setIsChannelInfoOpen] = useState(false);

    const columns = useMemo<GridColDef<Channel>[]>(() => [
        {
            field: "tlgId",
            headerName: t("channels.id") || "ID",
            width: 100
        },
        {
            field: "title",
            headerName: t("channels.title") || "Заголовок",
            flex: 1
        },
        {
            field: "mainUsername",
            headerName: t("channels.owner") || "Владелец",
            flex: 1
        },
        {
            field: "actions",
            type: "actions",
            flex: 1,
            headerName: t("channels.operations") || "Операции",
            getActions: (params: GridRowParams<Channel>) => [
                <GridActionsCellItem
                    key="info"
                    icon={<InfoIcon />}
                    label={t("channels.showInfo") || "Показать информацию"}
                    onClick={() => handleShowChannelInfo(params.row.tlgId.toString())
                    }
                />,
            ],
        },
    ], []);

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
            queryClient.invalidateQueries({
                queryKey: channelsApi.channelQueries.channels()
            });
            enqueueSnackbar(
                t("channels.updateSuccess") || "Каналы успешно обновлены.",
                { variant: 'success' }
            );
        } catch (error) {
            enqueueSnackbar(
                getLocalizedString(error as Error, t),
                { variant: 'error' }
            );
        }
    }, [updateChannels, queryClient, enqueueSnackbar, t]);

    // Обработка ошибки запроса
    if (isError) {
        enqueueSnackbar(
            getLocalizedString(error, t),
            { variant: 'error' }
        );
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            minHeight: "400px", // Разумный минимум вместо 50%
            boxSizing: "border-box",
            minWidth: 0, // ⚠️ Разрешает сжатие
            overflow: 'hidden', // Контролируем переполнение
        }}>
            <DataGrid
                getRowId={(row: Channel) => row.tlgId}
                sx={{
                    "--DataGrid-overlayHeight": "300px",
                    "& .MuiDataGrid-row:hover": {
                        cursor: "pointer",
                    },
                    flex: 1, // Занимает доступное пространство
                    minWidth: 0, // Разрешает сжатие
                    overflow: 'auto', // Скролл внутри таблицы
                }}
                onRowClick={handleChannelRowClick}
                columnVisibilityModel={{
                    id: false,
                }}
                slots={{
                    toolbar: () => (
                        <DataGridTitle
                            title={t("channels.title") || "Каналы"}
                        />
                    ),
                    noRowsOverlay: CustomNoRowsOverlay,
                }}
                slotProps={{
                    loadingOverlay: {
                        variant: 'skeleton',
                        noRowsVariant: 'skeleton',
                    },
                }}
                rows={data ? data.channels : []}
                columns={columns}
                loading={isLoading || isFetching}
            />

            <Box sx={{
                marginTop: "1rem",
                display: "flex",
                columnGap: "1rem"
            }}>
                <Button
                    sx={{ width: "100px", }}
                    variant="contained"
                >
                    {t("channels.add") || "Добавить"}
                </Button>

                <Button
                    sx={{ minWidth: "100px" }}
                    variant="contained"
                    onClick={handleUpdateChannels}
                    disabled={isFetching}
                    loadingPosition="start"
                    loading={isFetching}
                >
                    {t("channels.update") || "Обновить"}
                </Button>
            </Box>

            <Dialog
                sx={{
                    "& .MuiPaper-root": {
                        width: "90%",
                        maxWidth: "600px"
                    }
                }}
                open={isChannelInfoOpen}
                onClose={handleCloseChannelInfo}
            >
                <DialogTitle>
                    {t("channels.channelInfo") || "Информация о канале"}
                </DialogTitle>

                <DialogContent>
                    {channelInfo && <ChannelInfoDialog channel={channelInfo} />}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseChannelInfo}>
                        {t("common.close") || "Закрыть"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

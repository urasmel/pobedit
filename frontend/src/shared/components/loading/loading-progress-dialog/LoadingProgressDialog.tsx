import { Button, Typography, Modal, Box, CircularProgress } from '@mui/material';
import { LoadingProgressDialogProps } from '@/entities/Props/LoadingProgressDialogProps';

export const LoadingProgressDialog = (props: LoadingProgressDialogProps) => {
    const { date, open, cancellLoading } = props;

    return (
        <Modal
            onClose={cancellLoading}
            open={open}
        >

            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: "fillContent",
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 3,
                borderRadius: "var(--radius-md)",
                borderColor: 'text.primary',
            }}>

                {
                    date !== undefined && date !== "" &&
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        Загружен {props.type === "comment" ? "комментарий" : "пост"} от: {date}
                    </Typography>
                }

                <Box
                    sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'space-around',
                        height: '40px',
                    }}>

                    <Button
                        variant="contained"
                        onClick={cancellLoading}
                        loadingPosition="start"
                        startIcon={<CircularProgress color="inherit" size={20} />}
                        sx={{
                            display: 'flex',
                            gap: 1,
                        }}
                    >
                        Прервать загрузку
                    </Button>

                </Box>
            </Box>
        </Modal>
    );
};

LoadingProgressDialog.displayName = 'LoadingProgressDialog';

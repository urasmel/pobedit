import { Button, Typography, Modal, Box, CircularProgress } from '@mui/material';
import { LoadingProgessDialogProps } from '@/entities/Props/LoadingProgessDialogProps';

export const LoadingProgessDialog = (props: LoadingProgessDialogProps) => {
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
                width: 350,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 3,
                borderRadius: 1,
                borderColor: 'text.primary',
            }}>

                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around'
                    }}
                >
                    Загрузка данных с датой: {date}
                </Typography>

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

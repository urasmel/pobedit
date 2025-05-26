import { Button, Typography, Modal, Box } from '@mui/material';
import { Loading } from '@/shared/components/loading/loading-widget';
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
                width: 450,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 3,
                border: 0,
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
                        justifyContent: 'space-around'
                    }}>

                    <Button
                        variant="contained"
                        onClick={cancellLoading}
                        loadingPosition="start"
                    >
                        Прервать загрузку
                    </Button>

                    <Loading />
                </Box>
            </Box>
        </Modal>
    );
};

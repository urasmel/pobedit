import { styled } from '@mui/material';
import { MaterialDesignContent } from 'notistack';

export const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    '&.notistack-MuiContent-success': {
        backgroundColor: '#2D7738',
        fontFamily: "Roboto",
    },
    '&.notistack-MuiContent-error': {
        backgroundColor: '#970C0C',
        fontFamily: "Roboto",
    },
}));

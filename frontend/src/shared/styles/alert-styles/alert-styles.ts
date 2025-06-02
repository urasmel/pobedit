import { styled } from '@mui/material';
import { MaterialDesignContent } from 'notistack';

export const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    '&.notistack-MuiContent-success': {
        backgroundColor: '#388e3c',
        fontFamily: "Roboto",
    },
    '&.notistack-MuiContent-error': {
        backgroundColor: '#d32f2f',
        fontFamily: "Roboto",
    },
}));

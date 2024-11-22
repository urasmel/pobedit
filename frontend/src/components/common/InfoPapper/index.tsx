import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
    paddingLeft: 10,
    paddingRight: 10,
    width: 'max-content'
}));

const lightTheme = createTheme({ palette: { mode: 'light' } });

export default function InfoPapper({ message }: { message: string; }) {
    return (
        <ThemeProvider theme={lightTheme}>
            <Item elevation={1}>
                {message}
            </Item>
        </ThemeProvider>
    );
}

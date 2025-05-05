import { createTheme } from "@mui/material";
import { createContext } from "react";

export const theme = createTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#1976d2',
            dark: '#002884',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
    },
});
export const ThemeContext = createContext(theme);

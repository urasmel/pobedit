import { Box } from '@mui/material';
import { ReactNode } from 'react';

export const ChannelMainInfoBox = ({ children }: { children: ReactNode; }) => {

    return (

        <Box sx={{
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "medium",
            display: "flex",
            flexDirection: "column",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
            padding: ".5rem",
            rowGap: "1rem",
            fontWeight: "500",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            color: "#344767",
            lineHeight: "1.5rem"
        }}>
            {children}
        </Box>

    );
};

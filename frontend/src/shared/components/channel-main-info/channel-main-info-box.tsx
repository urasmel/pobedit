import { Box } from '@mui/material';
import { ReactNode } from 'react';


interface ChannelMainInfoBoxProps {
    children: ReactNode;
}

export const ChannelMainInfoBox = ({ children }: ChannelMainInfoBoxProps) => {

    return (

        <Box sx={{
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "medium",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            rowGap: "1rem",
            fontWeight: "500",
            maxHeight: "87.5px",
            height: "100%",
            color: "#344767",
            lineHeight: "1.5rem",
            minHeight: '85px',
            minWidth: "200px",
            width: "fit-content",
            boxSizing: "border-box" as const,
            borderRadius: "var(--radius-md)",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            padding: 1,
        }}>
            {children}
        </Box>

    );
};

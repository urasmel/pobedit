import { Box, Typography, useTheme } from '@mui/material';
import { memo } from 'react';

interface FooterProps {
    appName?: string;
    showYear?: boolean;
}

export const Footer = memo(({
    appName = 'Pobedit',
    showYear = true
}: FooterProps) => {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 64,
                padding: 2,
                boxShadow: theme.shadows[2],
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="medium"
            >
                {appName} {showYear && `© ${new Date().getFullYear()}`}
            </Typography>
        </Box>
    );
});

Footer.displayName = 'Footer';
